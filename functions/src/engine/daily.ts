import type { CallableRequest, FirebaseAuth } from '../types/reference';
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
  if (utils.firebase.isEmulatingEnvironment()) {
    await feedEmulatorDaily();
  }

  const actionText = 'get daily';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  const { date } = data;
  if (!date) {
    return utils.firebase.throwException('Date not provided', actionText);
  }

  const dailyRef = utils.firestore.getDailyRef(data.document);
  const dailyDoc = await dailyRef.doc(date).get();

  if (!dailyDoc.exists) {
    utils.firebase.throwException(`Daily ${date} does not exist`, actionText);
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
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  const { id, number, victory, hearts, letters } = data;
  if (!id) {
    return utils.firebase.throwException('Payload is missing data', actionText);
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
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  await dataUtils.updateDataCollectionRecursively('drawings', data.language, data.drawings);

  return true;
};

type DailySaveTestimoniesPayload = {
  answers: {
    testimonyId: string;
    related: string[];
    unrelated: string[];
  }[];
};

interface FirestoreTestimonyData {
  [key: string]: string;
}
interface FirestoreParsedTestimonyData {
  [key: string]: {
    [key: string]: number[];
  };
}

const saveTestimonies = async (data: DailySaveTestimoniesPayload, auth: FirebaseAuth) => {
  const actionText = 'save suspects';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  try {
    const docRef = utils.firestore.getDataRef().doc('testimonies');
    const doc = await docRef.get();
    const docData = doc.data() as FirestoreTestimonyData;
    const parsedData = Object.keys(docData).reduce((acc: FirestoreParsedTestimonyData, testimonyId) => {
      acc[testimonyId] = JSON.parse(docData[testimonyId]);
      return acc;
    }, {});

    // Parse each data
    data.answers.forEach((answer) => {
      const testimonyId = answer.testimonyId;
      if (!parsedData[testimonyId]) {
        parsedData[testimonyId] = {};
      }
      answer.related.forEach((suspectId) => {
        if (!parsedData[testimonyId][suspectId]) {
          parsedData[testimonyId][suspectId] = [];
        }
        parsedData[testimonyId][suspectId].push(1);
      });

      answer.unrelated.forEach((suspectId) => {
        if (!parsedData[testimonyId][suspectId]) {
          parsedData[testimonyId][suspectId] = [];
        }
        parsedData[testimonyId][suspectId].push(-1);
      });
    });

    const stringifiedData = Object.keys(parsedData).reduce((acc: FirestoreTestimonyData, testimonyId) => {
      acc[testimonyId] = JSON.stringify(parsedData[testimonyId]);
      return acc;
    }, {});

    await docRef.update(stringifiedData);
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }

  return true;
};

const DAILY_API_ACTIONS = {
  GET_DAILY: getDaily,
  SAVE_DAILY: saveDaily,
  SAVE_DRAWING: saveDrawing,
  SAVE_TESTIMONIES: saveTestimonies,
};

/**
 * Executes the daily engine.
 *
 * @param request - The CallableRequest object.
 */
export const dailyEngine = (request: CallableRequest) =>
  utils.firebase.apiDelegator(request, DAILY_API_ACTIONS);
