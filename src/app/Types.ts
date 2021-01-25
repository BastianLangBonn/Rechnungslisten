export interface FileHeader {
    url: string;
    fields: string[];
  }

export interface Bill {
    amount: number;
    amountStorno: number;
    billingNumber: number;
    canceled: string;
    clientId: number;
    date: string;
    taxApplied: number;
    taxFull: number;
    taxDifferent: string;
    taxReduced: number;
  }

  export interface Client {
      clientId: number;
      lastName: string;
      firstName: string;
      street: string;
      zip: number;
      city: string;
      country: string;
  }
