import { Component, Input, OnInit } from '@angular/core';
import { changeComparer, compareId } from '../helper';
import { Bill } from '../types';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  public comparer = compareId;
  public reversed = true;

  @Input()
  bills: Bill[];

  constructor() { }

  ngOnInit(): void {
  }

  changeComparer(type: string): void {
    this.comparer = changeComparer(type, this.reversed);
    this.reversed = !this.reversed;
  }

}
