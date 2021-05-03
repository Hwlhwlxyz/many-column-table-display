import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableExampleComponent } from './table-example/table-example.component';
import { VirtualScrollTableComponent } from './virtual-scroll-table/virtual-scroll-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TableExampleComponent,
    VirtualScrollTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
