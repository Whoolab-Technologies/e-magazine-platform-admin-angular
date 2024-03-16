import { Injectable } from '@angular/core';
import { environment as env, app } from '@env/environment';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import { getFirestore, collection, getDocs, Firestore, DocumentData, query, orderBy, doc, setDoc, addDoc, getDoc, deleteDoc, OrderByDirection, QueryConstraint, where, WhereFilterOp } from 'firebase/firestore';
import { getAuth, Auth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { getStorage, TaskState, TaskEvent, FirebaseStorage } from 'firebase/storage';
import { Observable, from } from 'rxjs';

export interface Where {
  key: string,
  val: any,
  op?: WhereFilterOp

}

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

  getCollection(collectionName: string, condition: Where[] = [], orderByField = null, drtn: OrderByDirection = 'asc') {
    const ref = collection(this.database, collectionName)
    let queryConstraints: QueryConstraint[] = [];
    queryConstraints = condition.map(el => where(el.key, el.op, el.val));

    if (orderByField) {
      queryConstraints.push(orderBy(orderByField, drtn));
    }
    orderByField ? query(ref,) : ref;
    const docQuery = query(ref, ...queryConstraints);
    return from(getDocs(docQuery))
  }

  setDoc(collection, data, options: any = {}): Observable<any> {
    const docRef = doc(this.database, collection)
    return from(setDoc(docRef, data, options,));
  }
  addDocument(colltn, data): Observable<any> {
    const colRef = collection(this.database, colltn)
    return from(addDoc(colRef, data));
  }

  getDocument(colltn, docId) {
    const docRef = doc(this.database, colltn, docId);
    return from(getDoc(docRef));
  }

  removeDocument(colltn, docId) {
    const docRef = doc(this.database, colltn, docId);
    return from(deleteDoc(docRef));
  }

  signInWithEmailPassword(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }
  forgotPassword(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  updatePassword(password) {
    return from(updatePassword(this.auth.currentUser, password));
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
export const snapshotToObj = (snapshot) => {
  let returnObj: any = {};
  snapshot.forEach((childSnapshot) => {
    returnObj[childSnapshot.id] = childSnapshot.data();
  });

  return returnObj;
};

export const snapshot = (doc: DocumentData) => {
  let returnDoc: any = {};
  if (doc.exists()) {
    returnDoc = doc.data();
    returnDoc.id = doc.id;
  }
  return returnDoc;
};

