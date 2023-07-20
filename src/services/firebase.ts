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
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';
// Ant Design Resources
import { message, notification } from 'antd';
// Hooks
import { setGlobalState } from 'hooks/useGlobalState';
import { USE_FIRESTORE_EMULATOR, USE_FUNCTIONS_EMULATOR } from 'dev-configs';

const buildKey = () => {
  return [
    process.env.REACT_APP_FIREBASE_A,
    process.env.REACT_APP_FIREBASE_P,
    process.env.REACT_APP_FIREBASE_I,
  ].join('');
};

const firebaseConfig = {
  apiKey: buildKey(),
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

// const localHost = process.env.REACT_APP_LOCAL_IP || 'localhost';
const localHost = 'localhost';

if (window.location.hostname.includes(localHost)) {
  if (USE_FIRESTORE_EMULATOR) {
    console.log(`%cEmulating firestore to ${localHost}`, 'color:dodgerblue');
    notification.warning({ message: `Emulating firestore to ${localHost}`, placement: 'bottomLeft' });
    connectFirestoreEmulator(firestore, localHost, 8091);
    setGlobalState('usingFirestoreEmulator', localHost);
  }
  if (USE_FUNCTIONS_EMULATOR) {
    console.log(`%cEmulating functions to ${localHost}`, 'color:cyan');
    notification.warning({ message: `Emulating functions to ${localHost}`, placement: 'bottomLeft' });
    connectFunctionsEmulator(functions, localHost, 5003);
    connectFunctionsEmulator(functions, 'localhost', 5003);
    setGlobalState('usingFunctionsEmulator', localHost);
  }
}

export default firebaseApp;

/**
 * Sign up user via email through firebase auth
 * @param email - the email of the user to sign up
 * @param password - the password of the user to sign up
 * @returns - the user credential
 */
export function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in user via email through firebase auth
 * @param email - the email of the user to sign in
 * @param password - the password of the user to sign in
 * @returns - the user credential
 */
export function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in user anonymously as a guest
 * @returns - the user credential
 */
export function signInAsGuest(): Promise<UserCredential> {
  return signInAnonymously(auth);
}

/**
 * Sign out current user
 * @returns - a promise that resolves when the user is signed out
 */
export async function signOut(): Promise<void> {
  return auth.signOut().then(() => {
    message.warning(`You've been signed out`);
  });
}

/**
 * Sends a password reset email to the user
 * @param email - the email of the user to reset
 * @returns - a promise that resolves when the email is sent
 */
export function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Sign in user via email through firebase auth
 * @param email - the email of the user to convert
 * @param password - the password of the user to convert
 * @returns - the user credential
 */
export function convertGuestoToUser(email: string, password: string): Promise<UserCredential> {
  return linkWithCredential(auth.currentUser!, EmailAuthProvider.credential(email, password));
}

/**
 * Get the firebase url for a game
 * @param usingEmulators - whether or not to use emulators
 * @param gameCollection - the game collection
 * @param gameId - the game id
 * @returns - the firebase url
 */
export const getFirebaseUrl = (usingEmulators: boolean, gameCollection: GameName, gameId: GameId) => {
  return usingEmulators
    ? `http://localhost:4000/firestore/data/games/${gameCollection}/${gameId}/state`
    : `${process.env.REACT_APP_FIREBASE_URL}/~2Fgames~2F${gameCollection}~2F${gameId}~2Fstate`;
};
