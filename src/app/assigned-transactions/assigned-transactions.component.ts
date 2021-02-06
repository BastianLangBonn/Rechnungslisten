import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { TransactionMatch } from '../types';

@Component({
  selector: 'app-assigned-transactions',
  templateUrl: './assigned-transactions.component.html',
  styleUrls: ['./assigned-transactions.component.css']
})
export class AssignedTransactionsComponent implements OnInit {

  matches: TransactionMatch[];

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
    this.matches = this.matcher.matches.validMatches;
  }

}
