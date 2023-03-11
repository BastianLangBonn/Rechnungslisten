import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  constructor() {}

  public splitCsvFile(content): string[][] {
    return content.match(/[^\r\n]+/g)
          .map((line: string) => line.split(';').map(field => field.trim()));
  }
}

