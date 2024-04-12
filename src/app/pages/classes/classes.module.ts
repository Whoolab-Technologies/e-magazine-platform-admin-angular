import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassesRoutingModule } from './classes-routing.module';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassesComponent } from './classes/classes.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { AddEditClassComponent, EditSubjectComponent } from './add-edit-class/add-edit-class.component';
import { HttpClientModule } from '@angular/common/http';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
  declarations: [
    ClassListComponent,
    ClassesComponent,
    AddEditClassComponent, EditSubjectComponent
  ],
  imports: [
    MatNativeDateModule,
    MatMomentDateModule,
    MatDatepickerModule,
    CommonModule,
    ClassesRoutingModule,
    SharedModule,
    HttpClientModule,
    MatMenuModule,
  ], entryComponents: [EditSubjectComponent]
})
export class ClassesModule { }
