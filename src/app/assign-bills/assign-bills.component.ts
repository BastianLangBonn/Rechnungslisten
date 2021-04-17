import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { changeComparer, compareId} from '../helper';
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
  public selectedBills: Bill[] = [];
  filterForAmount = (bill: Bill) => this.transaction.amount === bill.amount;
  filterForPayer = (bill: Bill) => this.transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase());
  filterForBillId = (bill: Bill) => this.transaction.usage.match(/\d+/g).includes(bill.id);

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
    // console.log(id);
    this.transaction = this.matcher.matches.remainingTransactions[id];
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

  isSelected(bill: Bill): boolean {
    return this.selectedBills.includes(bill);
  }

  selectBill(bill: Bill): void {
    if( this.isSelected(bill) ) {
      this.selectedBills = this.selectedBills.filter(b => b.id !== bill.id);
    } else {
      this.selectedBills.push(bill);
    }
  }

  assignBills(): void {
    this.matcher.addMatch(this.transaction, this.selectedBills);
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
    this.selectedBills = [];
  }

}
