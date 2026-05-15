// Utils
import type { CallableRequest, FirebaseAuth } from '../types/reference';
import utils from '../utils';
import type { FirebaseUserDB } from '../utils/user';
import { apiDelegator } from '../utils/firebase';

/**
 * Retrieves the user data based on the provided parameters
 * @param _ - Unused parameter
 * @param auth - The Firebase authentication object
 */
const getUser = async (_: unknown, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('You are not authenticated', 'get user');
  }

  const userRef = utils.firestore.getUserRef();
  const user = await userRef.doc(uid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    const newUser = utils.user.generateNewUser(uid, auth?.token?.provider_id === 'anonymous');
    await userRef.doc(uid).set(newUser);

    return utils.user.serializeUser(newUser);
  }

  const userData = user.data();
  return utils.user.serializeUser(utils.user.mergeUserData(uid, userData));
};

/**
 * Retrieves a user by their ID
 * @param userUid - The ID of the user to retrieve
 * @param auth - The Firebase authentication object
 */
const getUserById = async (userUid: string, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('You are not authenticated', 'getUserById');
  }

  const userRef = utils.firestore.getUserRef();
  const user = await userRef.doc(userUid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    return utils.firebase.throwException('User does not exist', 'getUserById');
  }

  const userData = user.data();
  return utils.user.serializeUser(utils.user.mergeUserData(userUid, userData));
};

/**
 * Retrieves the list of users
 * @param _ - Unused parameter
 * @param auth - The Firebase authentication object
 */
const getUsers = async (_: unknown, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('You are not authenticated', 'getUsers');
  }

  const usersRef = utils.firestore.getUserRef();
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
    return utils.firebase.throwException('You are not authenticated', 'updateUserDB');
  }

  if (!data.id || !data.preferredLanguage) {
    return utils.firebase.throwException('Payload is missing data', 'updateUserDB');
  }

  const userRef = utils.firestore.getUserRef();
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
export const userEngine = (request: CallableRequest) => apiDelegator(request, USER_API_ACTIONS);
