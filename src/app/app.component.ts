import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataCollectorService } from './data-collector.service';
import { Bill, Client } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ReLiVe';

  constructor(public dataCollectorService: DataCollectorService) {}

  ngOnInit(): void {
  }
}
