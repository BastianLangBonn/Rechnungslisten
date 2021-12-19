import { Component, OnInit } from '@angular/core';
import { getComparisonMethod, compareAmount, compareAmountRev, compareId, compareIdRev, compareName, compareNameRev } from '../helper';
import { MatcherService } from '../matcher.service';

@Component({
  selector: 'app-open-bills',
  templateUrl: './open-bills.component.html',
  styleUrls: ['./open-bills.component.css']
})
export class OpenBillsComponent implements OnInit {

  public comparer = compareId;
  public reversed = true;

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    this.comparer = getComparisonMethod(type, this.reversed);
    this.reversed = !this.reversed;
  }

}
