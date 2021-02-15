import { Component, OnInit } from '@angular/core';
import { MatcherService } from '../matcher.service';
import { TransactionMatch } from '../types';

@Component({
  selector: 'app-invalid-matches',
  templateUrl: './invalid-matches.component.html',
  styleUrls: ['./invalid-matches.component.css']
})
export class InvalidMatchesComponent implements OnInit {

  matches: TransactionMatch[];

  constructor(private matcher: MatcherService) { }

  ngOnInit(): void {
    this.matches = this.matcher.matches.invalidMatches;
  }

}
