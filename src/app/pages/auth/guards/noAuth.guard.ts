import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { routes } from "@app/consts/routes";
import { AuthService } from "@app/shared/services/auth/auth.service";
import { Observable, switchMap, of } from "rxjs";


@Injectable()
export class NoAuthGuard implements CanActivate {
    public routers: typeof routes = routes;

    /*
    * Constructor
    */
    constructor(private _authService: AuthService, private _router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this._check();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @private
     */
    private _check(): Observable<any> {
        // Check the authentication status and return an observable of
        // "true" or "false" to allow or prevent the access
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                if (!authenticated) {
                    return of(true);
                }
                return this._router.navigate([this.routers.DASHBOARD]);
            })
        );
    }
}
