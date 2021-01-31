import { Component, OnInit } from '@angular/core';
import { DataCollectorService } from './data-collector.service';
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
    public dataCollectorService: DataCollectorService,
    private storeDataService: StoreDataService,
    private transactionCollector: TransactionCollectorService
  ) {
  }

  ngOnInit(): void {
    this.getBills();
    this.getTransactions();
  }

  getBills() {
    this.dataCollectorService.loadBills().subscribe(bills => this.bills = bills);
  }

  getTransactions() {
    this.transactionCollector.loadTransactions().subscribe(transactions => this.transactions = transactions);
  }

  save() {
    this.storeDataService.storeBills(this.bills);
  }
}
