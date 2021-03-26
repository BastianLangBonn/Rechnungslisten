import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatcherService } from './matcher.service';

describe('MatcherService', () => {
  let service: MatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
