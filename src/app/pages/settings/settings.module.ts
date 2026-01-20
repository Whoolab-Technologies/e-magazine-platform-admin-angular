import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './component/settings/settings.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
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
