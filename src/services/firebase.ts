import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';
// Ant Design Resources
import { message, notification } from 'antd';
// Hooks
import { setGlobalState } from 'hooks/useGlobalState';

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
// const localHost = 'localhost';

if (window.location.hostname.includes(localHost)) {
  console.log(`%cEmulating to ${localHost}`, 'color:dodgerblue');
  notification.warning({ message: `Emulating to ${localHost}`, placement: 'bottomLeft' });
  connectFirestoreEmulator(firestore, localHost, 8091);
  connectFirestoreEmulator(firestore, 'localhost', 8091);
  setGlobalState('usingFirestoreEmulator', localHost);
  connectFunctionsEmulator(functions, localHost, 5003);
  connectFunctionsEmulator(functions, 'localhost', 5003);
  setGlobalState('usingFunctionsEmulator', localHost);
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
 * Signs in user anonymously as a guest
 * @returns
 */
export function signInAsGuest(): Promise<UserCredential> {
  return signInAnonymously(auth);
}

/**
 * Sign out current user
 * @returns
 */
export async function signOut(): Promise<void> {
  return auth.signOut().then(() => {
    message.warning(`You've been signed out`);
  });
}

/**
 * Sign in user via email through firebase auth
 * @param email
 * @param password
 * @returns
 */
export function convertGuestoToUser(email: string, password: string): Promise<UserCredential> {
  return linkWithCredential(auth.currentUser!, EmailAuthProvider.credential(email, password));
}

export const getFirebaseUrl = (usingEmulators: boolean, gameCollection: GameName, gameId: GameId) => {
  return usingEmulators
    ? `http://localhost:4000/firestore/data/games/${gameCollection}/${gameId}/state`
    : `${process.env.REACT_APP_FIREBASE_URL}/~2Fgames~2F${gameCollection}~2F${gameId}~2Fstate`;
};
