import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { AuthService } from '@app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<boolean> {
  constructor(private _authService: AuthService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._authService.getMyDetails(),
    ]);
    //   .pipe(switchMap((resp) => {
    //     return this._companyService.getCompany()
    // }))
  }
}
