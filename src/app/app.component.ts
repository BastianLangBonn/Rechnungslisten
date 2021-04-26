import { Component, OnInit } from '@angular/core';
import { Bill, Transaction } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ReLiVe';
  bills: Bill[] = [];
  transactions: Transaction[];

  constructor() {}

  ngOnInit(): void {}
}
