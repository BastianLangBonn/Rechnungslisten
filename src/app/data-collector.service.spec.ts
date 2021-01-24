import { TestBed } from '@angular/core/testing';

import { DataCollectorService as DataCollectorService } from './data-collector.service';

describe('FileServiceService', () => {
  let service: DataCollectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCollectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
