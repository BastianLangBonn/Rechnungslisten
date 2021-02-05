import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { changeComparer, compareAmount, compareAmountRev, compareId, compareIdRev, compareName, compareNameRev } from '../helper';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-assign-bills',
  templateUrl: './assign-bills.component.html',
  styleUrls: ['./assign-bills.component.css']
})
export class AssignBillsComponent implements OnInit {

  public transaction: Transaction;
  public comparer = compareId;
  public reversed = true;

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
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

}
