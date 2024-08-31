// Utils
import { CallableRequestV2, FirebaseAuth } from '../types/reference';
import utils from '../utils';
import { FirebaseUserDB } from '../utils/user';

type OptionalDailyGetterPayload = {
  date?: string; // Format YYYY-MM-DD
};

/**
 * Retrieves the user data based on the provided parameters.
 *
 * @param payload - The optional payload containing the date.
 * @param auth - The authentication object.
 * @returns - A promise that resolves to the user data.
 * @throws - Throws an exception if the user is not authenticated.
 */
const getUser = async ({ date }: OptionalDailyGetterPayload, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwExceptionV2('You are not authenticated V2', 'get user');
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
  return utils.user.serializeUser(utils.user.mergeUserData(uid, userData), date);
};

/**
 * Retrieves a user by their ID.
 *
 * @param userUid - The ID of the user to retrieve.
 * @param auth - The FirebaseAuth object for authentication.
 * @returns A Promise that resolves to the serialized user data.
 * @throws An exception if the user is not authenticated or if the user does not exist.
 */
const getUserById = async (userUid: string, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwExceptionV2('You are not authenticated V2', 'get user');
  }

  const userRef = utils.firestore.getUserRef();
  const user = await userRef.doc(userUid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    return utils.firebase.throwExceptionV2('User does not exist', 'get user');
  }

  const userData = user.data();
  return utils.user.serializeUser(utils.user.mergeUserData(userUid, userData));
};

/**
 * Retrieves the list of users.
 *
 * @param _ - Unused parameter.
 * @param auth - The FirebaseAuth object containing the user's authentication information.
 * @returns A Promise that resolves to an array of user documents.
 */
const getUsers = async (_: unknown, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwExceptionV2('You are not authenticated V2', 'get user');
  }

  const usersRef = utils.firestore.getUserRef();
  return (await usersRef.get()).docs;
};

/**
 * Updates the user in the Firebase database.
 *
 * @param data - The user data to update.
 * @param auth - The authentication information.
 * @returns A boolean indicating whether the update was successful.
 */
const updateUserDB = async (data: FirebaseUserDB, auth: FirebaseAuth) => {
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwExceptionV2('You are not authenticated V2', 'get user');
  }

  if (!data.id || !data.preferredLanguage) {
    return utils.firebase.throwExceptionV2('Payload is missing data', 'get user');
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
 * Executes the user engine function.
 *
 * @param request - The callable request object.
 * @returns The result of the user engine function.
 */
export const userEngine = (request: CallableRequestV2) =>
  utils.firebase.apiDelegatorV2(request, USER_API_ACTIONS);
