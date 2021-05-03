import { VirtualScrollTableComponent } from './virtual-scroll-table/virtual-scroll-table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableExampleComponent } from './table-example/table-example.component';

const routes: Routes = [
  { path: '', component: VirtualScrollTableComponent },
  { path: 'table', component: TableExampleComponent },
  { path: 'scroll-table', component: VirtualScrollTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
