import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from '@app/pages/editions/editions.component';
import { EditionsListComponent } from '@app/pages/editions/editions-list/editions-list.component';
import { EditionsResolver } from '@app/pages/editions/resolver/editions.resolver';
import { EditionDetailsComponent } from './edition-details/edition-details.component';

const routes: Routes = [
  {
    path: '',
    component: EditionsComponent,
    resolve: {
      editions: EditionsResolver
    },
    children: [
      {
        path: '',
        component: EditionsListComponent,

      }, {
        path: 'add',
        component: EditionDetailsComponent
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditionsRoutingModule { }
