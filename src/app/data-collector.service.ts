import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  public bills$ = new Observable<Bill[]>();

  constructor(private http: HttpClient) {}
  public splitCsvFile(content): string[][] {
    return content.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
  }
}

