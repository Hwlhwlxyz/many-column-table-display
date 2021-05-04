import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-virtual-scroll-table',
  templateUrl: './virtual-scroll-table.component.html',
  styleUrls: ['./virtual-scroll-table.component.css']
})
export class VirtualScrollTableComponent implements OnInit {


  tableData: TableType = new TableType([], []);
  stepSize = 25; // numbers of columns added in one time
  displayColumnNumber = 50; // how many columns will be displayed
  start = 0;
  end = 50;
  scrollbarThreshold = 100;
  isScrolling;
  numberOfColumns;

  @ViewChild('tableId') tableEle: ElementRef;

  constructor(
    private dataService: DataService,
    private _elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.updateData(this.start, this.end);
    this.numberOfColumns = this.dataService.getColumnNumber();
  }

  updateData(start, end) {
    const data = this.dataService.getSliceDataByColumn(start, end);
    this.tableData = new TableType(data.header, data.rows);
  }

  // @HostListener('scroll', ['$event']) // for scroll events of the current element
  // @HostListener('window:scroll', ['$event']) // for window scroll events
  @HostListener('scroll', ['$event']) // for scroll events of the current element
  onScroll(event) {
    console.log(event)
    // if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    //   console.log("Height End");
    // }
    console.log(event.target.offsetWidth + event.target.scrollLeft, event.target.scrollWidth)
    console.log(event.target.clientWidth + event.target.scrollLeft, event.target.scrollWidth)

    // scroll to right
    if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth - this.scrollbarThreshold && this.end <= this.dataService.getColumnNumber()) {
      // this.removeLeft(this.stepSize);
      // this.addToRight(this.stepSize);
      // detect isScrolling or not, add columns if scrolling is stopped, length of scrollbar need some time to update 
      // after updating the content, the scroll bar is still to the end, so we need to remove data first and then add data
      clearTimeout(this.isScrolling)
      this.isScrolling = setTimeout(() => {
        console.log("stop scrolling");
        if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth - this.scrollbarThreshold && this.end < this.dataService.getColumnNumber()) {
          this.removeLeft(Math.round(this.stepSize))
          setTimeout(() => {
            this.addToRight(Math.round(this.stepSize));
          }, 50);
        }
      }, 50);
    }

    // scroll to left
    if (event.target.scrollLeft <= 0 && this.start > 0) {
      clearTimeout(this.isScrolling)
      this.isScrolling = setTimeout(() => {
        console.log("stop scrolling");
        if (event.target.scrollLeft <= this.scrollbarThreshold && this.start > 0) {
          this.addToLeft(Math.min(this.stepSize, this.start));
          setTimeout(() => {
            this.removeRight(Math.min(this.stepSize, this.start));
            if (this.start > 8){
              // prevent the situation that the scrollbar jump to the end of right bound
              this.tableEle.nativeElement.scrollLeft = Math.min(this.tableEle.nativeElement.scrollLeft+this.getTotalWidthFromLeft(this.stepSize), 
              this.tableEle.nativeElement.scrollWidth-this.scrollbarThreshold-10);
            }
          }, 100);
        }
      }, 100);
    }

  }

  getTotalWidthFromLeft(numOfColumns){
    let totalWidth = 0
    if (this.tableEle.nativeElement.rows==null || this.tableEle.nativeElement.rows[0].cells==null){
      return 0;
    }
    console.log(this.tableEle.nativeElement.rows[0])
    for (let i=0; i<numOfColumns; i++){
      if (this.tableEle.nativeElement.rows[0].cells!=null){
        if (this.tableEle.nativeElement.rows[0].cells[i]==undefined){ // cannot get cells
          // console.log(this.tableEle.nativeElement.rows[0].cells)
        }  
        else {
          totalWidth = totalWidth + this.tableEle.nativeElement.rows[0].cells[i].offsetWidth;
        }
      }
    }
    return totalWidth;
  }

  // number of columns to add
  addToRight(numOfColumns) {
    const newEnd = Math.min(this.end + numOfColumns, this.dataService.getColumnNumber());
    const newData = this.dataService.getSliceDataByColumn(this.end, newEnd);
    Array.prototype.push.apply(this.tableData.header, newData.header);
    for (let i = 0; i < this.tableData.rows.length; i++) {
      Array.prototype.push.apply(this.tableData.rows[i], newData.rows[i]);
    }
    this.end = newEnd;
  }
  removeLeft(numOfColumns) {
    this.tableData.header.splice(0, numOfColumns);
    for (let i = 0; i < this.tableData.rows.length; i++) {
      this.tableData.rows[i].splice(0, numOfColumns);
    }
    this.start = this.start + numOfColumns;
  }
  addToLeft(numOfColumns) {
    const newStart = Math.max(this.start - numOfColumns, 0);
    const newData = this.dataService.getSliceDataByColumn(newStart, this.start);
    Array.prototype.unshift.apply(this.tableData.header, newData.header);
    for (let i = 0; i < this.tableData.rows.length; i++) {
      Array.prototype.unshift.apply(this.tableData.rows[i], newData.rows[i]);
    }
    this.start = newStart;
  }
  removeRight(numOfColumns){
    this.tableData.header.splice(this.tableData.header.length-numOfColumns, numOfColumns);
    for (let i = 0; i < this.tableData.rows.length; i++) {
      this.tableData.rows[i].splice(this.tableData.rows[i].length-numOfColumns, numOfColumns);
    }
    this.end = this.end - numOfColumns;
  }


}

class TableType {
  header: any[]
  rows: any[]

  constructor(header, rows) {
    this.header = header;
    this.rows = rows;
  }
}
