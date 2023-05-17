
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import {
  ErrorToastrComponent,
  InfoToastrComponent,
  NotificationPageComponent,
  SuccessToastComponent
} from './toast/containers';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsListComponent,
    NotificationPageComponent,
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
