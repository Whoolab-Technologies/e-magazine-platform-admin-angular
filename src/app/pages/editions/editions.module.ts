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
import { EditionDetailsComponent } from './edition-details/edition-details.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    EditionsComponent,
    EditionsListComponent,
    EditionDetailsComponent
  ],
  imports: [
    CommonModule,
    EditionsRoutingModule,
    SharedModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatButtonModule
  ],
})
export class EditionsModule { }
