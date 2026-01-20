
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { MatSelectModule } from '@angular/material/select';

import {
  ErrorToastrComponent,
  InfoToastrComponent,
  SuccessToastComponent
} from './toast/containers';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsListComponent,
    //   NotificationPageComponent,
    SuccessToastComponent,
    ErrorToastrComponent,
    InfoToastrComponent,
    AddNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule, MatPaginatorModule,
    MatCheckboxModule, MatSelectModule
  ]
})
export class NotificationsModule { }
