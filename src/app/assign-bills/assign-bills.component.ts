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
  public isAmountEqualToBill = (bill: Bill) => this.transaction.amount === bill.amount;
  public isPayerInBill = (bill: Bill) => this.transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase());
  public isIdInBill = (bill: Bill) => this.transaction.usage.match(/\d+/g)?.includes(bill.id) ?? false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public matcher: MatcherService,
  ) { }

  public ngOnInit(): void {
    this.getTransaction();
  }

  public getTransaction(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.transaction = this.matcher.matches.openTransactions[id];
  }

  public changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

  public isSelected(bill: Bill): boolean {
    return this.selectedBills.includes(bill);
  }

  public selectBill(bill: Bill): void {
    if (this.isSelected(bill)) {
      this.selectedBills = this.selectedBills.filter(b => b.id !== bill.id);
    } else {
      this.selectedBills.push(bill);
    }
  }

  public assignBills(): void {
    this.matcher.addMatches(this.transaction, this.selectedBills);
    this.getNextTransaction();
  }

  public removeTransaction(comment: string): void {
    this.matcher.markNotMatching(this.transaction, comment);
    this.getNextTransaction();
  }

  private getNextTransaction(): void {
    if           (this.matcher.matches.openTransactions.length === 0) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.transaction = this.matcher.matches.openTransactions[0];
    this.selectedBills = [];
  }

}
