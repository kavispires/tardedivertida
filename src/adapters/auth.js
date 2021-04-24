import { auth } from '../services/firebase';

/**
 * Sign up user via email through firebase auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export function signUp(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

/**
 * Sign in user via email through firebase auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
export function signIn(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

/**
 * Sign out current user
 * @returns {Promise}
 */
export async function signOut() {
  return auth()
    .signOut()
    .then(() => {
      alert(`You've been signed out`);
    });
}
