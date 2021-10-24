import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-filtered-transactions',
  templateUrl: './filtered-transactions.component.html',
  styleUrls: ['./filtered-transactions.component.css']
})
export class FilteredTransactionsComponent implements OnInit {

  transactions: Transaction[];

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {
    this.transactions = this.matcher.matches.ignoredTransactions;
  }

}
