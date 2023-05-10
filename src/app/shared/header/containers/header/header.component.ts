import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';
import { Router } from '@angular/router';

import { Email, User } from '../../../../pages/auth/models';
import { EmailService, } from '../../../../pages/auth/services';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { UserService } from '@app/shared/services/user/user.service';
import { routes } from '../../../../consts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isMenuOpened: boolean;
  @Output() toggleSideMenu = new EventEmitter<boolean>();
  public user$: Observable<User>
  public emails$: Observable<Email[]>
  public routers: typeof routes = routes;

  constructor(
    private userService: UserService,
    private _authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.user$ = this.userService.user$;
    this.emails$ = this.emailService.loadEmails();
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;

    this.toggleSideMenu.emit(this.isMenuOpened);
  }

  public signOut(): void {
    this._authService.signOut().pipe(filter(resp => resp), tap((el) => {
      this.router.navigate([this.routers.LOGIN]);

    }),).subscribe();

  }
}
