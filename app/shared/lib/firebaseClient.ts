import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
}

export const auth = getAuth(getApp());
export const storage = getStorage();

export const db = getFirestore(getApp());
export function genericConverter<T>() {
  return {
    toFirestore(data: T): T {
      return data;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot<T>,
      options: SnapshotOptions,
    ) {
      return snapshot.data(options);
    },
  };
}
