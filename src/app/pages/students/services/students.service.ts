import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray, snapshotToObj } from '@services/firebase/firebase.service';
import { BehaviorSubject, Observable, catchError, combineLatest, concatMap, forkJoin, map, switchMap, take, tap } from 'rxjs';
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
    return combineLatest([this._firebaseService
      .getCollection(path, [], "createdOn", "desc"), this._firebaseService
        .getCollection('classes')])
      .pipe(
        map(([studentsSnapshot, classesSnapshot]) => {
          const students = snapshotToArray(studentsSnapshot)
          const classes = snapshotToObj(classesSnapshot)
          const defaultSub = {
            self: true, status: false
          }
          students.map((el) => {
            const subjects = classes[el.class]['subjects'];
            const keys = Object.keys(subjects);
            var stdSubjects = {}
            keys.map((e) => {

              stdSubjects[e] = { ...subjects[e], ...(el.subjects[e] || defaultSub) }
              return e
            })
            el.subjects = stdSubjects
            return el
          })
          return students
        }),
        tap((response: any) => {
          this._students.next(response);
        })
      );
  }

  updatePurchaseStatus(index, student): Observable<any> {
    const collection = `student/${student.id}`;

    return this._students.pipe(
      take(1),
      switchMap((students: any) => this._firebaseService
        .setDoc(collection, student).pipe(map((doc: any) => {
          students[index] = student;
          return students;
        }), tap((response: any) => {
          this._students.next([...response]);
          return response;
        }),),
      ),)
  }

  deleteStudents(students) {
    return this._students.pipe(take(1),
      switchMap((_students: any) => {
        const observables: Observable<any>[] = [];
        students.forEach((student) => {
          observables.push(this._firebaseService.removeDocument(`student`, `${student.id}`));

        });
        return forkJoin(observables).pipe(map((el) => {
          return _students;
        }))

      }), map((_students) => {

        _students = _students.filter((student) =>
          !students.some(obj => obj.id === student.id)
        )

        this._students.next(_students);
        return _students;
      }))
  }
}
