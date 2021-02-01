import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { MatchState } from '../types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  matchState: MatchState;

  constructor(public matcher: MatcherService) {
   }

  ngOnInit(): void {
  }

}
