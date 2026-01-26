import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from '@app/pages/students/students.component';
import { StudentsListComponent } from '@app/pages/students/students-list/students-list.component';
import { StudentsResolver } from '@app/pages/students/resolver/students.resolver';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    resolve: {
      staffs: StudentsResolver,
    },
    children: [{
      path: '',
      component: StudentsListComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
