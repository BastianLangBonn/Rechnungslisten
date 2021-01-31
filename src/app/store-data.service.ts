import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Bill } from './types';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {

  constructor() {}

  public storeBills(bills: Bill[]) {
    console.log('store', bills);
    const header = "Rechnungsnummer,Betrag,Name,Vorname\n";
    const text: string[] = bills.map(bill => `${bill.id},${bill.amount},${bill.lastName},${bill.firstName}\n`);
    const blob = new Blob([header, ...text], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "openBills.csv");
  }
}
