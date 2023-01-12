import * as firebase from 'firebase/app';
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { collection, CollectionReference, doc, DocumentData, DocumentReference, getFirestore } from 'firebase/firestore';

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_GOOGLE_PRJ_ID,
  appId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_GOOGLE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_GOOGLE_MSG_SENDER_ID,
};

const firebaseApp = firebase.getApps().length
  ? firebase.getApp('nqhuy-apps')
  : initializeApp(config, 'nqhuy-apps');

// Firebase - Authenticate
export const firebaseAuth = getAuth(firebaseApp);
// Firebase - Firestore
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseDoc = (path: string, ...pathSegments: string[]): DocumentReference<DocumentData> => doc(firebaseFirestore, path, ...pathSegments);
export const firebaseColl = (path: string, ...pathSegments: string[]): CollectionReference<DocumentData> => collection(firebaseFirestore, path, ...pathSegments);

export default firebaseApp;