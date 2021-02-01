import { Injectable } from '@angular/core';
import { Bill, MatchState as MatchState, Transaction, TransactionMatch } from './types';

const FILTERED_PAYERS = [
  'Kassenzahnarztliche Vereinigung Nordrhein',
  'Techniker Krankenkasse',
  'DAMPSOFT GmbH',
  'IKK classic',
  'AOK Rheinland/Hamburg',
  'Unfallkasse NRW',
  'BARMER',
  'BSCARD',
];

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  constructor() { }

  pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

  public match(bills: Bill[], transactions: Transaction[]) {
    const initialState = {
      remainingBills: bills,
      remainingTransactions: transactions,
      validMatches: [],
      invalidMatches: []
    };

    console.log(initialState.remainingTransactions.filter(transaction => transaction.amount < 0));

    const finalState: MatchState = this.pipe(
      this.filterNegativeTransactions,
      this.filterListedPayers,
      this.findIdMatchesForTransactions.bind(this),
      this.findNameMatchesForTransactions
    )(initialState);
    console.log(finalState);
    console.log(finalState.remainingTransactions.map(transaction => transaction.payer).reduce((acc, cur) => { return acc.includes(cur) ? acc : acc.concat(cur)}, []));

    console.log(finalState.remainingTransactions.map(transaction => transaction.bookingText).reduce((acc, cur) => { return acc.includes(cur) ? acc : acc.concat(cur)}, []));

    // Match Amount => Not very accurate
    const matchesByAmount = finalState.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: finalState.remainingBills.filter(bill => bill.amount === transaction.amount),
      };
    });
    console.log(matchesByAmount.filter(match => match.bills.length > 0));

    // Matches by name only
    const matchesByNameOnly = finalState.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: finalState.remainingBills.filter(bill => transaction.amount !== bill.amount && transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase())),
      }
    });
    console.log(matchesByNameOnly.filter(match => match.bills.length > 0));
  }

  private filterNegativeTransactions(state: MatchState): MatchState {
    return {
      ...state,
      remainingTransactions: state.remainingTransactions.filter(transaction => transaction.amount > 0),
    }
  }

  private filterListedPayers(state: MatchState): MatchState {
    return {
      ...state,
      remainingTransactions: state.remainingTransactions.filter(transaction => !FILTERED_PAYERS.includes(transaction.payer)),
    }
  }

  private findIdMatchesForTransactions(state: MatchState): MatchState {
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

  private findNameMatchesForTransactions(state: MatchState): MatchState {
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

}
