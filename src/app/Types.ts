export interface FileHeader {
    url: string;
    fields: string[];
  }

export interface Bill {
    amount: number;
    amountStorno: number;
    billingNumber: string;
    canceled: string;
    clientId: number;
    date: string;
    taxApplied: number;
    taxFull: number;
    taxDifferent: string;
    taxReduced: number;
  }
