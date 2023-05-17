import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, Observable, mergeMap, of, map, tap, take, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
      .getCollection(path)
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
          if (classes.length)
            return this.getFilteredStudents(classes[0].id)
          return of([])
        }),

        map((response: any) => {
          console.log(response);
          return response

        })
      );
  }

  getFilteredStudents(classId: string): Observable<any[]> {
    this._class.next(classId)
    return this._allStudents.pipe(map(students =>
      students.filter((el) => el.class == classId)
    ), map(resp => {
      console.log(resp)
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
          console.log('all students');
          console.log(response);
          this._allStudents.next(response);
          return response
        })
      );
  }

  createNotification(notification, students) {
    const data = JSON.parse(JSON.stringify(notification))
    const path = `student`;
    return this._notifications.pipe(take(1),
      switchMap((_notifications: any) =>
        this._firebaseService
          .addDocument(`notifications`, data)
          .pipe(map(el => {
            data.id = el.id
            _notifications = [..._notifications, data];

            this._notifications.next(_notifications);
            return _notifications;
          }), mergeMap((resp) => {
            return this._httpClient.post(`${env.cloudBaseUrl}/${env.endPoints.notification}`,
              { notification: data, students: students },)
          }), tap((el) => {
            console.log("after api");
            console.log(el);
            return el;
          })
          ),
      )
    )
  }

}
