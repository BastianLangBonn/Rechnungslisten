import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredTransactionsComponent } from './filtered-transactions.component';

describe('FilteredTransactionsComponent', () => {
  let component: FilteredTransactionsComponent;
  let fixture: ComponentFixture<FilteredTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
