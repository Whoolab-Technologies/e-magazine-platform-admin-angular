import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, catchError, map, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _subjects: BehaviorSubject<any[] | null> = new BehaviorSubject([]);

  constructor(
    private _firebaseService: FirebaseService,
    private _httpClient: HttpClient
  ) { }

  get classes$(): Observable<any[]> {
    return this._classes.asObservable();
  }
  get subjects$(): Observable<any[]> {
    return this._subjects.asObservable();
  }
  set subjects(subjts: any[]) {
    this._subjects.next(subjts);
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

            return of([])
        }),

        tap((response: any) => {

          return response

        })
      );
  }


  getSubjects(classId: string): Observable<any[]> {
    const path = `classes/${classId}/subjects`;
    return this._firebaseService
      .getCollection(path)
      .pipe(

        map((response) => {
          const subjects = snapshotToArray(response);
          this._subjects.next(subjects)
          return subjects;
        }),
      );
  }
  addOrUpdate(classObj: any, subjects: any[], edit: boolean = false): Observable<any[]> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    var requestObj = {
      "class": [
        {
          "name": classObj.name,
          "desc": "",
          "subjects": subjects
        }]
    };
    return this._classes.pipe(take(1),
      switchMap((_classes: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.class}`,
          requestObj,
          { headers: headers })
          .pipe(map((response: any) => {
            var clsName = classObj.name.toUpperCase();
            if (edit) {
              const clsIndex = _classes.findIndex(el => el.id === clsName);
              _classes[clsIndex] = {
                name: clsName,
                id: clsName,
                desc: "",
              }
            }
            else {
              _classes = [..._classes, {
                name: clsName,
                id: clsName,
                desc: "",
              }]
            }
            this._classes.next(_classes);
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

  deleteClass(classId: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    var clsName = classId.toUpperCase();
    var requestObj = {
      classId: clsName
    };
    return this._classes.pipe(take(1),
      switchMap((_classes: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.removeClass}`,
          requestObj,
          { headers: headers })
          .pipe(map((response: any) => {
            _classes = _classes.filter(el => el.name.toUpperCase() != clsName)
            this._classes.next(_classes);
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
  editSubject(classId, subject): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._subjects.pipe(take(1),
      switchMap((_subjects: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.editSubject}`,
          { classId: classId, subject: subject },
          { headers: headers, })
          .pipe(map((response: any) => {
            var index = _subjects.findIndex((el) => {
              el.name.toUpperCase() == subject.name
            })

            _subjects[index] = subject;
            this._subjects.next(_subjects);
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

  removeSubject(classId, subject): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._subjects.pipe(take(1),
      switchMap((_subjects: any) =>
        this._httpClient.post(`${env.cloudBaseUrl}${env.endPoints.removeSubject}`,
          { classId: classId, subjectId: subject.id },
          { headers: headers, })
          .pipe(map((response: any) => {
            _subjects = _subjects.filter(el => el.name.toUpperCase() != subject.name)
            this._subjects.next(_subjects);
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
