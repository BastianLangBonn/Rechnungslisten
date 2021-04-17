import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBillsComponent } from './assign-bills.component';

describe('AssignBillsComponent', () => {
  let component: AssignBillsComponent;
  let fixture: ComponentFixture<AssignBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
