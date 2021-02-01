import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { cpuUsage } from 'process';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-open-transactions',
  templateUrl: './open-transactions.component.html',
  styleUrls: ['./open-transactions.component.css']
})
export class OpenTransactionsComponent implements OnInit {

  private compareAmount = (a: Transaction, b: Transaction) => a.amount < b.amount ? -1 : 1;
  private compareAmountRev = (a: Transaction, b: Transaction) => this.compareAmount(b, a);
  private comparePayer = (a: Transaction, b: Transaction) => a.payer < b.payer ? -1 : 1;
  private comparePayerRev = (a: Transaction, b: Transaction) => this.comparePayer(b, a);
  public comparer = this.compareAmount;
  public reverse = true;

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    if(type === 'amount') {
      this.comparer = this.reverse ? this.compareAmountRev : this.compareAmount;
    } else if(type === 'payer') {
      this.comparer = this.reverse ? this.comparePayerRev : this.comparePayer;
    }
    this.reverse = !this.reverse;
  }

}
