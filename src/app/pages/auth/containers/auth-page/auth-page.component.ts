import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/shared/services/auth/auth.service';
import { routes } from '../../../../consts';
import { map, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast/toast.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  public todayDate: Date = new Date();
  public routers: typeof routes = routes;

  constructor(
    private _service: AuthService,
    private router: Router,
    private _toastService: ToastService
  ) { }

  public sendLoginForm(event): void {

    this._service.signIn(event).pipe(map(el => {
      return el;
    }), tap((el) => {
      this.router.navigate([this.routers.DASHBOARD]).then();
    })).subscribe(() => {

    }, (error) => {
      this._toastService.showErrorToastr(error)
    })

    //  this.router.navigate([this.routers.DASHBOARD]).then();
  }

  public sendSignForm(): void {
    // this.service.sign();

    this.router.navigate([this.routers.DASHBOARD]).then();
  }
}
