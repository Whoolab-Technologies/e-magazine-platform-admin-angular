import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from '@app/pages/editions/editions.component';
import { EditionsListComponent } from '@app/pages/editions/editions-list/editions-list.component';
import { EditionsResolver } from '@app/pages/editions/resolver/editions.resolver';

const routes: Routes = [
  {
    path: '',
    component: EditionsComponent,
    resolve: {
      editions: EditionsResolver
    },
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
