import { Injectable } from '@angular/core';
import { environment as env, app } from '@env/environment';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore, collection, getDocs, Firestore, DocumentData } from 'firebase/firestore';
import { getAuth, Auth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, TaskState, TaskEvent, FirebaseStorage } from 'firebase/storage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore(app);
  private appAuth = getAuth(app);
  private firebaseStorage = getStorage(app);
  taskState: TaskState;

  constructor() { }

  get auth(): Auth {
    return this.appAuth;
  }

  get storage(): FirebaseStorage {
    return this.firebaseStorage;
  }

  get database(): Firestore {
    return this.db;
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }
  checkAuthState() {
    return from(
      new Promise((resolve, reject) => {
        const unsubscribe = this.auth.onAuthStateChanged((user) => {
          console.log("user ");
          console.log(user);
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
          unsubscribe();
        });
      })
    );
  }

  getCollection(collectionName: string, orderBy = null) {
    return orderBy ?
      from(getDocs(collection(this.database, collectionName))) :
      from(getDocs(collection(this.database, collectionName)));
  }
}

export const snapshotToArray = (snapshot) => {
  let returnArr: any = [];
  snapshot.forEach((childSnapshot) => {
    let item = childSnapshot.data();
    item.id = childSnapshot.id;
    returnArr.push(item);
  });

  return returnArr;
};
export const snapshot = (doc: DocumentData) => {
  let returnDoc: any = {};
  if (doc.exists) {
    returnDoc = doc.data();
    returnDoc.id = doc.id;
  }
  return returnDoc;
};

