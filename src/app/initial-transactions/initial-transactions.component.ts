import { Component, OnInit } from '@angular/core';
import { compareId } from '../helper';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-initial-transactions',
  templateUrl: './initial-transactions.component.html',
  styleUrls: ['./initial-transactions.component.css']
})
export class InitialTransactionsComponent implements OnInit {

  comparer = compareId;
  transactions: Transaction[];

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {
    this.transactions = this.matcher.matches.initialTransactions;
  }

}
