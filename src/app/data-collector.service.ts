import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  constructor() {}

  public splitCsvFile(content): string[][] {
    return content.match(/[^\r\n]+/g)
          .map(line => line.split(';').map(field => field.trim()));
  }
}

