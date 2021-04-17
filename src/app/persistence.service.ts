import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { compareId, comparePayer } from './helper';
import { Bill, MatchState, Transaction, TransactionMatch } from './types';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() {}

  public storeMatches(match: MatchState) {
    this.storeBills(match.remainingBills.sort(compareId), 'openBills.csv');
    this.storeTransactions(match.notMatchingTransactions.sort(comparePayer), 'openTransactions.csv')
    this.storeMatchedTransactions(match.validMatches, 'closedBills.csv');
  }

  private storeBills(bills: Bill[], filename: string) {
    const header = 'Rechnungsnummer;Name;Vorname;Betrag\n';
    const content: string[] = bills.map(bill => `${bill.id};${bill.lastName};${bill.firstName};${bill.amount}\n`);
    this.saveContent([header, ...content], filename);
  }

  private storeTransactions(transactions: Transaction[], filename: string) {
    const header = 'Name;Betrag;Datum;Verwendungszweck;Kommentar\n';
    const content: string[] = transactions.map(transaction => `${transaction.payer};${transaction.amount};${transaction.transactionDate};"${transaction.usage}";"${transaction.comment}"\n`);
    this.saveContent([header, ...content], filename);
  }

  private storeMatchedTransactions(matches: TransactionMatch[], filename: string) {
    const header = 'Rechnungsnummer;Name;Vorname;Betrag;Datum\n';
    const content: string[] = matches.reduce((acc, curr) => acc.concat(...curr.bills.map(bill => `${bill.id};${bill.lastName};${bill.firstName};${bill.amount};${curr.transaction.transactionDate}\n`)), []);
    this.saveContent([header, ...content], filename);
  }

  private saveContent(content: string[], filename: string){
    const blob = new Blob(content, {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, filename);
  }

}
