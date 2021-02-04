import { Component, OnInit } from '@angular/core';
import { BillCollectorService } from './bill-collector.service';
import { MatcherService } from './matcher.service';
import { PersistenceService } from './persistence.service';
import { TransactionCollectorService } from './transaction-collector.service';
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

  constructor(
    private billCollector: BillCollectorService,
    private storeDataService: PersistenceService,
    private transactionCollector: TransactionCollectorService,
    private matcher: MatcherService
  ) {}

  ngOnInit(): void {}
}
