import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-not-matched-transactions',
  templateUrl: './not-matched-transactions.component.html',
  styleUrls: ['./not-matched-transactions.component.css']
})
export class NotMatchedTransactionsComponent implements OnInit {

  transactions: Transaction[];

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {
    this.transactions = this.matcher.matches.notMatchingTransactions;
  }

}
