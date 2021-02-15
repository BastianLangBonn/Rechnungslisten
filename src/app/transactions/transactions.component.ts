import { Component, Input, OnInit } from '@angular/core';
import { changeComparer, compareId } from '../helper';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input()
  transactions: Transaction[];

  comparer = compareId;
  reverse = true;

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {}

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reverse);
    this.reverse = !this.reverse;
  }

}