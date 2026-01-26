import { Injectable } from '@angular/core';
import { User } from '@app/pages/auth/models';

import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  /**
   * Constructor
   */
  constructor() { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }

  get user$(): Observable<any> {
    return this._user.asObservable();
  }

}
