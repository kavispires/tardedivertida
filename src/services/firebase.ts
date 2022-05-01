import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';
import { message } from 'antd';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_API_ID,
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// firebase.analytics();

export const auth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);
export const functions: Functions = getFunctions(firebaseApp);

const localHost = process.env.REACT_APP_LOCAL_IP || 'localhost';

if (window.location.hostname.includes(localHost)) {
  console.log(`%cEmulating to${localHost}`, 'color:dodgerblue');
  connectFirestoreEmulator(firestore, localHost, 8091);
  connectFunctionsEmulator(functions, localHost, 5001);
}

export default firebaseApp;

/**
 * Sign up user via email through firebase auth
 * @param email
 * @param password
 * @returns
 */
export function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in user via email through firebase auth
 * @param email
 * @param password
 * @returns
 */
export function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 * @returns
 */
export async function signOut(): Promise<void> {
  return auth.signOut().then(() => {
    message.warn(`You've been signed out`);
  });
}
