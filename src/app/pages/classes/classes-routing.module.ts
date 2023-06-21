import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes/classes.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassesResolver } from './resolver/classes.resolver';


const routes: Routes = [
  {
    path: '',
    component: ClassesComponent,
    resolve: {
      classes: ClassesResolver,
    },
    children: [{
      path: '',
      component: ClassListComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
