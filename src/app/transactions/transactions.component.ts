import { Component, Input, OnInit } from '@angular/core';
import { getComparisonMethod, compareId } from '../helper';
import { Bill, Transaction } from '../types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input()
  transactions: Transaction[];

  comparer: any = compareId;
  reverse = true;

  constructor() { }

  ngOnInit(): void {}

  changeComparer(type: string): void {
    this.comparer = getComparisonMethod(type, this.reverse);
    this.reverse = !this.reverse;
  }

}
