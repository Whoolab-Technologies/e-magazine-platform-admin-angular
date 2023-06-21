import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { ClassesService } from '../services/classes.service';

@Injectable({
  providedIn: 'root'
})
export class ClassesResolver implements Resolve<boolean> {
  constructor(private _classesService: ClassesService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._classesService.getClasses()]);
  }
}
