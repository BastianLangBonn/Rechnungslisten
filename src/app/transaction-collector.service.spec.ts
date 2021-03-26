import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { TransactionCollectorService } from './transaction-collector.service';

describe('TransactionCollectorService', () => {
  let service: TransactionCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TransactionCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
