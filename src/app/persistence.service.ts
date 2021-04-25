import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { compareId, comparePayer } from './helper';
import { Bill, MatchState, Transaction, Match } from './types';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor() {}

  public storeMatches(match: MatchState) {
    this.storeBills(match.remainingBills.sort(compareId), 'openBills.csv');
    this.storeTransactions(match.unassignableTransactions.sort(comparePayer), 'openTransactions.csv')
    this.storeMatchedTransactions(match.matches, 'closedBills.csv');
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

  private storeMatchedTransactions(matches: Match[], filename: string) {
    const matchedBills: Map<Bill, Transaction[]> = new Map();
    matches.map((match: Match) => match.bill).forEach((bill: Bill) => {
      if (!matchedBills.has(bill)) {
        const transactions = matches.filter((match: Match) => match.bill === bill).map((match: Match) => match.transaction);
        matchedBills.set(bill, transactions);
      }
    });
    const header = 'Rechnungsnummer;Name;Vorname;Betrag;Datum\n';
    const content: string[] = [...matchedBills.keys()].map((bill: Bill) => `${bill.id};${bill.lastName};${bill.firstName};${bill.amount};${matchedBills.get(bill).map((transaction: Transaction) => transaction.transactionDate).join(', ')}`);
    this.saveContent([header, ...content], filename);
  }

  private saveContent(content: string[], filename: string){
    const blob = new Blob(content, {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, filename);
  }

}
