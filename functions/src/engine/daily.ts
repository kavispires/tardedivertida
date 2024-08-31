import { CallableRequestV2, FirebaseAuth } from '../types/reference';
import utils from '../utils';
import { feedEmulatorDaily } from '../utils/mocks/emulator';
import * as dataUtils from './collections';

type DailyGetterPayload = {
  date: string; // Format YYYY-MM-DD
  document: string;
};

/**
 * Retrieves the daily data based on the provided parameters.
 *
 * @param data - The payload containing the necessary data for retrieving the daily data.
 * @param auth - The authentication object containing the user's information.
 * @returns The daily data object.
 * @throws An exception if the user is not authenticated or if the daily data does not exist.
 */
const getDaily = async (data: DailyGetterPayload, auth: FirebaseAuth) => {
  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    await feedEmulatorDaily();
  }

  const actionText = 'get daily';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firestore.throwException('User not authenticated', actionText);
  }

  const { date } = data;
  if (!date) {
    return utils.firestore.throwException('Date not provided', actionText);
  }

  const dailyRef = utils.firestore.getDailyRef(data.document);
  const dailyDoc = await dailyRef.doc(date).get();

  if (!dailyDoc.exists) {
    utils.firestore.throwException(`Daily ${date} does not exist`, actionText);
  }

  const dailyData = dailyDoc.data();

  if (dailyData?.['arte-ruim']) {
    return dailyData;
  }

  return {
    'arte-ruim': dailyData,
  };
};

export type DailySetterPayload = {
  id: string; // Format YYYY-MM-DD
  number: number;
  victory: boolean;
  hearts: number;
  letters: string[];
};

/**
 * Saves the daily data for a user.
 *
 * @param data - The daily data to be saved.
 * @param auth - The authentication information of the user.
 * @returns A boolean indicating whether the save operation was successful.
 */
const saveDaily = async (data: DailySetterPayload, auth: FirebaseAuth) => {
  const actionText = 'save daily';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firestore.throwException('User not authenticated', actionText);
  }

  const { id, number, victory, hearts, letters } = data;
  if (!id) {
    return utils.firestore.throwException('Payload is missing data', actionText);
  }
  const userRef = utils.firestore.getUserRef();

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
    const userRef = utils.firestore.getUserRef();
    const user = await userRef.doc(uid).get();

    // If the user object doesn't exist, just create one
    if (!user.exists) {
      const newUser = utils.user.generateNewUser(uid, auth?.token?.provider_id === 'anonymous');
      await userRef.doc(uid).set(newUser);

      // Add daily
      newUser.daily = { [id]: { id, number, victory, hearts, letters } };
      return utils.user.serializeUser(newUser, id);
    }
  }

  return true;
};

type DailySaveDrawingPayload = {
  drawings: any;
  language: Language;
};

/**
 * Saves the drawing data to the 'drawings' collection.
 *
 * @param data - The payload containing the drawing data.
 * @param auth - The authentication object.
 * @returns A boolean indicating whether the saving was successful.
 */
const saveDrawing = async (data: DailySaveDrawingPayload, auth: FirebaseAuth) => {
  const actionText = 'save drawings';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firestore.throwException('User not authenticated', actionText);
  }

  await dataUtils.updateDataCollectionRecursively('drawings', data.language, data.drawings);

  return true;
};

const DAILY_API_ACTIONS = {
  GET_DAILY: getDaily,
  SAVE_DAILY: saveDaily,
  SAVE_DRAWING: saveDrawing,
};

/**
 * Executes the daily engine.
 *
 * @param request - The CallableRequestV2 object.
 */
export const dailyEngine = (request: CallableRequestV2) =>
  utils.firebase.apiDelegatorV2(request, DAILY_API_ACTIONS);
