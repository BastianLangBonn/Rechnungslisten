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
  openBills: [],
  openTransactions: [],
  unassignableTransactions: [],
  ignoredTransactions: [],
  validMatches: [],
};

@Injectable({
  providedIn: 'root'
})
export class MatcherService {

  private matches: MatchState = EMPTY_STATE;

  constructor(
    private transactionCollector: TransactionCollectorService,
    private billCollector: BillCollectorService,
    private filter: FilterService,
    private transactionMatcher: TransactionMatcherService
  ) {
    forkJoin([
      this.transactionCollector.transactions$,
      this.billCollector.bills$
    ]).subscribe(
      ([
        transactions,
        bills
      ]) => {
        this.matches = this.match(bills, transactions);
      });
  }

  private pipe = (...fns: any[]) => (x: any) => fns.reduce((v, f) => f(v), x);
  // private tap = (fn: any) => (x: any) => {fn(x); return x;};

  private match(bills: Bill[], transactions: Transaction[]): MatchState {
    const initialState: MatchState = EMPTY_STATE;
    initialState.openBills = bills;
    initialState.openTransactions = transactions;
    initialState.initialBills = bills;
    initialState.initialTransactions = transactions;

    const finalState: MatchState = this.pipe(
      // this.tap(console.log),
      this.filter.filterNegativeTransactions,
      // this.tap(console.log),
      this.filter.filterListedPayers,
      // this.tap(console.log),
      this.transactionMatcher.findIdMatches.bind(this.transactionMatcher),
      // this.tap(console.log),
      this.findNameMatchesForTransactions,
      // this.tap(console.log)
    )(initialState);

    // console.log(finalState);
    return finalState;
  }

  private findNameMatchesForTransactions(state: MatchState): MatchState {
    const matchesByName: Match[] = [];
    const isLastNameInPayer = (transaction: Transaction) => (bill: Bill) =>
      transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase());
    state.openTransactions.forEach(transaction => {
      const isLastNameInThisTransaction = isLastNameInPayer(transaction);
      const isBillAmountEqualToThisTransaction = (bill: Bill) => transaction.amount === bill.amount;
      const bills: Bill[] = state.openBills.filter(bill => isLastNameInThisTransaction(bill) && isBillAmountEqualToThisTransaction(bill));
      const matchesForThisTransaction = bills.map(bill => ({ bill, transaction }));
      matchesByName.concat(matchesForThisTransaction);
    });

    return {
      ...state,
      openBills: state.openBills.filter(bill => !matchesByName.reduce((acc, cur) => acc.concat(cur.bill), []).some(b => b.id === bill.id)),
      openTransactions: state.openTransactions.filter(transaction => !matchesByName.map(match => match.transaction).includes(transaction)),
      ignoredTransactions: state.ignoredTransactions,
      validMatches: state.validMatches.concat(matchesByName)
    };
  }

  /**
   * Returns the open transaction with the specified id. Throws an Exception if it does not exist.
   * @param id The id of the transaction.
   * @returns The transaction with the given id.
   */
  public getOpenTransaction(id: number): Transaction {
    const result = this.matches.openTransactions[id];
    if (!result) {
      throw Error(`Transaction with id ${id} does not exist.`);
    }
    return result;
  }

  public getOpenBills(): Bill[] {
    return this.matches.openBills;
  }

  public getOpenTransactions(): Transaction[] {
    return this.matches.openTransactions;
  }

  public getUnassignableTransactions(): Transaction[] {
    return this.matches.unassignableTransactions;
  }
  public getInitialTransactions(): Transaction[] {
    return this.matches.initialTransactions;
  }

  public getInitialBills(): Bill[] {
    return this.matches.initialBills;
  }

  public getIgnoredTransactions(): Transaction[] {
    return this.matches.ignoredTransactions;
  }
  public getValidMatches(): Match[] {
    return this.matches.validMatches;
  }

  public getMatches(): MatchState {
    return this.matches;
  }

  /**
   * Matches Bills and Transactions based on Amounts.
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findAmountMatchesForTransactions(bills: Bill[], transactions: Transaction[]): Match[] {
    return transactions.map(transaction => {
      const bill: Bill | undefined = bills.find(b => b.amount === transaction.amount);
      return bill ? { transaction, bill } : null;
    }).filter((match: Match | null) => match);
  }

  /**
   * Matches Bills and Transactions based on Names.
   * @param bills List of bills to be searched
   * @param transactions List of transactions to be matched
   */
  public findNameMatchesOnlyForTransactions(bills: Bill[], transactions: Transaction[]): Match[] {
    const result: Match[] = [];
    transactions.forEach(transaction => {
      const matchingBills: Bill[] = bills.filter(bill => transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase()));
      result.concat(matchingBills.map(bill => ({ bill, transaction })));
    });
    return result;
  }

  public addMatches(transaction: Transaction, bills: Bill[]): void {
    const matches = bills.map((bill: Bill) => ({ bill, transaction }));
    this.matches = {
      ...this.matches,
      validMatches: this.matches.validMatches.concat(matches),
      openTransactions: this.matches.openTransactions.filter(remainer => remainer.usage !== transaction.usage),
      openBills: this.matches.openBills.filter(bill => bills.every(b => b.id !== bill.id)),
    };
  }

  public markNotMatching(transaction: Transaction, comment: string): void {
    transaction.comment = comment;
    this.matches = {
      ...this.matches,
      unassignableTransactions: this.matches.unassignableTransactions.concat(transaction),
      openTransactions: this.matches.openTransactions.filter(t => t.usage !== transaction.usage),
    };
  }

}
