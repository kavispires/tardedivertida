// Types
import type { CallableRequest, FirebaseAuth } from '../types/reference';
// Constants
import { DATA_DOCUMENTS } from '../constants/collections';
// Services
import { updateFirestoreCommunityDataRecursively } from '../services/community-data';
import { delegateApiRequest, throwHttpsError } from '../services/firebase-core';
import {
  getDailyCollectionRef,
  getDataCollectionRef,
  getUserCollectionRef,
} from '../services/firestore-core';
// Utils
import { isEmulatingEnvironment } from '../utils/environment';
import { feedEmulatorDaily } from '../utils/mocks/emulator';

/**
 * Payload for retrieving daily challenge data
 */
type DailyGetterPayload = {
  /**
   * Date identifier in format YYYY-MM-DD
   */
  date: string;
  /**
   * The document name to retrieve
   */
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
    return throwHttpsError('User not authenticated', actionText);
  }

  const { date } = data;
  if (!date) {
    return throwHttpsError('Date not provided', actionText);
  }

  const dailyRef = getDailyCollectionRef(data.document);
  const dailyDoc = await dailyRef.doc(date).get();

  if (!dailyDoc.exists) {
    throwHttpsError(`Daily ${date} does not exist`, actionText);
  }

  const dailyData = dailyDoc.data();

  if (dailyData?.['arte-ruim']) {
    return dailyData;
  }

  return {
    'arte-ruim': dailyData,
  };
};

/**
 * Payload for saving daily challenge results
 */
export type DailySetterPayload = {
  /**
   * Date identifier in format YYYY-MM-DD
   */
  id: string;
  /**
   * The daily challenge number
   */
  number: number;
  /**
   * Whether the challenge was completed successfully
   */
  victory: boolean;
  /**
   * Number of hearts/lives remaining
   */
  hearts: number;
  /**
   * Array of letters used or collected
   */
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
    return throwHttpsError('User not authenticated', actionText);
  }

  const { id, number, victory, hearts, letters } = data;
  if (!id) {
    return throwHttpsError('Payload is missing data', actionText);
  }
  const userRef = getUserCollectionRef();

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

/**
 * Payload for saving drawing data to the community collection
 */
type DailySaveDrawingPayload = {
  /**
   * Drawing data to be saved
   */
  drawings: any;
  /**
   * Language of the drawings
   */
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
    return throwHttpsError('User not authenticated', actionText);
  }

  await updateFirestoreCommunityDataRecursively('drawings', data.language, data.drawings);

  return true;
};

/**
 * Payload for saving testimony answers and suspect relationships
 */
type DailySaveTestimoniesPayload = {
  /**
   * Array of testimony answers
   */
  answers: {
    /**
     * Unique identifier for the testimony
     */
    testimonyId: string;
    /**
     * Array of suspect IDs that are related to the testimony
     */
    related: string[];
    /**
     * Array of suspect IDs that are unrelated to the testimony
     */
    unrelated: string[];
  }[];
};

/**
 * Firestore testimony data structure mapping user IDs to stringified testimony data
 */
interface FirestoreTestimonyData {
  /**
   * User ID mapped to stringified testimony data
   */
  [key: string]: string;
}

/**
 * Parsed testimony data structure for aggregating suspect relationships
 */
interface FirestoreParsedTestimonyData {
  /**
   * Testimony ID mapped to suspect relationships
   */
  [key: string]: {
    /**
     * Suspect ID mapped to array of relationship scores
     */
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
    return throwHttpsError('User not authenticated', actionText);
  }

  try {
    const docRef = getDataCollectionRef().doc(DATA_DOCUMENTS.TESTIMONIES);
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
    throwHttpsError(error, actionText);
  }

  return true;
};

/**
 * Pair of related image IDs for connection challenges
 */
type RelatedPair = {
  /**
   * First image identifier
   */
  imageId1: string;
  /**
   * Second image identifier
   */
  imageId2: string;
};

/**
 * Payload for saving image connection relationships
 */
type DailySaveConexoesPayload = {
  /**
   * Array of related image pairs
   */
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
    return throwHttpsError('User not authenticated', actionText);
  }

  if (!data.pairs || !Array.isArray(data.pairs)) {
    return throwHttpsError('Pairs data is missing', actionText);
  }

  try {
    const docRef = getDataCollectionRef().doc(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS_DAILY);
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
    throwHttpsError(error, actionText);
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
export const dailyEngine = (request: CallableRequest) => delegateApiRequest(request, DAILY_API_ACTIONS);
