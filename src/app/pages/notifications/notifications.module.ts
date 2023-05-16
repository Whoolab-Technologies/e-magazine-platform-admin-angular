
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsRoutingModule } from './notifications-routing.module';


import {
  ErrorToastrComponent,
  InfoToastrComponent,
  NotificationPageComponent,
  SuccessToastComponent
} from './toast/containers';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsListComponent,
    NotificationPageComponent,
    SuccessToastComponent,
    ErrorToastrComponent,
    InfoToastrComponent
  ],
  imports: [
    CommonModule, NotificationsRoutingModule, SharedModule
  ]
})
export class NotificationsModule { }
