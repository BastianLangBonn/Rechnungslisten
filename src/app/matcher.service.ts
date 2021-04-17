import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BillCollectorService } from './bill-collector.service';
import { FilterService } from './filter.service';
import { TransactionCollectorService } from './transaction-collector.service';
import { Bill, MatchState, Transaction, TransactionMatch } from './types';


const EMPTY_STATE: MatchState = {
  initialTransactions: [],
  initialBills: [],
  remainingBills: [],
  remainingTransactions: [],
  notMatchingTransactions: [],
  filteredTransactions: [],
  validMatches: [],
  invalidMatches: [],
};

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  public matches: MatchState = EMPTY_STATE;

  constructor(
        private transactionCollector: TransactionCollectorService,
        private billCollector: BillCollectorService,
        private filter: FilterService
    ) {
    forkJoin([this.transactionCollector.transactions$,this.billCollector.bills$]).subscribe(([transactions, bills]) => {
      this.matches = this.match(bills, transactions);
    });
   }

  private pipe = (...fns: any[]) => (x: any) => fns.reduce((v, f) => f(v), x);
  private tap = (fn: any) => (x: any) => {fn(x); return x;};

  private match(bills: Bill[], transactions: Transaction[]): MatchState {
    const initialState: MatchState = EMPTY_STATE;
    initialState.remainingBills = bills;
    initialState.remainingTransactions = transactions;
    initialState.initialBills = bills;
    initialState.initialTransactions = transactions;

    const finalState: MatchState = this.pipe(
      // this.tap(console.log),
      this.filter.filterNegativeTransactions,
      // this.tap(console.log),
      this.filter.filterListedPayers,
      // this.tap(console.log),
      this.findIdMatchesForTransactions.bind(this),
      // this.tap(console.log),
      this.findNameMatchesForTransactions,
      // this.tap(console.log)
    )(initialState);

    console.log(finalState);
    return finalState;
  }


  private findIdMatchesForTransactions(state: MatchState): MatchState {
    const matchesById = state.remainingTransactions
    .map(transaction => this.findIdMatchesForTransaction(transaction, state.remainingBills))
    .filter(match => match.bills.length > 0);

    const isValidMatch = (match: TransactionMatch) => Math.abs(match.bills.reduce((acc: number, curr: Bill) => acc - curr.amount, match.transaction.amount)) < 0.01;
    const validMatches = state.validMatches.concat(...matchesById.filter(isValidMatch));
    const invalidMatches = state.invalidMatches.concat(...matchesById.filter(match => !isValidMatch(match)))
    const assignedTransactions = validMatches.map(match => match.transaction);
    const assignedBills = validMatches.reduce((acc, curr) => acc.concat(curr.bills), []);

    return {
      ...state,
      remainingBills: state.remainingBills.filter(bill => !assignedBills.some(b => b.id === bill.id)),
      remainingTransactions: state.remainingTransactions.filter(transaction => !assignedTransactions.includes(transaction)),
      filteredTransactions: state.filteredTransactions,
      validMatches,
      invalidMatches,
    }
  }

  private findIdMatchesForTransaction(transaction: Transaction, bills: Bill[]): TransactionMatch {
    const result: TransactionMatch = {
      transaction,
      bills: []
    };
    const numbersInUsage = transaction.usage.match(/\d+/g);
    if( numbersInUsage ){
      const matchingBills = bills.filter(bill => numbersInUsage.includes(bill.id)).map(bill => { return {...bill, transactionDate: transaction.transactionDate}})
      result.bills = matchingBills;
    }
    return result;
  }

  private findNameMatchesForTransactions(state: MatchState): MatchState {
    const matchesByName: TransactionMatch[] = state.remainingTransactions.map(transaction => {
      return {
        transaction,
        bills: state.remainingBills.filter(bill => transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase()) && transaction.amount === bill.amount)
          .map(bill => {return {...bill, transactionDate: transaction.transactionDate}}),
      }
    }).filter(match => match.bills.length > 0);
    return {
      ...state,
      remainingBills: state.remainingBills.filter(bill => !matchesByName.reduce((acc, cur) => acc.concat(cur.bills), []).some(b => b.id === bill.id)),
      remainingTransactions: state.remainingTransactions.filter(transaction => !matchesByName.map(match => match.transaction).includes(transaction)),
      filteredTransactions: state.filteredTransactions,
      validMatches: state.validMatches.concat(matchesByName),
      invalidMatches: state.invalidMatches,
    }
  }

  /**
   * !!!NOT VERY ACCURATE!!!
   * Tries to find a match for the transactions in the bills wrt the amount.
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findAmountMatchesForTransactions(bills: Bill[], transactions: Transaction[]): TransactionMatch[] {
    return transactions.map(transaction => {
      return {
        transaction,
        bills: bills.filter(bill => bill.amount === transaction.amount),
      };
    }).filter(match => match.bills.length > 0);
  }

  /**
   * !!!NOT VERY ACCURATE!!!
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findNameMatchesOnlyForTransactions(bills: Bill[], transactions: Transaction[]): TransactionMatch[] {
    return transactions.map(transaction => {
      return {
        transaction,
        bills: bills.filter(bill => transaction.amount !== bill.amount && transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase())),
      }
    }).filter(match => match.bills.length > 0);
  }

  public addMatch(transaction: Transaction, bills: Bill[]): void {
    this.matches = {
      ...this.matches,
      validMatches: this.matches.validMatches.concat({transaction, bills}),
      remainingTransactions: this.matches.remainingTransactions.filter(remainer => remainer.usage !== transaction.usage),
      remainingBills: this.matches.remainingBills.filter(bill => bills.every(b => b.id !== bill.id)),
    }
  }

  public markNotMatching(transaction: Transaction, comment: string) {
    transaction.comment = comment;
    this.matches = {
      ...this.matches,
      notMatchingTransactions: this.matches.notMatchingTransactions.concat(transaction),
      remainingTransactions: this.matches.remainingTransactions.filter(t => t.usage !== transaction.usage),
    }
  }

}
