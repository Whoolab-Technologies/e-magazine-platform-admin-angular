import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    StudentsComponent,
    StudentsListComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule, SharedModule,
  ]
})
export class StudentsModule { }
