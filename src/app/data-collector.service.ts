import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { Bill, Client, FileHeader } from './types';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  public bills$ = new Observable<Bill[]>();

  constructor(private http: HttpClient) {
    this.readHeaderFromXml().subscribe();
  }

  private readHeaderFromXml(): Observable<void> {
    return this.http.get('assets/index.xml', {responseType: 'text'})
      .pipe(
        map(data => {
          xml2js.parseString(data, this.handleJsonData.bind(this));
      }
    ));
  }

  private handleJsonData(error, json) {
    console.log('handleJsonData');
    console.log(error);
    console.log(json);
      if(error) {
        console.error(error);
        return;
      }
      const fileHeaders = this.readFileHeadersFromJson(json);
      const billsHeader = fileHeaders.filter(header => header.url === 'rechnungen.txt')[0];
      const clientsHeader = fileHeaders.filter(header => header.url === 'patienten.txt')[0];
      const clientsData$ = this.processFile(clientsHeader, this.handleClients.bind(this));
      const billsData$ = this.processFile(billsHeader, this.handleBills.bind(this));
      this.bills$ = forkJoin([clientsData$, billsData$]).pipe(
        tap(console.log),
        map(data => this.enrichBillsData(data[0], data[1])),
        tap(console.log)
      )
      this.bills$.subscribe();
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
        map(data => {
        const content = data.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
        return handleLines(header, content);
      }));
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

}

