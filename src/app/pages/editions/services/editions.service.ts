import { Injectable } from '@angular/core';
import { Student } from '@app/pages/students/models/student';
import { FirebaseService, snapshot, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable, map, mergeMap, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditionsService {
  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _subjects: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _editions: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _class: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _subject: BehaviorSubject<any | null> = new BehaviorSubject(null);
  constructor(
    private _firebaseService: FirebaseService
  ) { }

  get classes$(): Observable<any[]> {
    return this._classes.asObservable();
  }

  get subjects$(): Observable<any[]> {
    return this._subjects.asObservable();
  }
  get class$(): Observable<any> {
    return this._class.asObservable();
  }

  get subject$(): Observable<any> {
    return this._subject.asObservable();
  }
  get editions$(): Observable<any[]> {
    return this._editions.asObservable();
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
          if (classes.length)
            return this.getSubjects(classes[0].id)
          return of([])
        }),

        tap((response: any) => {
          this._editions.next(response);
          return response

        })
      );
  }

  getSubjects(classId: string): Observable<any[]> {
    const path = `classes/${classId}/subjects`;
    this._class.next(classId)
    return this._firebaseService
      .getCollection(path)
      .pipe(
        // catchError((error) => {
        //  // return this._appService.handleError(error);
        // }),
        mergeMap((response) => {
          const subjects = snapshotToArray(response);
          this._subjects.next(subjects);
          if (subjects.length)
            return this.getEditions(classId, subjects[0].id)
          return of([])
        }),
        map((editions) => {
          this._editions.next(editions);
          return editions;
        }),
      );
  }


  getEditions(classId: string, subjectId: string): Observable<any[]> {
    const path = `classes/${classId}/subjects/${subjectId}/editions`;
    this._subject.next(subjectId)
    return this._firebaseService
      .getCollection(path, 'index')
      .pipe(

        map((response) => {
          const editions = snapshotToArray(response);
          this._editions.next(editions);
          return editions
        })
      );
  }

  addEditions(className: string, subject: string, publishDate: moment.Moment, edition: any): Observable<any[]> {
    const editionData = JSON.parse(JSON.stringify(edition))
    const collection = `classes/${className}/subjects/${subject}/editions/${editionData.name}`;
    console.log("collection ", collection)
    const data = {
      date: publishDate.toDate(), path: collection, published: false,
    }
    return this.editions$.pipe(
      take(1),
      switchMap((editions: any) =>

        this._firebaseService
          .addDocument(`editions`, data)
          .pipe(
            mergeMap((doc) => {
              editionData.docId = doc.id
              editionData.id = editionData.name;
              return this._firebaseService
                .setDoc(collection, editionData).pipe(map(el => { return editionData }))
            }),
            map((doc: any) => {
              console.log("doc id", doc)

              this._editions.next([...editions, editionData]);

              // Return new booking from observable
              return editionData;
            })
          )
      )
    );

  }

  removeEditon(id) {
    return this.editions$.pipe(
      take(1),
      switchMap((editions) =>
        this._firebaseService.getDocument('editions', id).pipe(
          map(el => snapshot(el)),
          switchMap(edition => {
            const pathItems = (edition.path).split('/');
            const docId = pathItems.pop();
            const collection = pathItems.join('/');
            console.log('pathItems ', pathItems);
            console.log('collection ', collection);
            console.log('docId ', docId);
            return this._firebaseService.removeDocument(collection, docId)
          }), map((resp) => {
            // Find the index of the updated tag
            editions = editions.filter(
              (item) => item.docId != id
            );

            // Update the vacancy list
            this._editions.next(editions);

            // Return the updated tag
            return editions;
          }),
        )
      )
    );
  }
}
