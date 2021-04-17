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
      expect(() => service.filterNegativeTransactions(state)).toThrowError();
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

const generateInitialState = (remainingTransactions: [Transaction]): MatchState => {
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
