import { ExtraOptions, NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardPageComponent } from './pages/dashboard/containers';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard, NoAuthGuard } from './pages/auth/guards';
import { InitialDataResolver } from './app.resolver';

const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [{
      path: 'dashboard',
      loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)

    },

    {
      path: 'notifications',

      loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule)
    },
    {
      path: 'classes',

      loadChildren: () => import('./pages/classes/classes.module').then(m => m.ClassesModule)
    },
    {
      path: 'students',

      loadChildren: () => import('./pages/students/students.module').then(m => m.StudentsModule)
    },
    {
      path: 'editions',

      loadChildren: () => import('./pages/editions/editions.module').then(m => m.EditionsModule)
    },]
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    children: [{
      path: '',

      loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },]
  }

];
const routerConfig: ExtraOptions = {
  useHash: false,
  preloadingStrategy: NoPreloading,
  scrollPositionRestoration: 'enabled',
};
@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerConfig)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
