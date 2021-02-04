import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { PersistenceService } from '../persistence.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public matcher: MatcherService,
    private persistenceService: PersistenceService,
  ) {
   }

  ngOnInit(): void {
  }

  public storeTables() {
    this.persistenceService.storeMatches(this.matcher.matches);
  }

}
