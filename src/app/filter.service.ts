import { Injectable } from '@angular/core';
import { MatchState, Transaction } from './types';

const FILTERED_PAYERS = [
  'Kassenzahnarztliche Vereinigung Nordrhein',
  'Techniker Krankenkasse',
  'DAMPSOFT GmbH',
  'IKK classic',
  'AOK Rheinland/Hamburg',
  'Unfallkasse NRW',
  'BARMER',
  'BSCARD',
  'Dr. Judith Nierlich',
  'Dr. Judith Gertrud Magdalena Euphemia Nierlich'
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
      openTransactions: state.openTransactions.filter(transaction => transaction.amount > 0),
      ignoredTransactions: state.openTransactions.filter(transaction => transaction.amount < 0),
    }
  }

  public filterListedPayers(state: MatchState): MatchState {
    if (!state) {
      throw new Error('State is not set');
    }
    const shallPayerBeIgnored = (payer: string) => FILTERED_PAYERS.includes(payer);
    const remainingTransactions = state.openTransactions.filter(transaction => !shallPayerBeIgnored(transaction.payer));
    const transactionsToIgnore = state.openTransactions.filter(transaction => shallPayerBeIgnored(transaction.payer));
    return {
      ...state,
      openTransactions: remainingTransactions,
      ignoredTransactions: [...state.ignoredTransactions, ...transactionsToIgnore],
    };
  }
}
