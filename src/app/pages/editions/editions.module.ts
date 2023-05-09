import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';
import { EditionsListComponent } from './editions-list/editions-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';

import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditionDetailsComponent } from './edition-details/edition-details.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TopicListComponent } from './components/topic-list/topic-list.component';
import { TopicComponent } from './components/topic/topic.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    EditionsComponent,
    EditionsListComponent,
    EditionDetailsComponent,
    TopicListComponent,
    TopicComponent
  ],
  imports: [
    CommonModule, MatNativeDateModule, MatMomentDateModule,
    EditionsRoutingModule, MatDatepickerModule,
    SharedModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatButtonModule
  ],
})
export class EditionsModule { }
