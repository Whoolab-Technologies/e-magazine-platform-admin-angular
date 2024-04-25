import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEditResolver, AdminResolver } from './resolver/admin.resolver';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditUpdateComponent } from './admin-edit-update/admin-edit-update.component';

const routes: Routes = [

  {
    path: '',
    component: AdminComponent,
    resolve: {
      admins: AdminResolver
    },
    children: [{
      path: '',
      component: AdminListComponent
    }, {
      path: ':id',
      resolve: {
        editions: AdminEditResolver
      },
      component: AdminEditUpdateComponent
    },]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
