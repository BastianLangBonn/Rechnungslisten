import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialBillsComponent } from './initial-bills.component';

describe('InitialBillsComponent', () => {
  let component: InitialBillsComponent;
  let fixture: ComponentFixture<InitialBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
