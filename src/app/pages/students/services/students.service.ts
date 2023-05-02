import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray } from '@services/firebase/firebase.service';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { Student } from '@app/pages/students/models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private _students: BehaviorSubject<Student[] | null> = new BehaviorSubject([]);
  constructor(
    private _firebaseService: FirebaseService
  ) { }

  get students$(): Observable<Student[]> {
    return this._students.asObservable();
  }


  getStudents(): Observable<any[]> {
    const path = `student`;
    return this._firebaseService
      .getCollection(path)
      .pipe(
        // catchError((error) => {
        //  // return this._appService.handleError(error);
        // }),

        map((response) => {
          return snapshotToArray(response);
        }),
        tap((response: any) => {
          this._students.next(response);
        })
      );
  }
}
