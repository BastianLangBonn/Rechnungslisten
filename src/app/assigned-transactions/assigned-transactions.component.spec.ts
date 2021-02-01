import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTransactionsComponent } from './assigned-transactions.component';

describe('AssignedTransactionsComponent', () => {
  let component: AssignedTransactionsComponent;
  let fixture: ComponentFixture<AssignedTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
