import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { BillCollectorService } from './bill-collector.service';

describe('BillCollectorService', () => {
  let service: BillCollectorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BillCollectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
  });
});
