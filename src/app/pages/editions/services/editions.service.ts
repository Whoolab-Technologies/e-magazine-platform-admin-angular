import { Injectable } from '@angular/core';
import { Student } from '@app/pages/students/models/student';
import { FirebaseService, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, Observable, map, mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditionsService {
  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _subjects: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  constructor(
    private _firebaseService: FirebaseService
  ) { }

  get _classes$(): Observable<any[]> {
    return this._classes.asObservable();
  }

  get _subjects$(): Observable<any[]> {
    return this._subjects.asObservable();
  }


  getClasses(): Observable<any[]> {
    const path = `classes`;
    return this._firebaseService
      .getCollection(path)
      .pipe(
        // catchError((error) => {
        //  // return this._appService.handleError(error);
        // }),

        mergeMap((response) => {
          const classes = snapshotToArray(response);
          this._classes.next(classes);
          return this.getSubjects(classes[0].id)
        }),

        tap((response: any) => {
          console.log(" getClasses response ", response)
          return response

        })
      );
  }

  getSubjects(classId: string): Observable<any[]> {
    console.log("classId ", classId)

    const path = `classes/${classId}/subjects`;
    console.log(path)
    return this._firebaseService
      .getCollection(path)
      .pipe(
        // catchError((error) => {
        //  // return this._appService.handleError(error);
        // }),
        mergeMap((response) => {
          const subjects = snapshotToArray(response);

          return this.getEditions(classId, subjects[0].id)
        }),
        map((editions) => {
          console.log(" getSubjects response ", editions)
          return editions;
        }),
      );
  }


  getEditions(classId: string, subjectId: string): Observable<any[]> {
    console.log("classId ", classId, "subjectId ", subjectId)

    const path = `classes/${classId}/subjects/${subjectId}/edition`;
    console.log(path)
    return this._firebaseService
      .getCollection(path)
      .pipe(

        map((response) => {

          const editions = snapshotToArray(response);
          console.log("getEditions response", editions)
          return editions
        })
      );
  }
}
