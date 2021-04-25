import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BillCollectorService } from './bill-collector.service';
import { FilterService } from './filter.service';
import { TransactionCollectorService } from './transaction-collector.service';
import { TransactionMatcherService } from './transaction-matcher.service';
import { Bill, MatchState, Transaction, Match } from './types';


const EMPTY_STATE: MatchState = {
  initialTransactions: [],
  initialBills: [],
  remainingBills: [],
  remainingTransactions: [],
  unassignableTransactions: [],
  filteredTransactions: [],
  matches: [],
};

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  public matches: MatchState = EMPTY_STATE;

  constructor(
        private transactionCollector: TransactionCollectorService,
        private billCollector: BillCollectorService,
        private filter: FilterService,
        private transactionMatcher: TransactionMatcherService
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
      this.transactionMatcher.findIdMatches,
      // this.tap(console.log),
      this.findNameMatchesForTransactions,
      // this.tap(console.log)
    )(initialState);

    console.log(finalState);
    return finalState;
  }

  private findNameMatchesForTransactions(state: MatchState): MatchState {
    const matchesByName: Match[] = [];
    state.remainingTransactions.forEach(transaction => {
      const bills: Bill[] = state.remainingBills.filter(bill => transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase()) && transaction.amount === bill.amount);
      matchesByName.concat(bills.map((bill: Bill) => { return {bill, transaction}}));
    });

    return {
      ...state,
      remainingBills: state.remainingBills.filter(bill => !matchesByName.reduce((acc, cur) => acc.concat(cur.bill), []).some(b => b.id === bill.id)),
      remainingTransactions: state.remainingTransactions.filter(transaction => !matchesByName.map(match => match.transaction).includes(transaction)),
      filteredTransactions: state.filteredTransactions,
      matches: state.matches.concat(matchesByName)
    }
  }

  /**
   * !!!NOT VERY ACCURATE!!!
   * Tries to find a match for the transactions in the bills wrt the amount.
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findAmountMatchesForTransactions(bills: Bill[], transactions: Transaction[]): Match[] {
    return transactions.map(transaction => {
      const bill: Bill | undefined = bills.find(bill => bill.amount === transaction.amount);
      return bill ? {transaction, bill} : null;
    }).filter((match: Match | null) => match);
  }

  /**
   * !!!NOT VERY ACCURATE!!!
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findNameMatchesOnlyForTransactions(bills: Bill[], transactions: Transaction[]): Match[] {
    const result: Match[] = [];
    transactions.forEach(transaction => {
      const matchingBills: Bill[] = bills.filter(bill => transaction.amount !== bill.amount && transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase()));
      result.concat(matchingBills.map((bill: Bill) => { return {bill, transaction}}));
    });
    return result;
  }

  public addMatches(transaction: Transaction, bills: Bill[]): void {
    const matches = bills.map((bill: Bill) => { return {bill, transaction}});
    this.matches = {
      ...this.matches,
      matches: this.matches.matches.concat(matches),
      remainingTransactions: this.matches.remainingTransactions.filter(remainer => remainer.usage !== transaction.usage),
      remainingBills: this.matches.remainingBills.filter(bill => bills.every(b => b.id !== bill.id)),
    }
  }

  public markNotMatching(transaction: Transaction, comment: string) {
    transaction.comment = comment;
    this.matches = {
      ...this.matches,
      unassignableTransactions: this.matches.unassignableTransactions.concat(transaction),
      remainingTransactions: this.matches.remainingTransactions.filter(t => t.usage !== transaction.usage),
    }
  }

}
