import { Injectable } from '@angular/core';
import {rows} from '../data/rows';
import {header} from '../data/header';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  header;
  rows;
  
  constructor() {
    this.rows = rows;
    this.header = header;
  }

  getSliceDataByColumn(start, end) {
    const fixedStart = Math.max(0, start);
    const fixedEnd = Math.min(end, this.header.length);
    const slicedHeader = this.header.slice(fixedStart, fixedEnd);
    let slicedRows = [];
    this.rows.forEach(element => {
      slicedRows.push(element.slice(fixedStart, fixedEnd));
    })
    return {
      rows: slicedRows,
      header: slicedHeader
    }
  }

  getColumnNumber() {
    return this.header.length;
  }

  getRowNumber() {
    return this.rows.length;
  }

}
