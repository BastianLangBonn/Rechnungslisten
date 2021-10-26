import { Component, OnInit } from '@angular/core';
import { changeComparer, compareAmount, compareAmountRev, comparePayer, comparePayerRev } from '../helper';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-open-transactions',
  templateUrl: './open-transactions.component.html',
  styleUrls: ['./open-transactions.component.css']
})
export class OpenTransactionsComponent implements OnInit {
  public comparer = compareAmount;
  public reverse = true;
  public openTransactions: Transaction[];

  constructor(public matcher: MatcherService) {
    this.openTransactions = matcher.matches.openTransactions;
   }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reverse);
    this.reverse = !this.reverse;
  }

}
