import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, forkJoin, switchMap } from 'rxjs';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { SettingsService } from './pages/settings/service/settings.service';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver  {
  constructor(private _authService: AuthService,
    private _setingsService: SettingsService,
    private _router: Router,
  ) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._authService.getMyDetails(),
    ])
      .pipe(switchMap((resp) => {
        return this._setingsService.loadSettings()
      }),
        catchError((error) => {
          this._authService.signOut()
          const parentUrl = state.url.split('/').slice(0, -1).join('/');

          // Navigate to there
          this._router.navigateByUrl(parentUrl);
          throw new Error(error);
        })
      )
  }
}
