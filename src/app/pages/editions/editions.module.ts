import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';
import { EditionsListComponent } from './editions-list/editions-list.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    EditionsComponent,
    EditionsListComponent
  ],
  imports: [
    CommonModule,
    EditionsRoutingModule,
    SharedModule
  ]
})
export class EditionsModule { }
