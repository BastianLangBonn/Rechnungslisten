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

    it('should do sth else', () => {
      // const transactions: [Transaction] = [
      //   {
      //     amount:
      //   }
      // ];
      const state: MatchState = {
        filteredTransactions: [],
        initialBills: [],
        initialTransactions: [],
        invalidMatches: [],
        notMatchingTransactions: [],
        remainingBills: [],
        remainingTransactions: [],
        validMatches: []
      };
    });
  });
});
