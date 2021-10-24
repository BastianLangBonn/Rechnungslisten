import { Injectable } from '@angular/core';
import { Bill, MatchState, Transaction, Match } from './types';

@Injectable({
  providedIn: 'root'
})
export class TransactionMatcherService {

  constructor() { }

  public findIdMatches(state: MatchState): MatchState {
    if(!state) {
      throw new Error('state is not set');
    }

    const { transactionMap, billMap }: { transactionMap: Map<Transaction, Bill[]>; billMap: Map<Bill, Transaction[]>; } = this.buildMaps(state);
    const matchesByTransaction: Match[] = this.validateTransactionMatches(transactionMap, billMap);
    const matchesByBill: Match[] = this.validateBillMatches(billMap, transactionMap);
    const matches: Match[] = [].concat(matchesByTransaction, matchesByBill);
    return this.updateState(state, matches);
  }


  private updateState(state: MatchState, matches: Match[]): MatchState {
    return {
      ...state,
      validMatches: state.validMatches.concat(matches),
      openBills: state.openBills.filter((bill: Bill) => !matches.map((match: Match) => match.bill).includes(bill)),
      openTransactions: state.openTransactions.filter((transaction: Transaction) => !matches.map((match: Match) => match.transaction).includes(transaction))
    };
  }

  private validateBillMatches(billMap: Map<Bill, Transaction[]>, transactionMap: Map<Transaction, Bill[]>): Match[] {
    const matchesByBill: Match[] = [];
    [...billMap.keys()].forEach((bill: Bill) => {
      const referencingTransactions: Transaction[] = billMap.get(bill);
      const sumOfTransactions: number = referencingTransactions.reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);
      if (Math.abs(sumOfTransactions - bill.amount) < 0.01) {
        if (referencingTransactions.map((t: Transaction) => transactionMap.get(t))?.every((bs: Bill[]) => bs.length === 1 && bs.includes(bill))) {
          referencingTransactions.forEach((transaction: Transaction) => {
            matchesByBill.push({ transaction, bill });
            transactionMap.delete(transaction);
          });
        }
      }
    });
    return matchesByBill;
  }

  private validateTransactionMatches(transactionMap: Map<Transaction, Bill[]>, billMap: Map<Bill, Transaction[]>): Match[] {
    const matchesByTransaction: Match[] = [];
    [...transactionMap.keys()].forEach(transaction => {
      const referencedBills: Bill[] = transactionMap.has(transaction) ? transactionMap.get(transaction) : [];
      const sumOfBills: number = referencedBills.reduce((acc: number, curr: Bill) => acc + curr.amount, 0);
      if (Math.abs(sumOfBills - transaction.amount) < 0.01 && referencedBills.map((b: Bill) => billMap.get(b))?.every((ts: Transaction[]) => ts.length === 1 && ts.includes(transaction))) {
        referencedBills.forEach((bill: Bill) => {
          matchesByTransaction.push({ transaction, bill });
          billMap.delete(bill);
        });
      }
    });
    return matchesByTransaction;
  }

  private buildMaps(state: MatchState): { transactionMap: Map<Transaction, Bill[]>; billMap: Map<Bill, Transaction[]>; } {
    const transactionMap: Map<Transaction, Bill[]> = new Map();
    const billMap: Map<Bill, Transaction[]> = new Map();
    state.openTransactions.forEach(transaction => {
      const idsOfTransaction: string[] = transaction.usage.match(/\d+/g);
      if (!transactionMap.has(transaction)) {
        transactionMap.set(transaction, []);
      }
      const bills: Bill[] = transactionMap.get(transaction);
      idsOfTransaction?.forEach((id: string) => {
        const bill = state.openBills.find(bill => bill.id === id);
        if (bill) {
          bills.push(bill);
          if (!billMap.has(bill)) {
            billMap.set(bill, []);
          }
          const transactions: Transaction[] = billMap.get(bill);
          transactions.push(transaction);
        }
      });
    });
    return { transactionMap, billMap };
  }
}
