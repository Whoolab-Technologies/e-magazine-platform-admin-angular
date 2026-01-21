import { ExtraOptions, NoPreloading, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard, NoAuthGuard } from './pages/auth/guards';
import { InitialDataResolver } from './app.resolver';
import { AuthenticatedGuard } from './pages/auth/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    resolve: { initialData: InitialDataResolver },
    children: [
      {
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
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'admins',
        loadChildren: () => import('./pages/admins/admins.module').then(m => m.AdminsModule)
      },
    ]
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' } // catch-all
];

const routerConfig: ExtraOptions = {
  useHash: false,
  preloadingStrategy: NoPreloading,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
