import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToArrayPipe } from './to-array.pipe';
import { FirebaseDatePipe } from './firebase-date/firebase-date.pipe';



@NgModule({
  declarations: [
    ToArrayPipe,
    FirebaseDatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [ToArrayPipe, FirebaseDatePipe]
})
export class PipesModule { }
