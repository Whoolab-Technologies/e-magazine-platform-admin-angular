import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, from, switchMap, map } from 'rxjs';
import { FirebaseService } from '@services/firebase/firebase.service';
import 'firebase/storage';
import { getStorage, TaskState, TaskEvent, FirebaseStorage, ref, uploadString, uploadBytesResumable, UploadTask, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _progress: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    // private _errorService: ErrorService,
    private _firebaseService: FirebaseService
  ) { }

  get progress$(): Observable<number> {
    return this._progress.asObservable();
  }

  // handleError(error: Error | HttpErrorResponse) {
  //   let message;
  //   let stackTrace;
  //   if (error instanceof HttpErrorResponse) {
  //     // Server Error
  //     message = this._errorService.getServerMessage(error);
  //     stackTrace = this._errorService.getServerStack(error);
  //     //    this.notifier.showError(message);
  //   } else {
  //     // Client Error
  //     message = this._errorService.getClientMessage(error);
  //     stackTrace = this._errorService.getClientStack(error);
  //     // this.notifier.showError(message);
  //   }
  //   return throwError(() => message);
  // }

  uploadImage(path: string, file): Observable<any> {
    const _uploadTask: BehaviorSubject<string> = new BehaviorSubject(null);

    const storageRef = ref(this._firebaseService.storage, `${path}/${file.name}`);

    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

    var unSubscribe = uploadTask.on(
      'state_changed',
      (snapshot) => {

        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this._progress.next(progress);

      },
      (error) => {
        this._progress.next(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          this._progress.next(0);
          _uploadTask.next(url)
          unSubscribe();
        })
      }
    );
    return _uploadTask.asObservable()
  }
}

export const scrollToBottom = (element) => {
  setTimeout(() => {
    element.nativeElement.scrollTop =
      element.nativeElement.scrollHeight + 18;
  }, 1000);
};
export const listFilter = (
  array: any[],
  searchKeys: any[],
  filterValue: string
) =>
  array.filter((item) =>
    searchKeys.some((el) =>
      item[el]
        .toString()
        .trim()
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    )
  );

export const base64StringSize = (base64Str: string) => {
  var stringLength = base64Str.split(',').pop().length;
  var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  var sizeInKb = sizeInBytes / 1000;
  return sizeInKb;
};

export const toArrayOfObj = (objOfObjs, id = 'id') =>
  Object.keys(objOfObjs).map((e) => {
    const obj = objOfObjs[e];
    obj[id] = e;
    return obj;
  });

export const arraySortAsc = (array: Array<any>, key: string) =>
  array.sort((a: any, b: any) => (a[key].toString().toLocaleUpperCase() < b[key].toString().toLocaleUpperCase() ? -1 : 1));
export const arrayDateSortAsc = (array: Array<any>, key: string) =>
  array.sort((a: any, b: any) => (a[key].toDate().toString().toLocaleUpperCase() < b[key].toDate().toString().toLocaleUpperCase() ? -1 : 1));


export const arraySortDesc = (array: Array<any>, key: string) =>
  array.sort((a: any, b: any) => (a[key].toString().toLocaleUpperCase() > b[key].toString().toLocaleUpperCase() ? -1 : 1));

export const allowedImageTypes = () => ['image/jpeg', 'image/x-png', 'image/png'];
export const allowedVideoTypes = () => ["video/mp4", "video/webm", "video/3gpp"];

export const isNullish = (obj) => Object.values(obj).some(x => {
  if (x === null || x === '') {
    return true
  }
  return false
});
