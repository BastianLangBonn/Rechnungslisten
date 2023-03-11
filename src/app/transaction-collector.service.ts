import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommonUtilsService } from './common-utils.service';
import { Transaction } from './types';

@Injectable({
  providedIn: 'root'
})
export class TransactionCollectorService {

  public transactions$: Observable<Transaction[]>;

  constructor(private http: HttpClient, private dataCollectorService: CommonUtilsService) {
    this.transactions$ = this.loadTransactions();
  }

  private loadTransactions(): Observable<Transaction[]> {
    return this.http.get('assets/umsaetze.CSV', {responseType: 'text'})
      .pipe(
        tap(console.log),
        map(data => this.dataCollectorService.splitCsvFile(data)),
        tap(console.log),
        map(data => this.extractTransactions(data))
      );
  }

  private extractTransactions(content: string[][]): Transaction[] {
    console.log("content:", content);
    const header = content[0].map(field => field.slice(1, -1));
    console.log(header);
    return content.slice(1).map(entry => {
      const getEntry = (identifier: string) => entry[header.indexOf(identifier)].slice(1, -1);
      const getEntryAsNumber = (identifier: string) => +getEntry(identifier).replace(',','.');
      return {
        orderAccount: getEntry('Auftragskonto'),
        transactionDate: getEntry('Buchungstag'),
        valutaData: getEntry('Valutadatum'),
        bookingText: getEntry('Buchungstext'),
        usage: getEntry('Verwendungszweck'),
        payer: getEntry('Beguenstigter/Zahlungspflichtiger'),
        mandateReference: getEntry('Kontonummer'),
        clientReference: getEntry('BLZ'),
        amount: getEntryAsNumber('Betrag'),
        currency: getEntry('Waehrung'),
        info: getEntry('Info'),
      }
    });
  }

}
