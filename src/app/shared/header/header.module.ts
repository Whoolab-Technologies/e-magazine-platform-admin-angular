import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatBadgeModule } from '@angular/material/badge';

import { HeaderComponent } from './containers';
import { UserComponent, EmailComponent } from './components';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SearchComponent } from './components/search/search.component';
import { ShortNamePipe } from './pipes';

@NgModule({
  declarations: [
    HeaderComponent,
    UserComponent,
    EmailComponent,
    NotificationsComponent,
    SearchComponent,
    ShortNamePipe
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatBadgeModule
  ]
})
export class HeaderModule { }
