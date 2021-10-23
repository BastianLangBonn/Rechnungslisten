import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public totalAmount: number;

  @Input()
  public totalMoney: number;

  constructor() { }

  ngOnInit(): void {
  }

}
