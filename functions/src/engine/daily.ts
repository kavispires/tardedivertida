import utils from '../utils';
import { feedEmulatorDaily } from '../utils/mocks/emulator';

type DailyGetterPayload = {
  date: string; // Format YYYY-MM-DD
};

/**
 * Gets today's daily entry
 * @param data - Payload including the date
 * @param context
 * @returns
 */
const getDaily = async (data: DailyGetterPayload, context: FirebaseContext) => {
  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    feedEmulatorDaily();
  }

  const actionText = 'get daily';
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  const { date } = data;
  if (!date) {
    return utils.firebase.throwException('Date not provided', actionText);
  }

  const dailyRef = utils.firebase.getDailyRef();
  const dailyDoc = await dailyRef.doc(date).get();

  if (!dailyDoc.exists) {
    utils.firebase.throwException(`Daily ${date} does not exist`, actionText);
  }

  const dailyData = dailyDoc.data();
  return dailyData;
};

export type DailySetterPayload = {
  id: string; // Format YYYY-MM-DD
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

// Save today to user
const saveDaily = async (data: DailySetterPayload, context: FirebaseContext) => {
  const actionText = 'save daily';
  const uid = context?.auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  const { id, number, victory, hearts, letters } = data;
  if (!id) {
    return utils.firebase.throwException('Payload is missing data', actionText);
  }
  const userRef = utils.firebase.getUserRef();

  let isError = false;

  try {
    await userRef.doc(uid).update({ [`daily.${id}`]: { id, number, victory, hearts, letters } });
  } catch (_) {
    isError = true;
  }

  // Error: possibly because the daily object does not exist
  if (isError) {
    try {
      await userRef.doc(id).update({
        daily: {
          [id]: { id, number, victory, hearts, letters },
        },
      });
      isError = false;
    } catch (_) {
      isError = true;
    }
  }

  // Error: possibly because the user does not exist
  if (isError) {
    const userRef = utils.firebase.getUserRef();
    const user = await userRef.doc(uid).get();

    // If the user object doesn't exist, just create one
    if (!user.exists) {
      const newUser = utils.user.generateNewUser(uid, context?.auth?.token?.provider_id === 'anonymous');
      await userRef.doc(uid).set(newUser);

      // Add daily
      newUser.daily = { [id]: { id, number, victory, hearts, letters } };
      return utils.user.serializeUser(newUser, id);
    }
  }

  return true;
};

const DAILY_API_ACTIONS = {
  GET_DAILY: getDaily,
  SAVE_DAILY: saveDaily,
};

export const dailyApi = utils.firebase.apiDelegator('daily api', DAILY_API_ACTIONS);
