import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditUpdateComponent } from './admin-edit-update/admin-edit-update.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OnlyNumbersDirective } from './directive/only-numbers.directive';
import { EmailValidatorDirective } from './directive/email-validator.directive';

@NgModule({
  declarations: [
    AdminComponent,
    AdminListComponent,
    AdminEditUpdateComponent,
    OnlyNumbersDirective,
    EmailValidatorDirective
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ]
})
export class AdminsModule { }
