import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatcherService } from '../matcher.service';
import { Bill, Transaction } from '../types';

import { AssignBillsComponent } from './assign-bills.component';

class MockActivatedRoute {
  public snapshot = {
    paramMap: {
      get: (value: string) => 0
    }
  };
 }
class MockRouter { }
class MockMatcherService {
  public matches = {
    openTransactions: [{
      amount: 120,
      payer: 'fritz',
      usage: 'Rechnung'
    } as Transaction],
    openBills: [{
      amount: 120
    } as Bill]
  };
}

fdescribe('AssignBillsComponent', () => {
  let component: AssignBillsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssignBillsComponent,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: MatcherService, useClass: MockMatcherService }
      ]
    });
    component = TestBed.inject(AssignBillsComponent);

  });

  describe('Initialization', () => {
    it('Should not have any bills matched by id', () => {
      // expect(component.comparisonMethod).toBeUndefined();
      expect(component.billsMatchedById.length).toEqual(0);
    });

    it('Should not have any bills matched by amount', () => {
      expect(component.billsMatchedByAmount.length).toBe(0);
    });

    it('Should not have any bills matched by payer', () => {
      expect(component.billsMatchedByPayer.length).toBe(0);
    });
  });

  describe('OnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('Should correctly initialize bills', () => {
    });
  });

});
