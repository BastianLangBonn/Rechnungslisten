import { TestBed } from '@angular/core/testing';

import { BillCollectorService } from './bill-collector.service';

describe('BillCollectorService', () => {
  let service: BillCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
