import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { changeComparer, compareAmount, compareAmountRev, compareId, compareIdRev, compareName, compareNameRev } from '../helper';
import { MatcherService } from '../matcher.service';
import { Bill, Transaction } from '../types';

@Component({
  selector: 'app-assign-bills',
  templateUrl: './assign-bills.component.html',
  styleUrls: ['./assign-bills.component.css']
})
export class AssignBillsComponent implements OnInit {

  public transaction: Transaction;
  public comparer: ((a: Bill, b: Bill) => number) = compareId;
  public reversed = true;
  public billsDisplayed: Bill[];
  public activeFilter = '';
  public selectedBills: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public matcher: MatcherService,
  ) { }

  ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.transaction = this.matcher.matches.remainingTransactions[id];
    this.billsDisplayed = this.matcher.matches.remainingBills;
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

  filterFor(type: string) {
    this.clearSelection();
    const bills = this.matcher.matches.remainingBills;
    let filterFunction: (bill: Bill) => boolean;
    if( type === this.activeFilter ) {
      this.activeFilter = '';
      this.billsDisplayed = bills;
      return;
    }
    if( type === 'amount') {
      filterFunction = bill => this.transaction.amount === bill.amount;
    } else if( type === 'payer') {
      filterFunction = bill => this.transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase());
    } else if( type === 'rnr') {
      const numbersInUsage = this.transaction.usage.match(/\d+/g);
      filterFunction = bill => numbersInUsage.includes(bill.id);
    }
    this.activeFilter = type;
    this.billsDisplayed = bills.filter(filterFunction);
  }

  private clearSelection(): void {
    this.selectedBills = [];
  }

  clearFilter(): void {
    this.activeFilter = '';
    this.billsDisplayed = this.matcher.matches.remainingBills;
  }

  isSelected(index: number): boolean {
    return this.selectedBills.includes(index);
  }

  selectBill(index: number): void {
    if( this.isSelected(index) ) {
      this.selectedBills = this.selectedBills.filter(i => i !== index);
    } else {
      this.selectedBills.push(index);
    }
  }

  assignBills(): void {
    this.matcher.addMatch(this.transaction, this.selectedBills.map(i => this.billsDisplayed[i]));
    this.getNextTransaction();
  }

  removeTransaction(comment: string) {
    this.matcher.markNotMatching(this.transaction, comment);
    this.getNextTransaction();
  }

  private getNextTransaction() {
    if(this.matcher.matches.remainingTransactions.length === 0) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.transaction = this.matcher.matches.remainingTransactions[0];
    this.billsDisplayed = this.matcher.matches.remainingBills;
    this.selectedBills = [];
  }

}
