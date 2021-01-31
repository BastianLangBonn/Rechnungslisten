import { Component, OnInit } from '@angular/core';
import { BillCollectorService } from './bill-collector.service';
import { MatcherService } from './matcher.service';
import { StoreDataService } from './store-data.service';
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
    private storeDataService: StoreDataService,
    private transactionCollector: TransactionCollectorService,
    private matcher: MatcherService
  ) {}

  ngOnInit(): void {
    this.getBills();
    this.getTransactions();
  }

  getBills() {
    this.billCollector.loadBills().subscribe(bills => this.bills = bills);
  }

  getTransactions() {
    this.transactionCollector.loadTransactions().subscribe(transactions => this.transactions = transactions);
  }

  match() {
    this.matcher.match(this.bills, this.transactions);
  }

  save() {
    this.storeDataService.storeBills(this.bills);
  }
}
