import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { Match } from '../types';

@Component({
  selector: 'app-assigned-transactions',
  templateUrl: './assigned-transactions.component.html',
  styleUrls: ['./assigned-transactions.component.css']
})
export class AssignedTransactionsComponent implements OnInit {

  matches: Match[];

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
    this.matches = this.matcher.matches.matches;
  }

}
