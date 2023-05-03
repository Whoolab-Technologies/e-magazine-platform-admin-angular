import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { EditionsService } from '@app/pages/editions/services/editions.service';

@Injectable({
  providedIn: 'root'
})
export class EditionsResolver implements Resolve<boolean> {
  constructor(private _editionService: EditionsService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._editionService.getClasses()]);
  }
}
