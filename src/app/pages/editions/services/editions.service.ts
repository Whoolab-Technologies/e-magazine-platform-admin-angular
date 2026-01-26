import { Injectable } from '@angular/core';
import { FirebaseService, Where, snapshot, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import moment from 'moment';
import { BehaviorSubject, Observable, forkJoin, map, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditionsService {
  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _subjects: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _editions: BehaviorSubject<any[] | null> = new BehaviorSubject([]);
  private _class: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _subject: BehaviorSubject<any | null> = new BehaviorSubject(null);

  private _edition: BehaviorSubject<any | null> = new BehaviorSubject(null);
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

  get edition$(): Observable<any> {
    return this._edition.asObservable();
  }

  getClasses(): Observable<any[]> {
    const path = `classes`;
    return this._firebaseService
      .getCollection(path, [], 'order')
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
    const path = `editions`;
    this._subject.next(subjectId)
    const condition: Where[] = [
      { key: "class", op: "==", val: classId },
      { key: "subject", op: "==", val: subjectId },
    ];

    return this._firebaseService
      .getCollection(path, condition, 'index')
      .pipe(

        map((response) => {
          const editions = snapshotToArray(response);
          this._editions.next(editions);
          return editions
        })
      );
  }

  addEditions(className: string, subject: string, publishDate: moment.Moment, edition: any, isNewSub: boolean = false): Observable<any[]> {
    const editionData = JSON.parse(JSON.stringify(edition))
    const collection = `classes/${className}/subjects/${subject}/editions`;
    const data = {
      ...editionData,
      date: publishDate.toDate(),
      class: className, subject: subject,
    }
    return this.editions$.pipe(
      take(1),
      switchMap((editions: any) =>

        this._firebaseService
          .addDocument(`editions`, data)
          .pipe(
            mergeMap((doc) => {
              editionData.id = doc.id;
              editionData.published = false,
                editionData.date = publishDate.toDate();

              return this._firebaseService
                .setDoc(`${collection}/${doc.id}`, editionData).pipe(map(el => { return editionData }))
            }),
            map((doc: any) => {
              isNewSub ?
                this._editions.next([editionData]) :
                this._editions.next([...editions, editionData]);

              // Return new booking from observable
              return editionData;
            })
          )
      )
    );

  }

  editEditions(className: string, subject: string, publishDate: moment.Moment, edition: any): Observable<any[]> {
    // const editionData = JSON.parse(JSON.stringify(edition))
    // const collection = `classes/${className}/subjects/${subject}/editions/${editionData.id}`;


    const editionData = JSON.parse(JSON.stringify(edition))
    const collection = `classes/${className}/subjects/${subject}/editions`;
    const data = {
      ...editionData,
      date: publishDate.toDate(), published: false,
      class: className, subject: subject,
    }



    return this.editions$.pipe(
      take(1),
      switchMap((editions: any) => {
        editionData.date = publishDate.toDate();
        return forkJoin([this._firebaseService
          .setDoc(`${collection}/${editionData.id}`, editionData, { merge: true },), this._firebaseService
            .setDoc(`editions/${editionData.id}`, editionData, { merge: true },),]).pipe(map(() => {
              const index = editions.findIndex(
                (item) => item.id === edition.id
              );

              // Update the booking
              editions[index] = editionData;
              this._editions.next(editions);

              return editionData;
            }))
      }),

    );
  }




  removeEditon(id) {
    return this._editions.pipe(
      take(1),
      switchMap((editions) => {
        const edition = editions.find(
          (item) => item.id == id
        );
        const collection = `classes/${edition.class}/subjects/${edition.subject}/editions`;
        return forkJoin([
          this._firebaseService.removeDocument(collection, id),
          this._firebaseService.removeDocument('editions', id)
        ]).pipe(map((resp) => {
          // Find the index of the updated tag
          editions = editions.filter(
            (item) => item.id != id
          );

          // Update the vacancy list
          this._editions.next(editions);

          // Return the updated tag
          return editions;
        }),
        );

      }),
    );
  }

  getEdition(id) {
    return this.editions$.pipe(
      take(1),
      map((editions) => {
        // Find the task
        const edition = editions.find((item) => item.id === id) || null;

        // Update the task
        this._edition.next(edition);

        // Return the task
        return edition;
      }),
      switchMap((edition) => {
        if (!edition && id != 'new') {
          return throwError(
            'Could not found task with id of ' + id + '!'
          );
        }
        return of(edition);
      })
    );
  }

}
