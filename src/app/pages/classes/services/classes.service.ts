import { Injectable } from '@angular/core';
import { FirebaseService, Where, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, catchError, forkJoin, map, mergeMap, of, switchMap, take, tap, throwError, Observable } from 'rxjs';


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
      .getCollection(path, [], 'order')
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

  addOrUpdate(classObj: any, subjects: any[], edit: boolean = false): Observable<any> {
    const clsName = `${(classObj.name).toUpperCase()}`;
    const id = classObj.id || clsName;
    var el = {
      "id": id,
      "name": classObj.name,
      "order": classObj.order ? classObj.order : 0,
      "amount": classObj.amount ?? 0,
      "offer_price": classObj.offer_price ?? 0,
      "desc": "",
      "subjects": subjects,
      "expiry_date": classObj.expiry_date,

    };
    let observables$: any[] = [];

    return this._classes.pipe(take(1), switchMap((_classes) => {
      var clsSubject: any = {};

      observables$ = subjects.map((sub) => {
        const subject = `${(sub.name).toUpperCase()}`;
        const subjectId = sub.id || subject;
        clsSubject[subjectId] = {
          name: subject
        }
        var observable$ = this._firebaseService.setDoc(`classes/${id}/subjects/${subjectId}`, {
          name: subject,
          desc: sub.desc || '',
          image: sub.image || '',
          amount: sub.amount,
          offer_price: sub.offer_price ? sub.offer_price : 0,
        }, { merge: true });
        return observable$;
      });
      var observ$ = this._firebaseService.setDoc(`classes/${id}`, {
        name: clsName,
        order: el.order,
        amount: el.amount,
        offer_price: el.offer_price ?? 0,
        desc: el.desc || '',
        subjects: clsSubject,
        "expiry_date": el.expiry_date,
      }, { merge: true });

      return forkJoin([...observables$, observ$])
        .pipe(map((response: any) => {
          var clsName = classObj.name.toUpperCase();
          if (edit) {
            const clsIndex = _classes.findIndex(el => el.id === clsName);
            _classes[clsIndex] = {
              name: clsName,
              id: clsName,
              desc: el.desc || '',
              order: el.order,
              amount: el.amount,
              offer_price: el.offer_price ?? 0,

            }
          }
          else {
            _classes = [..._classes, {
              name: clsName,
              id: clsName,
              desc: el.desc || '',
              order: el.order,
              amount: el.amount,
              offer_price: el.offer_price ?? 0,
            }]
          }
          this._classes.next(_classes);
          return { msg: "Class and subjects have been updated successfully" };
        }), catchError((error) => {
          return throwError(() => error.error ? error.error : error);
        }), tap((el) => {
          return el;
        })
        )
    }));
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
    const clsName = `${(classId).toUpperCase()}`;
    const subjectName = `${(subject.name).toUpperCase()}`;

    const collection = `classes/${clsName}/subjects/${subject.id}`;
    const classCollection = `classes/${clsName}`;
    const subjectObj = {
      name: subjectName,
      desc: subject.desc || '',
      image: subject.image || '',
      amount: subject.amount,
      offer_price: subject.offer_price ?? 0,
    }
    var updates: any = {}
    updates[subject.id] = { name: subjectName }
    const subjectObservable$ = this._firebaseService
      .setDoc(collection, subjectObj, { merge: true });
    const classObservable$ = this._firebaseService
      .setDoc(classCollection, {
        subjects: updates,
      }, { merge: true });

    return this._subjects.pipe(take(1),
      switchMap((_subjects: any) =>
        forkJoin([
          subjectObservable$, classObservable$
        ])
          .pipe(map((response: any) => {
            var index = _subjects.findIndex((el) => {
              return el.id.toUpperCase() == subject.id.toUpperCase()
            })
            _subjects[index] = { ...subject, name: subject.name.toUpperCase() };
            this._subjects.next(_subjects);
            return { msg: "Subject have been updated successfully" };
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
            _subjects = _subjects.filter(el => el.id != subject.id)

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
