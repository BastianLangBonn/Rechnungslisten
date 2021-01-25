import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { Subject } from 'rxjs';
import { Bill, Client, FileHeader } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  public bills = new Subject<Bill[]>();
  public payments = new Subject<string[][]>();
  private clients = new Subject<Client[]>();

  constructor(private http: HttpClient) { }

  loadData() {
    this.readIndexXml();

  }

  private readIndexXml() {
    this.http.get('assets/index.xml', {responseType: 'text'})
      .subscribe(data => {
        xml2js.parseString(data, (error, result) => {
          if(error) {
            console.error(error);
          }
          const fileHeaders = this.readFileHeadersFromJson(result);
          const billsHeader = fileHeaders.filter(header => header.url === 'rechnungen.txt')[0];
          const clientsHeader = fileHeaders.filter(header => header.url === 'patienten.txt')[0];
          const paymentsHeader = fileHeaders.filter(header => header.url === 'zahlungen.txt')[0];
          const billingPositionsHeader = fileHeaders.filter(header => header.url === 'rechpos.txt')[0];
          this.processFile(paymentsHeader, this.handlePayments.bind(this));
          this.processFile(clientsHeader, this.handleClients.bind(this));
          this.processFile(billsHeader, this.handleBills.bind(this));
        });
    });
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

  private processFile(header: FileHeader, handleLines: Function, ) {
    this.http.get(`assets/${header.url}`, {responseType: 'text'})
      .subscribe(data => {
        const content = data.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
        handleLines(header, content);
      });
  }

  private handlePayments(header: FileHeader, content: string[][]) {

  }

  private handleClients(header: FileHeader, content: string[]) {
    const refinedClients: Client[] = content.map(line => {
      return {
        clientId: +line[header.fields.indexOf('Patnr')].slice(1, -1).trim(),
        lastName: line[header.fields.indexOf('Name')].slice(1, -1).trim(),
        firstName: line[header.fields.indexOf('Vorname')].slice(1, -1).trim(),
        street: line[header.fields.indexOf('Strasse')].slice(1, -1).trim(),
        zip: +line[header.fields.indexOf('Plz')].slice(1, -1).trim(),
        city: line[header.fields.indexOf('Ort')].slice(1, -1).trim(),
        country: line[header.fields.indexOf('Land')].slice(1, -1).trim(),
      }
    });
    this.clients.next(refinedClients);
  }

  private handleBills(header: FileHeader, content: string[]) {
    const refinedBills: Bill[] = content.map(line => {
      return {
        amount: +line[header.fields.indexOf('Betrag')].slice(1, -1).trim().replace(',','.'),
        amountStorno: +line[header.fields.indexOf('St_Betrag')].replace(',','.'),
        billingNumber: +line[header.fields.indexOf('rnr')].slice(1, -1).trim(),
        canceled: line[header.fields.indexOf('Storniert')].slice(1, -1).trim(),
        clientId: +line[header.fields.indexOf('Patnr')].slice(1, -1).trim(),
        date: line[header.fields.indexOf('datum')],
        taxApplied: +line[header.fields.indexOf('Mwst')].slice(1, -1).trim().replace(',','.'),
        taxFull: +line[header.fields.indexOf('MwstSatz')],
        taxDifferent: line[header.fields.indexOf('AndererMwst')].slice(1, -1).trim(),
        taxReduced: +line[header.fields.indexOf('MwstSatzErm')],

      };
    });
    this.bills.next(refinedBills);
  }

}

