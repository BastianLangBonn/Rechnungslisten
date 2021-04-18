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
      expect(result.remainingTransactions).toContain(transaction);
      expect(result.filteredTransactions).toEqual([]);
    });

    it('should filter transaction if amount is negative', () => {
      const transaction: Transaction = generateTransaction(-10);
      const state: MatchState = generateInitialState([transaction])
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result.remainingTransactions).toEqual([]);
      expect(result.filteredTransactions).toContain(transaction);
    });

    it('should remove negative, but keep positive transactions' , () => {
      const t1: Transaction = generateTransaction(100);
      const t2: Transaction = generateTransaction(2);
      const t3: Transaction = generateTransaction(-29);
      const t4: Transaction= generateTransaction(1234);
      const t5: Transaction = generateTransaction(-9912);
      const state: MatchState = generateInitialState([t1, t2, t3, t4, t5]);
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result.remainingTransactions.length).toEqual(3);
      expect(result.remainingTransactions).toContain(t1);
      expect(result.remainingTransactions).toContain(t2);
      expect(result.remainingTransactions).toContain(t4);
      expect(result.filteredTransactions.length).toEqual(2);
      expect(result.filteredTransactions).toContain(t3);
      expect(result.filteredTransactions).toContain(t5);
    });

    it('should not manipulate the input', () => {
      const transaction: Transaction = generateTransaction(-1);
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterNegativeTransactions(state);
      expect(result === state).toBeFalse();
      expect(state.remainingTransactions.length).toEqual(1);
      expect(state.filteredTransactions.length).toEqual(0);
      expect(result.remainingTransactions.length).toEqual(0);
      expect(result.filteredTransactions.length).toEqual(1);
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
      expect(result.filteredTransactions).toContain(transaction);
      expect(result.remainingTransactions.length).toEqual(0);
    });

    it('should not filter payers that are not on the list', () => {
      const transaction: Transaction = {...generateTransaction(1), payer: "Someone Else"};
      const state: MatchState = generateInitialState([transaction]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result.remainingTransactions).toContain(transaction);
      expect(result.filteredTransactions.length).toEqual(0);
    });

    it('should filter only payers from list and leave the rest', () => {
      const t1: Transaction = {...generateTransaction(1), payer: 'BARMER'};
      const t2: Transaction = {...generateTransaction(4), payer: 'Jack Whob'};
      const t3: Transaction = {...generateTransaction(2), payer: 'AOK Rheinland/Hamburg'};
      const t4: Transaction = {...generateTransaction(10), payer: 'Rick Morty'};
      const state: MatchState = generateInitialState([t1, t2, t3, t4]);
      const result: MatchState = service.filterListedPayers(state);
      expect(result.remainingTransactions).toContain(t2);
      expect(result.remainingTransactions).toContain(t4);
      expect(result.filteredTransactions).toContain(t1);
      expect(result.filteredTransactions).toContain(t3);
    });
  });
});

const generateTransaction = (amount: number): Transaction => {
  return {
    amount,
    bic: 'bic',
    bookingText: 'bookingText',
    clientReference: 'clientReference',
    collectiveReference: 'collectiveReference',
    creditorId: 'creditor',
    currency: 'currency',
    directDebit: 0,
    iban: 'iban',
    info: 'info',
    mandateReference: 'mandateReference',
    orderAccount: 'orderAccount',
    payer: 'payer',
    returnDebit: 0,
    transactionDate: 'transactionDate',
    usage: 'usage',
    valutaData: 'valutaDate',
    comment: 'comment'
  };
}

const generateInitialState = (remainingTransactions: Transaction[]): MatchState => {
  return {
    filteredTransactions: [],
    initialBills: [],
    initialTransactions: [],
    invalidMatches: [],
    remainingBills: [],
    remainingTransactions,
    validMatches: [],
    unassignableTransactions: [],
  };
}
