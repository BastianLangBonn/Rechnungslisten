import { Injectable } from '@angular/core';
import { Bill, MatchingState, Transaction, TransactionMatch } from './types';

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  constructor() { }

  public match(bills: Bill[], transactions: Transaction[]) {
    const initialState = {
      remainingBills: bills,
      remainingTransactions: transactions,
      validMatches: [],
      invalidMatches: []
    };

    console.log(initialState);
    const stateAfterIdMatch = this.findIdMatchesForTransactions(initialState);
    console.log(stateAfterIdMatch);



    // Match Name
    // Match Amount
  }

  private findIdMatchesForTransactions(state: MatchingState): MatchingState {
    const matchesById = state.remainingTransactions.map(transaction => this.findIdMatchesForTransaction(transaction, state.remainingBills)).filter(match => match.bills.length > 0);
    const isValidMatch = match => match.transaction.amount === match.bills.reduce((acc, curr) => acc + curr.amount, 0);
    const validMatches = state.validMatches.concat(...matchesById.filter(isValidMatch));
    const invalidMatches = state.invalidMatches.concat(...matchesById.filter(match => !isValidMatch(match)))
    const assignedTransactions = validMatches.map(match => match.transaction);
    const assignedBills = validMatches.reduce((acc, curr) => acc.concat(curr.bills), []);

    return {
      remainingBills: state.remainingBills.filter(bill => !assignedBills.includes(bill)),
      remainingTransactions: state.remainingTransactions.filter(transaction => !assignedTransactions.includes(transaction)),
      validMatches,
      invalidMatches,
    }
  }

  private findIdMatchesForTransaction(transaction: Transaction, bills: Bill[]): TransactionMatch {
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
