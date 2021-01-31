import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { forkJoin, from, Observable } from 'rxjs';
import { Bill, Client, FileHeader, Transaction } from './types';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  public bills$ = new Observable<Bill[]>();

  constructor(private http: HttpClient) {}

  public loadBills() {
    return this.http.get('assets/index.xml', {responseType: 'text'})
      .pipe(
        switchMap(data => {
          return from(xml2js.parseStringPromise(data)).pipe(
            switchMap(this.handleJsonData.bind(this))
        )})
      );
  }

  private handleJsonData(json): Observable<Bill[]> {
    const fileHeaders = this.readFileHeadersFromJson(json);
    const billsHeader = fileHeaders.filter(header => header.url === 'rechnungen.txt')[0];
    const clientsHeader = fileHeaders.filter(header => header.url === 'patienten.txt')[0];
    const clientsData$ = this.processFile(clientsHeader, this.handleClients.bind(this));
    const billsData$ = this.processFile(billsHeader, this.handleBills.bind(this));
    return forkJoin([clientsData$, billsData$]).pipe(
      map(data => this.enrichBillsData(data[0], data[1]))
    );
  }

  private readFileHeadersFromJson(json: any): FileHeader[] {
    return json.DataSet.Media[0].Table.map(table => {
      const fields = [];
      if(table.VariableLength[0].VariablePrimaryKey) {
        fields.push(table.VariableLength[0].VariablePrimaryKey[0].Name[0]);
      }
      fields.push(...table.VariableLength[0].VariableColumn.map(column => column.Name[0]));
      return {
        url: table.URL[0],
        fields: fields
      }
    });
  }

  private processFile(header: FileHeader, handleLines: Function) {
    return this.http.get(`assets/${header.url}`, {responseType: 'text'})
      .pipe(
        map(data => handleLines(header, this.splitCsvFile(data)))
      );
  }

  private handleClients(header: FileHeader, content: string[][]): Client[] {
    const refinedClients: Client[] = content.map(line => {
      return {
        id: +line[header.fields.indexOf('Patnr')],
        lastName: line[header.fields.indexOf('Name')].slice(1, -1).trim(),
        firstName: line[header.fields.indexOf('Vorname')].slice(1, -1).trim(),
        street: line[header.fields.indexOf('Strasse')].slice(1, -1).trim(),
        zip: +line[header.fields.indexOf('Plz')].slice(1, -1).trim(),
        city: line[header.fields.indexOf('Ort')].slice(1, -1).trim(),
        country: line[header.fields.indexOf('Land')].slice(1, -1).trim(),
      }
    });
    return refinedClients;
  }

  private splitCsvFile(content): string[][] {
    return content.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
  }

  private handleBills(header: FileHeader, content: string[][]): Bill[] {
    const refinedBills: Bill[] = content.map(line => {
      return {
        amount: +line[header.fields.indexOf('Betrag')].slice(1, -1).trim().replace(',','.'),
        amountStorno: +line[header.fields.indexOf('St_Betrag')].replace(',','.'),
        id: +line[header.fields.indexOf('rnr')].slice(1, -1).trim(),
        canceled: line[header.fields.indexOf('Storniert')].slice(1, -1).trim(),
        clientId: +line[header.fields.indexOf('Patnr')].slice(1, -1).trim(),
        date: line[header.fields.indexOf('datum')],
        taxApplied: +line[header.fields.indexOf('Mwst')].slice(1, -1).trim().replace(',','.'),
        taxFull: +line[header.fields.indexOf('MwstSatz')],
        taxDifferent: line[header.fields.indexOf('AndererMwst')].slice(1, -1).trim(),
        taxReduced: +line[header.fields.indexOf('MwstSatzErm')],
      };
    });
    return refinedBills;
  }

  private enrichBillsData(clientData: Client[], billsData: Bill[]): Bill[] {
    return billsData.map(bill => {
      const matchingClient = clientData.filter(client => client.id === bill.clientId)[0];
      return {
        ...bill,
        firstName: matchingClient ? matchingClient.firstName : '',
        lastName: matchingClient ? matchingClient.lastName : ''
      }
    });
  }

  public loadTransactions(): Observable<Transaction[]> {
    return this.http.get('assets/umsaetze.CSV', {responseType: 'text'})
      .pipe(
        map(data => this.splitCsvFile(data)),
        map(data => this.extractPayments(data))
      );
  }

  private extractPayments(content: string[][]): Transaction[] {
    const header = content[0].map(field => field.slice(1, -1));
    return content.slice(1).map(entry => {
      const getEntry = (identifier: string) => entry[header.indexOf(identifier)].slice(1, -1);
      const getEntryAsNumber = (identifier: string) => +getEntry(identifier).replace(',','.');
      return {
        orderAccount: getEntry('Auftragskonto'),
        transactionDate: getEntry('Buchungstag'),
        valutaData: getEntry('Valutadatum'),
        bookingText: getEntry('Buchungstext'),
        usage: getEntry('Verwendungszweck'),
        creditorId: getEntry('Glaeubiger ID'),
        mandateReference: getEntry('Mandatsreferenz'),
        clientReference: getEntry('Kundenreferenz (End-to-End)'),
        collectiveReference: getEntry('Sammlerreferenz'),
        directDebit: getEntryAsNumber('Lastschrift Ursprungsbetrag'),
        returnDebit: getEntryAsNumber('Auslagenersatz Ruecklastschrift'),
        payer: getEntry('Beguenstigter/Zahlungspflichtiger'),
        iban: getEntry('Kontonummer/IBAN'),
        bic: getEntry('BIC (SWIFT-Code)'),
        amount: getEntryAsNumber('Betrag'),
        currency: getEntry('Waehrung'),
        info: getEntry('Info'),
      }
    });
  }

}

