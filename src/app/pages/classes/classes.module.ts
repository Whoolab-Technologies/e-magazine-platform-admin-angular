import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassesRoutingModule } from './classes-routing.module';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassesComponent } from './classes/classes.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { AddEditClassComponent } from './add-edit-class/add-edit-class.component';

@NgModule({
  declarations: [
    ClassListComponent,
    ClassesComponent,
    AddEditClassComponent,
  ],
  imports: [
    CommonModule,
    ClassesRoutingModule,
    SharedModule,
    MatMenuModule
  ]
})
export class ClassesModule { }
