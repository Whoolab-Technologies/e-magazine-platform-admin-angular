import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentsListComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StudentsRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ]
})
export class StudentsModule { }
