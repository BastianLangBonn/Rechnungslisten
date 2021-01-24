import { Component, OnInit } from '@angular/core';
import { DataCollectorService } from './data-collector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ReLiVe';

  constructor(private dataCollectorService: DataCollectorService) {}
  ngOnInit(): void {
    this.dataCollectorService.readIndexXml();
  }
}
