import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, Observable, mergeMap, of, map, tap, take, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment as env } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _students: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _allStudents: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _notifications: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _class: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(
    private _firebaseService: FirebaseService,
    private _httpClient: HttpClient
  ) { }

  get classes$(): Observable<any[]> {
    return this._classes.asObservable();
  }
  get notifications$(): Observable<any[]> {
    return this._notifications.asObservable();
  }

  get students$(): Observable<any[]> {
    return this._students.asObservable();
  }
  get class$(): Observable<any> {
    return this._class.asObservable();
  }


  getNotifications(): Observable<any[]> {
    const path = `notifications`;
    return this._firebaseService
      .getCollection(path, [], "createdOn", 'desc')
      .pipe(

        map((response) => {
          return snapshotToArray(response);

        }),

        tap((response: any) => {
          this._notifications.next(response)
          return response

        })
      );
  }

  getClasses(): Observable<any[]> {
    const path = `classes`;
    return this._firebaseService
      .getCollection(path)
      .pipe(

        mergeMap((response) => {
          const classes = snapshotToArray(response);
          this._classes.next(classes);
          if (classes.length) {
            return this.getFilteredStudents(classes[0].id)
          }
          return of([])
        }),

        map((response: any) => {
          return response

        })
      );
  }

  getFilteredStudents(classId: string): Observable<any[]> {
    this._class.next(classId)
    return this._allStudents.pipe(map(students =>
      students.filter((el) => el.class == classId)
    ), map(resp => {
      this._students.next(resp)
      return resp
    }),
    );
  }

  getStudents(): Observable<any[]> {
    const path = `student`;
    return this._firebaseService
      .getCollection(path)
      .pipe(

        map((response) => {
          return snapshotToArray(response);
        }),
        map((response: any) => {
          this._allStudents.next(response);
          return response
        })
      );
  }

  createNotification(notification, students) {
    const data = JSON.parse(JSON.stringify(notification))
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    const path = `notifications`;
    return this._notifications.pipe(take(1),
      switchMap((_notifications: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.notification}`,
          { notification: data, students: students }, { headers: headers })
          .pipe(map((response: any) => {
            data.id = response.id
            _notifications = [data, ..._notifications];

            this._notifications.next(_notifications);
            return _notifications;
          }), tap((el) => {
            return el;
          })
          ),
      )
    )
  }

}
