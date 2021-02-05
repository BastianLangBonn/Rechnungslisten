import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public comparer = compareId;
  public reversed = true;
  public billsDisplayed: Bill[];
  public activeFilter = '';
  public selectedBills: number[] = [];

  constructor(
    private route: ActivatedRoute,
    public matcher: MatcherService,
  ) { }

  ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.transaction = this.matcher.matches.remainingTransactions[id];
    this.billsDisplayed = this.matcher.matches.remainingBills;
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

  filterFor(type: string) {
    console.log('searchFor', type);
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
  }

}
