import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { INDEX_XML_FILEPATH } from './app-constants';
import { CommonUtilsService } from './common-utils.service';
import { Bill, Client, FileHeader, Payment } from './types';

@Injectable({
  providedIn: 'root'
})
export class BillCollectorService {
  public bills$: Observable<any>;

  constructor(private http: HttpClient, private dataCollector: CommonUtilsService) {
    this.bills$ = this.loadBills(INDEX_XML_FILEPATH);
   }

  private loadBills(filepath: string) {
    return this.http.get(filepath, {responseType: 'text'})
      .pipe(
        switchMap(data => {
          return from(xml2js.parseStringPromise(data)).pipe(
            switchMap(this.handleJsonData.bind(this))
        )})
      );
  }

  private handleJsonData(json): Observable<Bill[]> {
    const fileHeaders = this.readFileHeadersFromJson(json);
    // const billsHeader = fileHeaders.filter(header => header.url === 'rechnungen.txt')[0];
    const clientsHeader = fileHeaders.filter(header => header.url === 'patienten.txt')[0];
    const paymentsHeader = fileHeaders.filter(header => header.url === 'zahlungen.txt')[0];
    const clientsData$: Observable<Client[]> = this.processFile(clientsHeader, this.handleClients.bind(this));
    // const billsData$: Observable<Bill[]> = this.processFile(billsHeader, this.handleBills.bind(this));
    const paymentsData$: Observable<Bill[]> = this.processFile(paymentsHeader, this.handlePayments.bind(this));
    return forkJoin([clientsData$, paymentsData$]).pipe(
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
        map(data => handleLines(header, this.dataCollector.splitCsvFile(data)))
      );
  }

  private handleClients(header: FileHeader, content: string[][]): Client[] {
    const refinedClients: Client[] = content.map(line => {
      const getEntry = (identifier: string) => line[header.fields.indexOf(identifier)];
      const getStringEntry = (identifier: string) => getEntry(identifier).slice(1, -1).trim();
      const getNumberEntry = (identifier: string) => +getEntry(identifier);
      return {
        id: getNumberEntry('Patnr'),
        lastName: getStringEntry('Name'),
        firstName: getStringEntry('Vorname'),
        street: getStringEntry('Strasse'),
        zip: getStringEntry('Plz'),
        city: getStringEntry('Ort'),
        country: getStringEntry('Land'),
      }
    });
    return refinedClients;
  }

  // private handleBills(header: FileHeader, content: string[][]): Bill[] {
  //   return content.map(line => {
  //     const getEntry = (identifier: string) => line[header.fields.indexOf(identifier)];
  //     const getStringEntry = (identifier: string) => getEntry(identifier).slice(1, -1).trim();
  //     const getNumberEntry = (identifier: string) => +getEntry(identifier).replace(',','.');
  //     return {
  //       amount: getNumberEntry('Betrag'),
  //       amountStorno: getNumberEntry('St_Betrag'),
  //       id: getStringEntry('rnr'),
  //       canceled: getStringEntry('Storniert'),
  //       clientId: +getStringEntry('Patnr'),
  //       date: getEntry('datum'),
  //       taxApplied: getNumberEntry('Mwst'),
  //       taxFull: getNumberEntry('MwstSatz'),
  //       taxDifferent: getStringEntry('AndererMwst'),
  //       taxReduced: getNumberEntry('MwstSatzErm'),
  //     };
  //   });
  // }

  private handlePayments(header: FileHeader, content: string[][]): Bill[] {
    const payments = this.contentToPayments(header, content);
    return this.paymentsToBills(payments);
  }

  private contentToPayments(header: FileHeader, content: string[][]): Payment[] {
    return content.map(line => {
      const getEntry = (identifier: string) => line[header.fields.indexOf(identifier)];
      const getStringEntry = (identifier: string) => getEntry(identifier).slice(1, -1).trim();
      const getNumberEntry = (identifier: string) => +getEntry(identifier).replace(',','.');
      return {
        billId: getEntry('rnr'),
        receiptNumber: getNumberEntry('belegnr'),
        paymentDate: getEntry('datum'),
        clientId: getNumberEntry('Patnr'),
        process: getStringEntry('vorgang'),
        amount: getNumberEntry('Betrag'),
        sourceAccount: getNumberEntry('kontonr'),
        contraAccount: getNumberEntry('gegenkonto'),
        changeDate: getEntry('date'),
        changeTime: getNumberEntry('time'),
      };
    });
  }

  private paymentsToBills(payments: Payment[]): Bill[] {
    const bills = payments.filter(payment => payment.process === 'Rechnungsstellung');
    const warnings = payments.filter(payment => payment.process === 'Mahnung');
    return bills.map(bill => {
      const amount = bill.amount + warnings.filter(warning => warning.billId === bill.billId).reduce((acc, curr) => acc + curr.amount, 0);
      return {
        amount,
        clientId: bill.clientId,
        id: bill.billId,
        date: bill.paymentDate,
      };
    });
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
}
