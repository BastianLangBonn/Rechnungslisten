import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

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
          console.log(fileHeaders);
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
}

interface FileHeader {
  url: string;
  fields: string[];
}
