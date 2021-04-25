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

    /** Build Maps */
    const transactionMap: Map<Transaction, Bill[]> = new Map();
    const billMap: Map<Bill, Transaction[]> = new Map();
    state.remainingTransactions.forEach(transaction => {
      const idsOfTransaction: string[] = transaction.usage.match(/\d+/g);
      if (!transactionMap.has(transaction)) {
        transactionMap.set(transaction, []);
      }
      const bills: Bill[] = transactionMap.get(transaction);
      idsOfTransaction.forEach((id: string) => {
        const bill = state.remainingBills.find(bill => bill.id === id);
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

    /** Validate TransactionMatches */
    const matchesByTransaction: Match[] = [];
    [...transactionMap.keys()].forEach(transaction => {
      const referencedBills: Bill[] = transactionMap.has(transaction) ? transactionMap.get(transaction) : [];
      const sumOfBills: number = referencedBills.reduce((acc: number, curr: Bill) => acc + curr.amount, 0);
      if (Math.abs(sumOfBills - transaction.amount) < 0.01 && referencedBills.map((b: Bill) => billMap.get(b))?.every((ts: Transaction[]) => ts.length === 1 && ts.includes(transaction))) {
        referencedBills.forEach((bill: Bill) => {
          matchesByTransaction.push({transaction, bill});
          billMap.delete(bill);
        })
      }
    });

    /** Validate BillMatches */
    const matchesByBill: Match[] = [];
    [...billMap.keys()].forEach((bill: Bill) => {
      const referencingTransactions: Transaction[] = billMap.get(bill);
      const sumOfTransactions: number = referencingTransactions.reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);
      if (Math.abs(sumOfTransactions - bill.amount) < 0.01) {
        if (referencingTransactions.map((t: Transaction) => transactionMap.get(t))?.every((bs: Bill[]) => bs.length === 1 && bs.includes(bill))) {
          referencingTransactions.forEach((transaction: Transaction) => {
            matchesByBill.push({transaction, bill});
            transactionMap.delete(transaction);
          });
        }
      }
    });

    const matches = [].concat(matchesByTransaction, matchesByBill);

    return {
      ...state,
      matches: state.matches.concat(matches),
      remainingBills: state.remainingBills.filter((bill: Bill) => !matches.map((match: Match) => match.bill).includes(bill)),
      remainingTransactions: state.remainingTransactions.filter((transaction: Transaction) => !matches.map((match: Match) => match.transaction).includes(transaction))
    };
  }

}
