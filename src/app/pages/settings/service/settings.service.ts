import { Injectable } from '@angular/core';
import { FirebaseService, snapshot } from '@app/shared/services/firebase/firebase.service';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _settings: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private _firebaseService: FirebaseService,

  ) { }

  get settings$(): Observable<any[]> {
    return this._settings.asObservable();
  }

  updateSettings(data: any) {
    const path = `settings/settings`;
    return this._firebaseService
      .setDoc(path, data)
      .pipe(
        map((response) => {
          this._settings.next(data);
          return data;
        }),
      )
  }

  loadSettings() {
    const path = `settings`;
    return this._firebaseService
      .getDocument(path, 'settings')
      .pipe(
        map((response) => {
          return snapshot(response);
        }), tap((response) => {
          this._settings.next(response);
        }),
      )
  }
}
