import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {DataService} from '../service/data.service';

@Component({
  selector: 'app-table-example',
  templateUrl: './table-example.component.html',
  styleUrls: ['./table-example.component.css']
})
export class TableExampleComponent implements OnInit {



  tableData: TableType = new TableType([], []);
  stepSize = 10; // numbers of columns added in one time
  displayColumnNumber = 50; // how many columns will be displayed
  start = 0;
  end = 10;
  scrollbarThreshold = 100;
  isScrolling;
  numberOfColumns;

  @ViewChild('tableId') tableEle:ElementRef;

  constructor(
    private dataService: DataService,
    private _elementRef : ElementRef
  ) {
   }

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
    // if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    //   console.log("Height End");
    // }
    console.log(event.target.offsetWidth + event.target.scrollLeft , event.target.scrollWidth-this.scrollbarThreshold )
    if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth-this.scrollbarThreshold && this.end+this.stepSize<=this.dataService.getColumnNumber()) {
      setTimeout(()=>{this.moveToRight()}, 500);
      console.log("right end", event.target.offsetWidth + event.target.scrollLeft, event.target.scrollWidth-this.scrollbarThreshold)
      
    }
    if (event.target.scrollLeft<=0+this.scrollbarThreshold){
      this.moveToLeft();
    }
    console.log(event.target.offsetWidth , event.target.scrollLeft , event.target.scrollWidth)

    // detect isScrolling or not, add columns if scrolling is stopped
    clearTimeout(this.isScrolling)
    this.isScrolling = setTimeout(()=>{
      console.log("stop scrolling");
      // if (event.target.offsetWidth + event.target.scrollLeft >= event.target.scrollWidth-this.scrollbarThreshold) {
      //   this.moveToRight();
      // }
      // if (event.target.scrollLeft<=0+this.scrollbarThreshold){
      //   this.moveToLeft();
      // }
    }, 1000);
  }


  moveToRight() {
    this.end = Math.min(this.end+this.stepSize, this.dataService.getColumnNumber());
    this.start = Math.max(this.start, this.end-this.displayColumnNumber);
    this.updateData(this.start, this.end)
    
    console.log("right")
  }

  moveToLeft() {
    this.start = Math.max(0, this.start-this.stepSize);
    this.end = Math.min(Math.max(this.start+this.displayColumnNumber, this.displayColumnNumber), this.end);
    this.updateData(this.start, this.end)
  }

  onClickLeft() {
    let element = this.tableEle.nativeElement;
    this.tableEle.nativeElement.scrollLeft -= element.offsetWidth;
    if (element.scrollLeft<=0){
      this.moveToLeft();
    }
  }

  onClickRight() {
    let element = this.tableEle.nativeElement;
    this.tableEle.nativeElement.scrollLeft += element.offsetWidth;
    if (element.offsetWidth + element.scrollLeft >= element.scrollWidth-this.scrollbarThreshold) {
      // console.log("Width End");
      this.moveToRight();
    }
  }


}

class TableType {
  header: any[]
  rows: any[]

  constructor(header, rows){
    this.header = header;
    this.rows = rows;
  }
}
