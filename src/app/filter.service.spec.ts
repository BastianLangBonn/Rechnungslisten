import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import { MatchState, Transaction } from './types';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterNegativeTransactions', () => {
    it('should throw exception if state is empty', () => {
      const state = null;
      expect(() => service.filterNegativeTransactions(state)).toThrowError('State is not set');
    });

    it('should do nothing if amount is positive', () => {
      const transaction: Transaction = generateTransaction(100);
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result.openTransactions).toContain(transaction);
      expect(result.ignoredTransactions).toEqual([]);
    });

    it('should filter transaction if amount is negative', () => {
      const transaction: Transaction = generateTransaction(-10);
      const state: MatchState = generateInitialState([transaction])
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result.openTransactions).toEqual([]);
      expect(result.ignoredTransactions).toContain(transaction);
    });

    it('should remove negative, but keep positive transactions' , () => {
      const t1: Transaction = generateTransaction(100);
      const t2: Transaction = generateTransaction(2);
      const t3: Transaction = generateTransaction(-29);
      const t4: Transaction= generateTransaction(1234);
      const t5: Transaction = generateTransaction(-9912);
      const state: MatchState = generateInitialState([t1, t2, t3, t4, t5]);
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result.openTransactions.length).toEqual(3);
      expect(result.openTransactions).toContain(t1);
      expect(result.openTransactions).toContain(t2);
      expect(result.openTransactions).toContain(t4);
      expect(result.ignoredTransactions.length).toEqual(2);
      expect(result.ignoredTransactions).toContain(t3);
      expect(result.ignoredTransactions).toContain(t5);
    });

    it('should not manipulate the input', () => {
      const transaction: Transaction = generateTransaction(-1);
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result === state).toBeFalse();
      expect(state.openTransactions.length).toEqual(1);
      expect(state.ignoredTransactions.length).toEqual(0);
      expect(result.openTransactions.length).toEqual(0);
      expect(result.ignoredTransactions.length).toEqual(1);
    });
  });

  describe('filterListedPayers', () => {
    it('should throw an error if state is not set', () => {
      expect(() => service.filterListedPayers(null)).toThrowError('State is not set');
    });

    it('should not manipulate input state', () => {
      const state: MatchState = generateInitialState([{...generateTransaction(100), payer: 'DAMPSOFT GmbH'}]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result === state).toBeFalse();
    });

    it('should filter payer from list', () => {
      const transaction: Transaction = {...generateTransaction(100), payer: 'DAMPSOFT GmbH'};
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result.ignoredTransactions).toContain(transaction);
      expect(result.openTransactions.length).toEqual(0);
    });

    it('should not filter payers that are not on the list', () => {
      const transaction: Transaction = {...generateTransaction(1), payer: "Someone Else"};
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result.openTransactions).toContain(transaction);
      expect(result.ignoredTransactions.length).toEqual(0);
    });

    it('should filter only payers from list and leave the rest', () => {
      const t1: Transaction = {...generateTransaction(1), payer: 'BARMER'};
      const t2: Transaction = {...generateTransaction(4), payer: 'Jack Whob'};
      const t3: Transaction = {...generateTransaction(2), payer: 'AOK Rheinland/Hamburg'};
      const t4: Transaction = {...generateTransaction(10), payer: 'Rick Morty'};
      const state: MatchState = generateInitialState([t1, t2, t3, t4]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result.openTransactions).toContain(t2);
      expect(result.openTransactions).toContain(t4);
      expect(result.ignoredTransactions).toContain(t1);
      expect(result.ignoredTransactions).toContain(t3);
    });
  });
});

const generateTransaction = (amount: number): Transaction => {
  return {
    amount,
    // bic: 'bic',
    // bookingText: 'bookingText',
    // clientReference: 'clientReference',
    // collectiveReference: 'collectiveReference',
    // creditorId: 'creditor',
    currency: 'currency',
    // directDebit: 0,
    // iban: 'iban',
    info: 'info',
    mandateReference: 'mandateReference',
    orderAccount: 'orderAccount',
    payer: 'payer',
    // returnDebit: 0,
    transactionDate: 'transactionDate',
    usage: 'usage',
    valutaData: 'valutaDate',
    comment: 'comment'
  };
};

const generateInitialState = (remainingTransactions: Transaction[]): MatchState => {
  return {
    ignoredTransactions: [],
    initialBills: [],
    initialTransactions: [],
    openBills: [],
    openTransactions: remainingTransactions,
    validMatches: [],
    unassignableTransactions: [],
  };
};
