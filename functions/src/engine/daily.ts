import type { CallableRequest, FirebaseAuth } from '../types/reference';
import utils from '../utils';
import { feedEmulatorDaily } from '../utils/mocks/emulator';
import * as dataUtils from './collections';
import { apiDelegator } from '../utils/firebase';
import { DATA_DOCUMENTS } from '../utils/constants';
import { isEmulatingEnvironment } from '../utils/environment';

type DailyGetterPayload = {
  date: string; // Format YYYY-MM-DD
  document: string;
};

/**
 * Retrieves the daily data based on the provided parameters
 * @param data - The payload containing the date and document name
 * @param auth - The Firebase authentication object
 */
const getDaily = async (data: DailyGetterPayload, auth: FirebaseAuth) => {
  if (isEmulatingEnvironment()) {
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
 * Saves the daily data for a user
 * @param data - The daily data to be saved
 * @param auth - The Firebase authentication object
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
 * Saves the drawing data to the drawings collection
 * @param data - The payload containing the drawings and language
 * @param auth - The Firebase authentication object
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
  [key: string]: string; // userId -> stringified data
}
interface FirestoreParsedTestimonyData {
  [key: string]: {
    [key: string]: number[];
  };
}

/**
 * Saves testimony answers by aggregating related and unrelated suspect relationships
 * @param data - The payload containing testimony answers
 * @param auth - The Firebase authentication object
 */
const saveTestimonies = async (data: DailySaveTestimoniesPayload, auth: FirebaseAuth) => {
  const actionText = 'save suspects';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  try {
    const docRef = utils.firestore.getDataRef().doc(DATA_DOCUMENTS.TESTIMONIES);
    const doc = await docRef.get();
    const docData = doc.data() as FirestoreTestimonyData;
    const previousUserData = JSON.parse(docData?.[uid] || '{}') as FirestoreTestimonyData;

    const aggregatedUserData = Object.keys(previousUserData).reduce(
      (acc: FirestoreParsedTestimonyData, testimonyId) => {
        acc[testimonyId] = JSON.parse(previousUserData[testimonyId]);
        return acc;
      },
      {},
    );

    // Parse each data
    data.answers.forEach((answer) => {
      const testimonyId = answer.testimonyId;
      if (!aggregatedUserData[testimonyId]) {
        aggregatedUserData[testimonyId] = {};
      }
      answer.related.forEach((suspectId) => {
        if (!aggregatedUserData[testimonyId][suspectId]) {
          aggregatedUserData[testimonyId][suspectId] = [];
        }
        aggregatedUserData[testimonyId][suspectId].push(1);
      });

      answer.unrelated.forEach((suspectId) => {
        if (!aggregatedUserData[testimonyId][suspectId]) {
          aggregatedUserData[testimonyId][suspectId] = [];
        }
        aggregatedUserData[testimonyId][suspectId].push(-1);
      });
    });

    const stringifiedData = Object.keys(aggregatedUserData).reduce(
      (acc: FirestoreTestimonyData, testimonyId) => {
        acc[testimonyId] = JSON.stringify(aggregatedUserData[testimonyId]);
        return acc;
      },
      {},
    );

    await docRef.update({ [uid]: JSON.stringify(stringifiedData) });
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }

  return true;
};

type RelatedPair = {
  imageId1: string;
  imageId2: string;
};

type DailySaveConexoesPayload = {
  pairs: RelatedPair[];
};

/**
 * Saves image connections and relationships data with bidirectional mapping
 * @param data - The payload containing image pairs
 * @param auth - The Firebase authentication object
 */
const saveConexoes = async (data: DailySaveConexoesPayload, auth: FirebaseAuth) => {
  const actionText = 'save conexoes';
  const uid = auth?.uid;

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', actionText);
  }

  if (!data.pairs || !Array.isArray(data.pairs)) {
    return utils.firebase.throwException('Pairs data is missing', actionText);
  }

  try {
    const docRef = utils.firestore.getDataRef().doc(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS_DAILY);
    const doc = await docRef.get();
    const docData = (doc.data() as Record<string, string>) || {};

    // Parse existing user data
    const previousUserData = JSON.parse(docData?.[uid] || '{}') as Record<string, string[]>;

    // Merge new relationships with existing ones
    const mergedRelationships: Record<string, string[]> = { ...previousUserData };

    // Helper function to add bidirectional relationship
    const addRelationship = (id1: string, id2: string) => {
      // Add id2 to id1's array
      if (!mergedRelationships[id1]) {
        mergedRelationships[id1] = [];
      }
      if (!mergedRelationships[id1].includes(id2)) {
        mergedRelationships[id1].push(id2);
      }

      // Add id1 to id2's array (bidirectional)
      if (!mergedRelationships[id2]) {
        mergedRelationships[id2] = [];
      }
      if (!mergedRelationships[id2].includes(id1)) {
        mergedRelationships[id2].push(id1);
      }
    };

    // Process each pair and create bidirectional relationships
    for (const pair of data.pairs) {
      addRelationship(pair.imageId1, pair.imageId2);
    }

    // Save back to Firestore
    await docRef.update({ [uid]: JSON.stringify(mergedRelationships) });
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
  SAVE_CONEXOES: saveConexoes,
};

/**
 * Executes the daily engine by delegating to the appropriate action
 * @param request - The callable request object
 */
export const dailyEngine = (request: CallableRequest) => apiDelegator(request, DAILY_API_ACTIONS);
