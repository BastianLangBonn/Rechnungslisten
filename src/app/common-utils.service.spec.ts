import { TestBed } from '@angular/core/testing';
import { CommonUtilsService } from './common-utils.service';

describe('FileServiceService', () => {
  let service: CommonUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
