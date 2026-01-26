import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { routes } from '../../../consts';
import { AuthService } from '@app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public routers: typeof routes = routes;

  constructor(private router: Router, private _authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('canActivate');
    return this._check();
  }

  private _check(): Observable<boolean | UrlTree> {
    console.log('_check');
    return this._authService.check().pipe(
      map((authenticated) => {
        if (authenticated) {
          return true;
        }
        // Return UrlTree instead of calling navigate directly
        return this.router.createUrlTree([this.routers.LOGIN]);
      }),
      catchError(() => {
        // If the check fails (e.g., network error), redirect to login
        return of(this.router.createUrlTree([this.routers.LOGIN]));
      })
    );
  }
}
