import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './component/settings/settings.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { NoContentComponent } from './component/no-content/no-content.component';
import { ImageSelectorComponent } from './component/image-selector/image-selector.component';
@NgModule({
  declarations: [
    SettingsComponent,
    NoContentComponent,
    ImageSelectorComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
  ]
})
export class SettingsModule { }
