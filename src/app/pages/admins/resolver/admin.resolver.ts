import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { AdminService } from '../service/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminResolver  {

  constructor(private _service: AdminService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._service.getAdmins();
  }

}


@Injectable({
  providedIn: 'root'
})
export class AdminEditResolver  {

  constructor(private _service: AdminService, private _router: Router,) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._service.getAdmin(route.paramMap.get('id')).pipe(
      // Error here means the requested task is not available
      catchError((error) => {
        // Log the error
        console.error(error);

        // Get the parent url
        const parentUrl = state.url.split('/').slice(0, -1).join('/');

        // Navigate to there
        this._router.navigateByUrl(parentUrl);

        // Throw an error
        return throwError(error);
      })
    );
  }
}