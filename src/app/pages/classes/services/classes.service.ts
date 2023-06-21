import { Injectable } from '@angular/core';
import { FirebaseService, snapshotToArray } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, mergeMap, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private _classes: BehaviorSubject<any[] | null> = new BehaviorSubject([]);

  constructor(
    private _firebaseService: FirebaseService
  ) { }

  get classes$(): Observable<any[]> {
    return this._classes.asObservable();
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
}
