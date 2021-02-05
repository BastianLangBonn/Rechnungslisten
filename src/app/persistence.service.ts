import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { compareId, comparePayer } from './helper';
import { Bill, MatchResult, Transaction } from './types';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() {}

  public storeMatches(match: MatchResult) {
    this.storeBills(match.remainingBills.sort(compareId), 'openBills.csv');
    this.storeTransactions(match.notMatchingTransactions.sort(comparePayer), 'openTransactions.csv')
    this.storeBills(match.validMatches.reduce((acc, curr) => acc.concat(curr.bills), []).sort(compareId), 'closedBills.csv');
  }

  private storeBills(bills: Bill[], filename: string) {
    const header = 'Rechnungsnummer;Name;Vorname;Betrag\n';
    const text: string[] = bills.map(bill => `${bill.id};${bill.lastName};${bill.firstName};${bill.amount}\n`);
    const blob = new Blob([header, ...text], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, filename );
  }

  private storeTransactions(transactions: Transaction[], filename: string) {
    const header = 'Name;Betrag;Datum;Verwendungszweck;Kommentar\n';
    const text: string[] = transactions.map(transaction => `${transaction.payer};${transaction.amount};${transaction.transactionDate};"${transaction.usage}";"${transaction.comment}"\n`);
    const blob = new Blob([header, ...text], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, filename);
  }

}
