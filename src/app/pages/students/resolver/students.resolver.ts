import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { StudentsService } from '@app/pages/students/services/students.service';

@Injectable({
  providedIn: 'root'
})

export class StudentsResolver  {
  constructor(private _studentsService: StudentsService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._studentsService.getStudents()]);
  }
}
