import { Component, OnInit } from '@angular/core';
import { compareAmount, compareAmountRev, compareId, compareIdRev, compareName, compareNameRev } from '../helper';
import { MatcherService } from '../matcher.service';

@Component({
  selector: 'app-open-bills',
  templateUrl: './open-bills.component.html',
  styleUrls: ['./open-bills.component.css']
})
export class OpenBillsComponent implements OnInit {

  public comparer = compareId;
  public reverse = true;

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    if(type === 'rnr') {
      this.comparer = this.reverse ? compareIdRev : compareId;
    }
    else if(type === 'amount') {
      this.comparer = this.reverse ? compareAmountRev : compareAmount;
    }
    else if(type === 'name') {
      this.comparer = this.reverse ? compareNameRev : compareName;
    }
    this.reverse = !this.reverse;
  }

}
