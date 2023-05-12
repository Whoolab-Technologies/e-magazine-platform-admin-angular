
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, catchError, map, of, switchMap, throwError } from 'rxjs';
import { AppService } from '../app/app.service';
import { FirebaseService, snapshot } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authenticated: boolean = false;
  private _user: ReplaySubject<any> = new ReplaySubject<any>(1);
  /**
   * Constructor
   */
  constructor(
    private _userService: UserService,
    private _firebaseService: FirebaseService,
    private _appService: AppService
  ) {
    this._firebaseService.auth.onAuthStateChanged((user) => {
      this._user.next(user);
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  /**
   * Setter & getter for user id
   */
  set uid(uid: string) {
    localStorage.setItem('uid', uid);
  }

  get uid(): string {
    return localStorage.getItem('uid') ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._firebaseService.forgotPassword(email).pipe(
      switchMap((resp: any) => {
        return of(resp);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset password
   *
   * @param password
   */
  // resetPassword(password: string): Observable<any> {
  //   return this._httpClient.post('api/auth/reset-password', password);
  // }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    return this._firebaseService
      .signInWithEmailPassword(credentials.email, credentials.password)
      .pipe(
        switchMap((response: any) => {
          // Store the access token in the local storage
          this.accessToken = response.refreshToken;
          this.uid = response.user.uid;

          // Set the authenticated flag to true
          this._authenticated = true;

          // Store the user on the user service

          return this.getMyDetails();
        }),
        catchError((error) => {
          if (error instanceof FirebaseError) {
            var message = ''
            switch (error.code) {
              case 'auth/too-many-requests':
                message = "Too many login attempts"
                break;
              case 'auth/wrong-password':
                message = "Wrong username or password"
                break;
              default:
                message = "Wrong username or password"
            }

            return throwError(() => message);
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Get admin details
   */
  getMyDetails() {
    return this._firebaseService.getDocument(`admin`, this.uid).pipe(
      map((response) => {
        return snapshot(response);
      }),
      switchMap((response: any) => {
        this._authenticated = true;
        this._userService.user = response;
        return of(response);
      })
    );
  }
  /**
   * Sign in using the access token
   */
  isAuthorized(): Observable<any> {
    return this._user.pipe(
      switchMap((response: any) => {
        if (response) {
          this._authenticated = true;
          return of(true);
        }
        return of(false);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('uid');
    this._firebaseService.auth.signOut();

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }
    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }
    return this.isAuthorized();
  }

  revokeUser() {
    this._firebaseService.auth.currentUser.reload();
  }

  updatePassword(password): Observable<any> {
    return this._firebaseService.updatePassword(password).pipe(
      catchError((error) => {
        return throwError(() => new Error(error))
        //return this._appService.handleError(error);
      }),
      map(() => {
        this.revokeUser();
        return true;
      })
    );
  }
}
