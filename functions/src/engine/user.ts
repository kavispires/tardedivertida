// Utils
import utils from '../utils';
import { FirebaseUserDB } from '../utils/user';

type OptionalDailyGetterPayload = {
  date?: string; // Format YYYY-MM-DD
};

/**
 * Gets the current user
 * @param _
 * @param context
 * @returns
 */
const getUser = async ({ date }: OptionalDailyGetterPayload, context: FirebaseContext) => {
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', 'get user');
  }

  const userRef = utils.firebase.getUserRef();
  const user = await userRef.doc(uid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    const newUser = utils.user.generateNewUser(uid, context?.auth?.token?.provider_id === 'anonymous');
    await userRef.doc(uid).set(newUser);

    return utils.user.serializeUser(newUser);
  }

  const userData = user.data();
  return utils.user.serializeUser(utils.user.mergeUserData(uid, userData), date);
};

/**
 * Get user by id
 * @param userUid
 * @param context
 * @returns
 */
const getUserById = async (userUid: string, context: FirebaseContext) => {
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('You are not authenticated', 'get user');
  }

  const userRef = utils.firebase.getUserRef();
  const user = await userRef.doc(userUid).get();

  // If the user object doesn't exist, just create one
  if (!user.exists) {
    return utils.firebase.throwException('User does not exist', 'get user');
  }

  const userData = user.data();
  return utils.user.serializeUser(utils.user.mergeUserData(userUid, userData));
};

/**
 * Gets all users
 * @param _
 * @param context
 * @returns
 */
const getUsers = async (_: unknown, context: FirebaseContext) => {
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', 'get users');
  }

  const usersRef = utils.firebase.getUserRef();
  return (await usersRef.get()).docs;
};

/**
 * Update a user with DB data
 * @param data
 * @param context
 * @returns
 */
const updateUserDB = async (data: FirebaseUserDB, context: FirebaseContext) => {
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', 'get user');
  }

  if (!data.id || !data.preferredLanguage) {
    return utils.firebase.throwException('Payload is missing data', 'get user');
  }

  const userRef = utils.firebase.getUserRef();
  await userRef.doc(data.id).update({ ...data });

  return true;
};

const USER_API_ACTIONS = {
  GET_USER: getUser,
  GET_USER_BY_ID: getUserById,
  GET_USERS: getUsers,
  UPDATE_USER_DB: updateUserDB,
};

export const userApi = utils.firebase.apiDelegator('user api', USER_API_ACTIONS);
