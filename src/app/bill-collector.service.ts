import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { CommonUtilsService } from './common-utils.service';
import { Bill, Client, FileHeader } from './types';

@Injectable({
  providedIn: 'root'
})
export class BillCollectorService {

  constructor(private http: HttpClient, private dataCollector: CommonUtilsService) { }

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

  private handleBills(header: FileHeader, content: string[][]): Bill[] {
    return content.map(line => {
      const getEntry = (identifier: string) => line[header.fields.indexOf(identifier)];
      const getStringEntry = (identifier: string) => getEntry(identifier).slice(1, -1).trim();
      const getNumberEntry = (identifier: string) => +getEntry(identifier).replace(',','.');
      return {
        amount: getNumberEntry('Betrag'),
        amountStorno: getNumberEntry('St_Betrag'),
        id: getStringEntry('rnr'),
        canceled: getStringEntry('Storniert'),
        clientId: +getStringEntry('Patnr'),
        date: getEntry('datum'),
        taxApplied: getNumberEntry('Mwst'),
        taxFull: getNumberEntry('MwstSatz'),
        taxDifferent: getStringEntry('AndererMwst'),
        taxReduced: getNumberEntry('MwstSatzErm'),
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
