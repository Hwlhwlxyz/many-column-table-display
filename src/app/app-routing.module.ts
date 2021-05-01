import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableExampleComponent } from './table-example/table-example.component';

const routes: Routes = [
  { path: '', component: TableExampleComponent },
  { path: 'table', component: TableExampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
