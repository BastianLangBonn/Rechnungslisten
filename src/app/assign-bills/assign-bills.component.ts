import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getComparisonMethod, compareId } from '../helper';
import { MatcherService } from '../matcher.service';
import { Bill, Transaction } from '../types';

/**
 * Component for assigning Bills to a given transaction.
 */
@Component({
  selector: 'app-assign-bills',
  templateUrl: './assign-bills.component.html',
  styleUrls: ['./assign-bills.component.css']
})
export class AssignBillsComponent implements OnInit {

  /** The transaction for which bills are getting assigned. */
  public transaction: Transaction;
  /** The comparison method that is used to sort the bills that are being displayed. */
  public comparisonMethod: ((a: Bill, b: Bill) => number) = compareId;
  /** The ordering of the list of bills. */
  public isDescendingOrder = true;
  /** All the bills that have been selected by the user and are highlighted. */
  public selectedBills: Bill[] = [];
  /** All bills that match the transaction by amount. */
  public billsMatchedByAmount: Bill[] = [];
  /** All bills that match the transaction by the payer name. */
  public billsMatchedByPayer: Bill[] = [];
  /** All bills that match the transaction by id. */
  public billsMatchedById: Bill[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public matcherService: MatcherService,
  ) { }

  public ngOnInit(): void {
    this.update();
  }

  private update(): void {
    this.transaction = this.getTransaction();
    const openBills: Bill[] = this.matcherService.getOpenBills();
    this.billsMatchedByAmount = openBills.filter(this.isAmountEqualToBill.bind(this));
    this.billsMatchedByPayer = openBills.filter(this.isPayerInBill.bind(this));
    this.billsMatchedById = openBills.filter(this.isIdInBill.bind(this));
    this.selectedBills = [];
  }

  private getTransaction(): Transaction {
    const id = +this.route.snapshot.paramMap.get('id');
    return this.matcherService.getOpenTransaction(id);
  }

  public changeComparer(type: string): void {
    this.comparisonMethod = getComparisonMethod(type, this.isDescendingOrder);
    this.isDescendingOrder = !this.isDescendingOrder;
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
    this.matcherService.addMatches(this.transaction, this.selectedBills);
    this.getNextTransaction();
  }

  public removeTransaction(comment: string): void {
    this.matcherService.markNotMatching(this.transaction, comment);
    this.getNextTransaction();
  }

  private getNextTransaction(): void {
    const openTransactions = this.matcherService.getOpenTransactions();
    if (openTransactions.length === 0) {
      this.router.navigate(['/dashboard']);
    } else {
      this.update();
    }
  }

  private isAmountEqualToBill(bill: Bill): boolean {
    return this.transaction.amount === bill.amount;
  }

  private isPayerInBill(bill: Bill): boolean {
    return this.transaction.payer.toUpperCase().includes(bill.lastName.toUpperCase());
  }

  private isIdInBill(bill: Bill): boolean {
    return this.transaction.usage.match(/\d+/g)?.includes(bill.id) ?? false;
  }

}
