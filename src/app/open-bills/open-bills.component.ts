import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';

@Component({
  selector: 'app-open-bills',
  templateUrl: './open-bills.component.html',
  styleUrls: ['./open-bills.component.css']
})
export class OpenBillsComponent implements OnInit {

  constructor(public matcher: MatcherService) { }

  ngOnInit(): void {
  }

}
