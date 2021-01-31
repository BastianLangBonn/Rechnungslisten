import { Injectable } from '@angular/core';
import { Bill, Transaction, TransactionMatch } from './types';

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  constructor() { }

  public match(bills: Bill[], transactions: Transaction[]) {
    // Match RNr
    const idMatches = transactions.map(transaction => this.findMatchById(transaction, bills)).filter(match => match.bills.length > 0);
    console.log(idMatches);
    console.log(idMatches.filter(match => match.bills.length > 1));
    const isValidMatch = match => match.transaction.amount === match.bills.reduce((acc, curr) => acc + curr.amount, 0);
    const validatedIdMatches = idMatches.filter(isValidMatch);
    const invalidIdMatches = idMatches.filter(match => !isValidMatch(match));
    console.log(validatedIdMatches);
    console.log(invalidIdMatches);

    // Validate Amount

    // Match Name
    // Match Amount
  }

  private findMatchById(transaction: Transaction, bills: Bill[]): TransactionMatch {
    const result = {
      transaction,
      bills: []
    };
    const numbersInUsage = transaction.usage.match(/\d+/g);
    if( numbersInUsage ){
      const matchingBills = bills.filter(bill => numbersInUsage.includes(bill.id))
      result.bills = matchingBills;
    }
    return result;
  }
}
