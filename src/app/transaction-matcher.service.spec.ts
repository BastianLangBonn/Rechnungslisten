import { TestBed } from '@angular/core/testing';

import { TransactionMatcherService } from './transaction-matcher.service';
import { Bill, MatchState, Transaction, Match } from './types';

describe('TransactionMatcherService', () => {
  let service: TransactionMatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionMatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fdescribe('findIdMatches', () => {
    it('should throw an error if state is null', () => {
      expect(() => service.findIdMatches(null)).toThrowError('state is not set');
    });

    it('should do nothing if state is empty', () => {
      const state: MatchState = generateEmptyState();
      const result: MatchState = service.findIdMatches(state);
      expect(result).toEqual(state);
    });

    it('should create a new instance of state', () => {
      const state: MatchState = generateEmptyState();
      const result: MatchState = service.findIdMatches(state);
      expect(result === state).toBeFalse();
    });

    it('should match 1 on 1 for matching IDs and amounts', () => {
      const amount = 100;
      const id = 2124;
      const transaction: Transaction = generateTransaction(amount, [id]);
      const bill: Bill = generateBill(amount, id);
      const state: MatchState = generateState([bill], [transaction]);
      const result: MatchState = service.findIdMatches(state);
      const matches: Match[] = result.matches;
      expect(result.remainingBills.length).toEqual(0);
      expect(result.remainingTransactions.length).toEqual(0);
      expect(result.matches.length).toEqual(1);
      expect(matches[0].bill).toEqual(bill);
      expect(matches[0].transaction).toEqual(transaction);
    });

    it('should not match 1 on 1 for matching IDs with not matching amounts', () => {
      const transaction: Transaction = generateTransaction(100, [1234]);
      const bill: Bill = generateBill(50, 1234);
      const state: MatchState = generateState([bill], [transaction]);
      const result: MatchState = service.findIdMatches(state);
      expect(result.remainingTransactions).toContain(transaction);
      expect(result.remainingBills).toContain(bill);
      expect(result.matches.length).toEqual(0);
    });

    it('should not match 1 on 1 for not matching IDs with matching amounts', () => {
      const transaction: Transaction = generateTransaction(100, [1]);
      const bill: Bill = generateBill(100, 2);
      const state: MatchState = generateState([bill], [transaction]);
      const result: MatchState = service.findIdMatches(state);
      expect(result.remainingTransactions).toContain(transaction);
      expect(result.remainingBills).toContain(bill);
      expect(result.matches.length).toEqual(0);
    });

    it('should match 1 to n if IDs and amounts are right', () => {
      const transaction: Transaction = generateTransaction(200, [1, 2]);
      const b1: Bill = generateBill(50, 1);
      const b2: Bill = generateBill(150, 2);
      const state: MatchState = generateState([b1, b2], [transaction]);
      const result: MatchState = service.findIdMatches(state);
      const matches: Match[] = result.matches;
      expect(matches.length).toEqual(2);
      expect(result.remainingBills.length).toEqual(0);
      expect(result.remainingTransactions.length).toEqual(0);
      expect(matches).toContain({bill: b1, transaction});
      expect(matches).toContain({bill: b2, transaction});
    });

    it('should not match 1 to n for matching IDs and not matching amounts', () =>{
      const transaction: Transaction = generateTransaction(200, [1, 2]);
      const b1: Bill = generateBill(75, 1);
      const b2: Bill = generateBill(150, 2);
      const state: MatchState = generateState([b1, b2], [transaction]);
      const result: MatchState = service.findIdMatches(state);
      const validMatches: Match[] = result.matches;
      expect(validMatches.length).toEqual(0);
      expect(result.remainingBills.length).toEqual(2);
      expect(result.remainingTransactions.length).toEqual(1);
      expect(state.remainingBills).toContain(b1);
      expect(state.remainingBills).toContain(b2);
      expect(state.remainingTransactions).toContain(transaction);
    });

    it('should match m to 1 if ID and Amounts are correct', () => {
      const t1: Transaction = generateTransaction(100, [1]);
      const t2: Transaction = generateTransaction(100, [1]);
      const bill: Bill = generateBill(200, 1);
      const state: MatchState = generateState([bill], [t1, t2]);
      const result: MatchState = service.findIdMatches(state);
      expect(result.matches.length).toEqual(2);
      expect(result.remainingBills.length).toEqual(0);
      expect(result.remainingTransactions.length).toEqual(0);
      expect(result.matches).toContain({bill, transaction: t1});
      expect(result.matches).toContain({bill, transaction: t2});
    });

    it('should not match m to 1 if amounts are wrong', () => {
      const t1: Transaction = generateTransaction(100, [1]);
      const t2: Transaction = generateTransaction(110, [1]);
      const bill: Bill = generateBill(200, 1);
      const state: MatchState = generateState([bill], [t1, t2]);
      const result: MatchState = service.findIdMatches(state);
      expect(result.matches.length).toEqual(0);
      expect(result.remainingBills.length).toEqual(1);
      expect(result.remainingTransactions.length).toEqual(2);
      expect(result.remainingBills).toContain(bill);
      expect(result.remainingTransactions).toContain(t1);
      expect(result.remainingTransactions).toContain(t2);
    });
  });
});

const generateEmptyState = (): MatchState => {
  return {
    filteredTransactions: [],
    initialBills: [],
    initialTransactions: [],
    remainingBills: [],
    matches: [],
    remainingTransactions: [],
    unassignableTransactions: []
  };
}

const generateTransaction = (amount: number, id: number[]): Transaction => {
  return {
    amount,
    bic: '',
    bookingText: '',
    clientReference: '',
    collectiveReference: '',
    creditorId: '',
    currency: '',
    directDebit: 0,
    iban: '',
    info: '',
    mandateReference: '',
    orderAccount: '',
    payer: '',
    returnDebit: 0,
    transactionDate: '',
    usage: `RNr: ${id.join(',')}`,
    valutaData: '',
    comment: ''
  };
};

const generateBill = (amount: number, id: number): Bill => {
  return {
    amount,
    clientId: 0,
    date: '',
    id: `${id}`,
    amountStorno: 0,
    canceled: '',
    firstName: '',
    lastName: '',
    taxApplied: 0,
    taxDifferent: '',
    taxFull: 0,
    taxReduced: 0,
  };
}

const generateState = (bills: Bill[], transactions: Transaction[]): MatchState => {
  return { ...generateEmptyState(), remainingBills: bills, remainingTransactions: transactions };
}

