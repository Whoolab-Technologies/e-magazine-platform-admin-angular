import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthPageComponent } from './containers';
import { NoAuthGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [NoAuthGuard],
    component: AuthPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class AuthRoutingModule {
}
