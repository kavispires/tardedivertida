import { message } from 'antd';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from 'services/firebase';

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
