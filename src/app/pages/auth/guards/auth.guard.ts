import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

import { routes } from '../../../consts';
import { Observable, switchMap, of } from 'rxjs';
import { AuthService } from '@app/shared/services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public routers: typeof routes = routes;

  constructor(private router: Router, private _authService: AuthService,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this._check()

  }

  private _check(): Observable<any> {
    // Check the authentication status and return an observable of
    // "true" or "false" to allow or prevent the access
    return this._authService.check().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return of(authenticated);
        }

        return this.router.navigate([this.routers.LOGIN]);
      })
    );
  }
}
