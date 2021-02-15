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
    currency: string;
    info: string;
    comment?: string;
  }

  export interface TransactionMatch {
    transaction: Transaction;
    bills: Bill[];
  }

  export interface MatchResult {
    remainingBills: Bill[];
    remainingTransactions: Transaction[];
    notMatchingTransactions: Transaction[];
    filteredTransactions: Transaction[];
    validMatches: TransactionMatch[];
    invalidMatches: TransactionMatch[];
    initialTransactions: Transaction[];
    initialBills: Bill[];
  }

  export interface MoneyConstruct {
    amount: number;
  }