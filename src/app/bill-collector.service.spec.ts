import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { BillCollectorService } from './bill-collector.service';
import { MatchResult } from './types';
import { MatcherService } from './matcher.service';

describe('BillCollectorService', () => {
  let service: BillCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BillCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
