import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidMatchesComponent } from './invalid-matches.component';

describe('InvalidMatchesComponent', () => {
  let component: InvalidMatchesComponent;
  let fixture: ComponentFixture<InvalidMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidMatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
