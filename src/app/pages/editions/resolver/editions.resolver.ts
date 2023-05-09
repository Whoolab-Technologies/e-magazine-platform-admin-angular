import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, forkJoin, of, throwError } from 'rxjs';
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


@Injectable({
  providedIn: 'root'
})
export class EditionResolver implements Resolve<boolean> {
  constructor(private _service: EditionsService, private _router: Router,) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._service.getEdition(route.paramMap.get('id')).pipe(
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