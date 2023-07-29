import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionsComponent } from '@app/pages/editions/editions.component';
import { EditionsListComponent } from '@app/pages/editions/editions-list/editions-list.component';
import { EditionResolver, EditionsResolver } from '@app/pages/editions/resolver/editions.resolver';
import { EditionDetailsComponent } from './edition-details/edition-details.component';

const routes: Routes = [
  {
    path: '',
    component: EditionsComponent,

    children: [
      {
        path: '',
        component: EditionsListComponent,
        resolve: {
          editions: EditionsResolver
        },

      }, {
        path: ':id',
        resolve: {
          editions: EditionResolver
        },
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
