import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { Bill } from '../types';

@Component({
  selector: 'app-open-bills',
  templateUrl: './open-bills.component.html',
  styleUrls: ['./open-bills.component.css']
})
export class OpenBillsComponent implements OnInit {

  public comparer: (a: Bill, b: Bill) => number;
  public reverse = false;
  private compareId = (a: Bill, b: Bill) => +a.id < +b.id ? -1 : 1;
  private compareIdRev = (a: Bill, b: Bill) => this.compareId(b, a);
  private compareAmount = (a: Bill, b: Bill) => a.amount < b.amount ? -1 : 1;
  private compareAmountRev = (a: Bill, b: Bill) => this.compareAmount(b, a);
  private compareName = (a: Bill, b: Bill) => {
    if( a.lastName < b.lastName ){
      return -1;
    };
    if( a.lastName === b.lastName ){
      return a.firstName < b.firstName ? -1 : 1;
    }
  }
  private compareNameRev = (a: Bill, b: Bill) => this.compareName(b, a);

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    if(type === 'rnr') {
      this.comparer = this.reverse ? this.compareIdRev : this.compareId;
    }
    else if(type === 'amount') {
      this.comparer = this.reverse ? this.compareAmountRev : this.compareAmount;
    }
    else if(type === 'name') {
      this.comparer = this.reverse ? this.compareNameRev : this.compareName;
    }
    this.reverse = !this.reverse;
  }

}
