import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface FileHeader {
    url: string;
    fields: string[];
  }

export interface Bill extends MoneyConstruct{
    id: string;
    clientId: number;
    date: string;
    amountStorno?: number;
    canceled?: string;
    taxApplied?: number;
    taxFull?: number;
    taxDifferent?: string;
    taxReduced?: number;
    firstName?: string;
    lastName?: string;
    transactionDate?: string;
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

  export interface Payment {
    billId: string;
    receiptNumber: number;
    paymentDate: string;
    clientId: number;
    process: string;
    amount: number;
    sourceAccount: number;
    contraAccount: number;
    changeDate: string;
    changeTime: number;
  }

  export interface Transaction extends MoneyConstruct{
    bic: string;
    bookingText: string;
    clientReference: string;
    collectiveReference: string;
    creditorId: string;
    currency: string;
    directDebit: number;
    iban: string;
    info: string;
    mandateReference: string;
    orderAccount: string;
    payer: string;
    returnDebit: number;
    transactionDate: string;
    usage: string;
    valutaData: string;
    comment?: string;
  }

  export interface TransactionMatch {
    transaction: Transaction;
    bills: Bill[];
  }

  export interface MatchState {
    /** All bills as read from the source */
    initialBills: Bill[];
    /** All transactions as read from the source */
    initialTransactions: Transaction[];
    /** All transactions that have been filtered */
    filteredTransactions: Transaction[];
    /** All transactions that have been manually marked unsassignable */
    unassignableTransactions: Transaction[];
    /** All valid matches found */
    validMatches: TransactionMatch[];
    /** Matches that have proven invalid due to wrong amount for example*/
    invalidMatches: TransactionMatch[];
    /** All bills that have not been matched yet */
    remainingBills: Bill[];
    /** All transactions that have not been matched or discarded yet */
    remainingTransactions: Transaction[];
  }

  export interface MoneyConstruct {
    amount: number;
  }