import { Injectable } from '@angular/core';
import { exception } from 'console';
import { MatchState } from './types';

const FILTERED_PAYERS = [
  'Kassenzahnarztliche Vereinigung Nordrhein',
  'Techniker Krankenkasse',
  'DAMPSOFT GmbH',
  'IKK classic',
  'AOK Rheinland/Hamburg',
  'Unfallkasse NRW',
  'BARMER',
  'BSCARD',
];

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public filterNegativeTransactions(state: MatchState): MatchState {
    if(!state) {
      throw new Error('State is not set');
    }
    return {
      ...state,
      remainingTransactions: state.remainingTransactions.filter(transaction => transaction.amount > 0),
      filteredTransactions: state.remainingTransactions.filter(transaction => transaction.amount < 0),
    }
  }

  public filterListedPayers(state: MatchState): MatchState {
    return {
      ...state,
      remainingTransactions: state.remainingTransactions.filter(transaction => !FILTERED_PAYERS.includes(transaction.payer)),
      filteredTransactions: state.filteredTransactions.concat(state.remainingTransactions.filter(transaction => FILTERED_PAYERS.includes(transaction.payer))),
    }
  }
}
