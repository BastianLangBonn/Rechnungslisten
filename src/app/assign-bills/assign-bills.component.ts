import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatcherService } from '../matcher.service';
import { Transaction } from '../types';

@Component({
  selector: 'app-assign-bills',
  templateUrl: './assign-bills.component.html',
  styleUrls: ['./assign-bills.component.css']
})
export class AssignBillsComponent implements OnInit {

  public transaction: Transaction;

  constructor(
    private route: ActivatedRoute,
    public matcher: MatcherService,
  ) { }

  ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    console.log('id', id);
    this.transaction = this.matcher.matches.remainingTransactions[id];
    console.log('transaction', this.transaction);
  }

}
