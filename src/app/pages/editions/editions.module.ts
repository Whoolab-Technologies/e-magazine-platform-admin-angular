import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';
import { EditionsComponent } from './editions.component';
import { EditionsListComponent } from './editions-list/editions-list.component';


@NgModule({
  declarations: [
    EditionsComponent,
    EditionsListComponent
  ],
  imports: [
    CommonModule,
    EditionsRoutingModule
  ]
})
export class EditionsModule { }
