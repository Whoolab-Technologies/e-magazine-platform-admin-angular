import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditUpdateComponent } from './admin-edit-update/admin-edit-update.component';
import { SharedModule } from '@app/shared/shared.module';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
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
