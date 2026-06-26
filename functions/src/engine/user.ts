// Types
import type { FirebaseUserDB } from '../services/user';
import type { CallableRequest, FirebaseAuth } from '../types/reference';
// Services
import { delegateApiRequest, throwHttpsError } from '../services/firebase-core';
import { getUserCollectionRef } from '../services/firestore-core';
import { generateNewUser, mergeUserData, serializeUser } from '../services/user';

/**
 * Retrieves the user data based on the provided parameters
 * @param _ - Unused parameter
 * @param auth - The Firebase authentication object
 */
const getUser = async (_: unknown, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return throwHttpsError('You are not authenticated', 'get user');
  }

  const userRef = getUserCollectionRef();
  const user = await userRef.doc(uid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    const newUser = generateNewUser(uid, auth?.token?.provider_id === 'anonymous');
    await userRef.doc(uid).set(newUser);

    return serializeUser(newUser);
  }

  const userData = user.data();
  return serializeUser(mergeUserData(uid, userData));
};

/**
 * Retrieves a user by their ID
 * @param userUid - The ID of the user to retrieve
 * @param auth - The Firebase authentication object
 */
const getUserById = async (userUid: string, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return throwHttpsError('You are not authenticated', 'getUserById');
  }

  const userRef = getUserCollectionRef();
  const user = await userRef.doc(userUid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    return throwHttpsError('User does not exist', 'getUserById');
  }

  const userData = user.data();
  return serializeUser(mergeUserData(userUid, userData));
};

/**
 * Retrieves the list of users
 * @param _ - Unused parameter
 * @param auth - The Firebase authentication object
 */
const getUsers = async (_: unknown, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return throwHttpsError('You are not authenticated', 'getUsers');
  }

  const usersRef = getUserCollectionRef();
  return (await usersRef.get()).docs;
};

/**
 * Updates the user in the Firebase database
 * @param data - The user data to update
 * @param auth - The Firebase authentication object
 */
const updateUserDB = async (data: FirebaseUserDB, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return throwHttpsError('You are not authenticated', 'updateUserDB');
  }

  if (!data.id || !data.preferredLanguage) {
    return throwHttpsError('Payload is missing data', 'updateUserDB');
  }

  const userRef = getUserCollectionRef();
  await userRef.doc(data.id).update({ ...data });

  return true;
};

const USER_API_ACTIONS = {
  GET_USER: getUser,
  GET_USER_BY_ID: getUserById,
  GET_USERS: getUsers,
  UPDATE_USER_DB: updateUserDB,
};

/**
 * Executes the user engine function by delegating to the appropriate action
 * @param request - The callable request object
 */
export const userEngine = (request: CallableRequest) => delegateApiRequest(request, USER_API_ACTIONS);
