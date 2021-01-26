export interface FileHeader {
    url: string;
    fields: string[];
  }

export interface Bill {
    amount: number;
    amountStorno: number;
    id: number;
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
      zip: number;
      city: string;
      country: string;
  }