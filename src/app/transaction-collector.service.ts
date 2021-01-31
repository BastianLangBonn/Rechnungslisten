import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonUtilsService } from './common-utils.service';
import { Transaction } from './types';

@Injectable({
  providedIn: 'root'
})
export class TransactionCollectorService {

  constructor(private http: HttpClient, private dataCollectorService: CommonUtilsService) { }

  public loadTransactions(): Observable<Transaction[]> {
    return this.http.get('assets/umsaetze.CSV', {responseType: 'text'})
      .pipe(
        map(data => this.dataCollectorService.splitCsvFile(data)),
        map(data => this.extractTransactions(data))
      );
  }

  private extractTransactions(content: string[][]): Transaction[] {
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
