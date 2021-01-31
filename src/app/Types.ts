import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface FileHeader {
    url: string;
    fields: string[];
  }

export interface Bill {
    amount: number;
    amountStorno: number;
    id: string;
    canceled: string;
    clientId: number;
    date: string;
    taxApplied: number;
    taxFull: number;
    taxDifferent: string;
    taxReduced: number;
    firstName?: string;
    lastName?: string;
  }

  export interface Client {
      id: number;
      lastName: string;
      firstName: string;
      street: string;
      zip: string;
      city: string;
      country: string;
  }

  export interface Transaction {
    orderAccount: string;
    transactionDate: string;
    valutaData: string;
    bookingText: string;
    usage: string;
    creditorId: string;
    mandateReference: string;
    clientReference: string;
    collectiveReference: string;
    directDebit: number;
    returnDebit: number;
    payer: string;
    iban: string;
    bic: string;
    amount: number;
    currency: string;
    info: string;
  }

  export interface TransactionMatch {
    transaction: Transaction;
    bills: Bill[];
  }

  export interface MatchingState {
    remainingBills: Bill[];
    remainingTransactions: Transaction[];
    validMatches: TransactionMatch[];
    invalidMatches: TransactionMatch[];
  }