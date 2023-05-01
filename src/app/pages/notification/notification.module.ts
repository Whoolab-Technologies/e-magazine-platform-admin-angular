import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';

import {
  ErrorToastrComponent,
  InfoToastrComponent,
  NotificationPageComponent,
  SuccessToastComponent
} from './containers';
import { NotificationRoutingModule } from './notification-routing.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    NotificationPageComponent,
    SuccessToastComponent,
    ErrorToastrComponent,
    InfoToastrComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ]
})
export class NotificationModule { }
