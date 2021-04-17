import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { InvalidMatchesComponent } from './invalid-matches.component';

describe('InvalidMatchesComponent', () => {
  let component: InvalidMatchesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidMatchesComponent ],
      imports: [HttpClientModule]
    });
  });

  it('should create', () => {
  });
});
