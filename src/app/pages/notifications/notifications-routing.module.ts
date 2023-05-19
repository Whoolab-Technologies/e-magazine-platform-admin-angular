import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { NotificationResolver, NotificationsResolver } from './resolver/notification.resolver';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';


const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    resolve: {
      students: NotificationsResolver,
    },
    children: [{
      path: '',
      component: NotificationsListComponent,

    }, {
      path: 'add',

      component: AddNotificationComponent,
      resolve: {
        classes: NotificationResolver,
      },

    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
