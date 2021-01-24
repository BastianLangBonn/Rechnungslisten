import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {
  private indexJson;

  constructor(private http: HttpClient) { }

  readIndexXml() {
    this.http.get('assets/index.xml', {responseType: 'text'})
      .subscribe(data => {
        xml2js.parseString(data, (error, result) => {
          if(error) {
            console.error(error);
          }
          this.indexJson = result;
        });
    });
  }
}
