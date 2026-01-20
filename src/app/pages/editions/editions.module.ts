import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';
import { EditionsListComponent } from './editions-list/editions-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditionDetailsComponent } from './edition-details/edition-details.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditionVideoComponent } from './edition-video/edition-video.component';
import { VideoListComponent } from './components/video-list/video-list.component';

import { VideoItemComponent } from './components/video-item/video-item.component';
@NgModule({
  declarations: [
    EditionsComponent,
    EditionsListComponent,
    EditionDetailsComponent,
    EditionVideoComponent,
    VideoListComponent,
    VideoItemComponent
  ],
  imports: [
    CommonModule, MatNativeDateModule, MatMomentDateModule,
    EditionsRoutingModule, MatDatepickerModule, DragDropModule, MatSlideToggleModule,
    SharedModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatButtonModule
  ],
})
export class EditionsModule { }
