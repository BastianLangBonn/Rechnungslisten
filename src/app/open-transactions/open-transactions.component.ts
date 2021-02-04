import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { cpuUsage } from 'process';
import { compareAmount, compareAmountRev, comparePayer, comparePayerRev } from '../helper';
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

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    if(type === 'amount') {
      this.comparer = this.reverse ? compareAmountRev : compareAmount;
    } else if(type === 'payer') {
      this.comparer = this.reverse ? comparePayerRev : comparePayer;
    }
    this.reverse = !this.reverse;
  }

}
