import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/shared/model/user';
import { FirebaseService, Where, snapshot, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { UserService } from '@app/shared/services/user/user.service';
import { environment as env } from '@env/environment';
import { orderBy } from 'firebase/firestore';
import { BehaviorSubject, Observable, catchError, combineLatest, forkJoin, map, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {



  private _admins: BehaviorSubject<any[]> = new BehaviorSubject(null);
  private _admin: BehaviorSubject<any> = new BehaviorSubject(null);
  private _classes: BehaviorSubject<any> = new BehaviorSubject(null);
  private _class: BehaviorSubject<any> = new BehaviorSubject(null);
  private _user$: Observable<any>;

  constructor(
    private _firebaseService: FirebaseService,
    private _userService: UserService,
    private _httpClient: HttpClient,
  ) {

  }

  get admins$(): Observable<any[]> {
    return this._admins.asObservable();
  }
  get admin$() {
    return this._admin.asObservable();

  }
  get classes$(): Observable<any[]> {
    return this._classes.asObservable();
  }
  get class$() {
    return this._class.asObservable();

  }

  getAdmins(): Observable<any> {

    return combineLatest([this.getClasses(), this.getAdminList()])
  }

  getClasses(): Observable<any> {
    return this._firebaseService.getCollection('classes', [], "order", 'desc').pipe(
      mergeMap((response) => {
        const classes = snapshotToArray(response);
        this._classes.next(classes);
        if (classes.length)
          this._class.next(classes[0])
        return of(classes)
      }),

    )
  }
  getAdminList(): Observable<any> {

    return this._userService.user$.pipe(map((user) => user), mergeMap((user) => {
      const condition: Where[] = [
        { op: "!=", val: user.email, key: 'email' }
      ]
      return this._firebaseService.getCollection('admin', condition).pipe(
        map((_admins: any) => {
          const admins = snapshotToArray(_admins)
          this._admins.next(admins);
          return admins
        })
      )
    })
    );
  }

  getAdmin(id: any): Observable<any> {
    return this._admins.pipe(take(1),
      map((admins) => {
        // Find the task
        const admin = admins.find((item) => item.id === id) || null;

        // Update the task
        this._admin.next(admin);

        // Return the task
        return admin;
      }),
      switchMap((admin) => {
        if (!admin && id != 'new') {
          return throwError(
            'Could not found task with id of ' + id + '!'
          );
        }
        return of(admin);
      })
    );
  }

  deleteAdmins(admins: any): any {
    return this._admins.pipe(take(1),
      switchMap((_admins: any) => {
        const observables: Observable<any>[] = [];
        admins.forEach((admin) => {
          observables.push(this._firebaseService.removeDocument(`admin`, `${admin.id}`));

        });
        return forkJoin(observables).pipe(map((el) => {
          return _admins;
        }))

      }), map((_admins) => {

        _admins = _admins.filter((admin) =>
          !admins.some(obj => obj.id === admin.id)
        )

        this._admins.next(_admins);
        return _admins;
      }))
  }

  createAdmin(admin: any, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._admins.pipe(take(1),
      switchMap((_admins: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.admin}`,
          { admin, password },
          { headers: headers, })
          .pipe(map((response: any) => {
            admin["id"] = response.user.uid;
            const admins = [..._admins, admin]
            this._admins.next(admins);
            return response;
          }), catchError((error) => {
            return throwError(() => error.error ? error.error : error);
          }), tap((el) => {
            return el;
          })
          ),
      )
    )
  }
}
