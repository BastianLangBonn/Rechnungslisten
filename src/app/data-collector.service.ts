import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  public bills = new Subject<string[][]>();
  public payments = new Subject<string[][]>();
  private clients = new Subject<string[][]>();

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
          this.processFile(paymentsHeader, this.handlePayments);
          this.processFile(clientsHeader, this.handleClients);
          this.processFile(billsHeader, this.handleBills);
        });
    });
  }

  private readFileHeadersFromJson(json: any): FileHeader[] {
    return json.DataSet.Media[0].Table.map(table => {
      return {
        url: table.URL[0],
        fields: table.VariableLength[0].VariableColumn.map(column => column.Name[0])
      }
    });
  }

  private processFile(header: FileHeader, handleLines: Function) {
    this.http.get(`assets/${header.url}`, {responseType: 'text'})
      .subscribe(data => {
        const content = data.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
        handleLines(header, content);
        // console.log(lines);
      });
  }

  private handlePayments(header: FileHeader, content: string[][]) {
    console.log(content);

  }

  private handleClients(header: FileHeader, lines: string[]) {

  }

  private handleBills(header: FileHeader, lines: string[]) {

  }

}



interface FileHeader {
  url: string;
  fields: string[];
}
