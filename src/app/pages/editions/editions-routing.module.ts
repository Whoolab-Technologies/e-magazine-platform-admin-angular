import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from './editions.component';
import { EditionsListComponent } from './editions-list/editions-list.component';

const routes: Routes = [
  {
    path: '',
    component: EditionsComponent,
    children: [{
      path: '',
      component: EditionsListComponent
    }]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditionsRoutingModule { }
