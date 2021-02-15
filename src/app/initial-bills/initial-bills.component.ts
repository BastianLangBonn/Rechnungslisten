import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { Bill } from '../types';

@Component({
  selector: 'app-initial-bills',
  templateUrl: './initial-bills.component.html',
  styleUrls: ['./initial-bills.component.css']
})
export class InitialBillsComponent implements OnInit {

  bills: Bill[];

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {
    this.bills = this.matcher.matches.initialBills;
  }

}
