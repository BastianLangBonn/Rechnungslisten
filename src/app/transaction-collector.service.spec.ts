import { TestBed } from '@angular/core/testing';

import { TransactionCollectorService } from './transaction-collector.service';

describe('TransactionCollectorService', () => {
  let service: TransactionCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
