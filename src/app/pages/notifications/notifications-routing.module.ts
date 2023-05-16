import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { NotificationResolver } from './resolver/notification.resolver';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';


const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    resolve: {
      staffs: NotificationResolver,
    },
    children: [{
      path: '',
      component: NotificationsListComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
