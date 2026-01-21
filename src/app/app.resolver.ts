import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { SettingsService } from './pages/settings/service/settings.service';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {

  constructor(
    private _authService: AuthService,
    private _settingsService: SettingsService,
    private _router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    console.log('[InitialDataResolver] Starting data resolution...');

    return forkJoin([
      this._authService.getMyDetails().pipe(
        tap(details => console.log('[InitialDataResolver] User details loaded:', details))
      )
    ]).pipe(
      switchMap(() => {
        console.log('[InitialDataResolver] Loading settings...');
        return this._settingsService.loadSettings().pipe(
          tap(settings => console.log('[InitialDataResolver] Settings loaded:', settings))
        );
      }),
      catchError((error) => {
        console.error('[InitialDataResolver] Error occurred during resolution:', error);

        // Sign out the user
        this._authService.signOut();

        // Navigate to parent route
        const parentUrl = state.url.split('/').slice(0, -1).join('/') || '/';
        console.log('[InitialDataResolver] Redirecting to:', parentUrl);
        this._router.navigateByUrl(parentUrl);

        // Return an empty observable so resolver completes gracefully
        return of(null);
      })
    );
  }
}
