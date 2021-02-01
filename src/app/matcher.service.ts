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


    // TODO: Remove certain BookingTexts and negative amounts
    initialState.remainingTransactions = initialState.remainingTransactions.filter(transaction => transaction.amount > 0);

    console.log(initialState);
    const stateAfterIdMatch = this.findIdMatchesForTransactions(initialState);
    console.log(stateAfterIdMatch);

    // Match Name
    const stateAfterNameMatch = this.findNameMatchesForTransactions(stateAfterIdMatch);

    console.log(stateAfterNameMatch);
    console.log(stateAfterNameMatch.remainingTransactions.map(transaction => transaction.bookingText).reduce((acc, cur) => { return acc.includes(cur) ? acc : acc.concat(cur)}, []));
    console.log(stateAfterNameMatch.remainingTransactions.filter(transaction => transaction.amount < 0));

    // Match Amount => Not very accurate
    const matchesByAmount = stateAfterNameMatch.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: stateAfterNameMatch.remainingBills.filter(bill => bill.amount === transaction.amount),
      };
    });
    console.log(matchesByAmount.filter(match => match.bills.length > 0));

    // Matches by name only
    const matchesByNameOnly = stateAfterNameMatch.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: stateAfterNameMatch.remainingBills.filter(bill => transaction.amount !== bill.amount && transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase())),
      }
    });
    console.log(matchesByNameOnly.filter(match => match.bills.length > 0));
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

  private findNameMatchesForTransactions(state: MatchingState): MatchingState {
    const matchesByName = state.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: state.remainingBills.filter(bill => transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase()) && transaction.amount === bill.amount),
      }
    }).filter(match => match.bills.length > 0);
    return {
      remainingBills: state.remainingBills.filter(bill => !matchesByName.reduce((acc, cur) => acc.concat(cur.bills), []).includes(bill)),
      remainingTransactions: state.remainingTransactions.filter(transaction => !matchesByName.map(match => match.transaction).includes(transaction)),
      validMatches: state.validMatches.concat(matchesByName),
      invalidMatches: state.invalidMatches,
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
