import utils from '../utils';
import { DATA_DOCUMENTS } from '../utils/constants';
import { PastCategories } from './onda-telepatica/types';

/**
 * Gets document from data in firestore
 * @param documentName
 * @param fallback
 * @returns
 */
export const getDataFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response: any;

  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    return fallback;
  }

  try {
    response = (await utils.firebase.getDataRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Saves data to data in firestore
 * @param documentName
 * @param data
 * @returns
 */
export const updateDataFirebaseDoc = async (documentName: string, data: any): Promise<boolean> => {
  const expectedType = Array.isArray(data) ? 'array' : typeof data;

  const defaultCurrentData =
    {
      object: {},
      array: [],
      string: '',
      number: 0,
      boolean: false,
    }?.[expectedType] ?? {};

  const currentData = await getDataFirebaseDocData(documentName, defaultCurrentData);

  let newData: any = null;
  switch (expectedType) {
    case 'array':
    case 'object':
      newData = utils.game.merge(currentData, data);
      break;
    default:
      newData = currentData;
  }

  if (newData) {
    await utils.firebase.getDataRef().doc(documentName).update(newData);
  }

  return true;
};

export const updateDataCollectionRecursively = async (
  prefix: 'drawings' | 'monsterDrawings',
  language: Language,
  data: any
): Promise<boolean> => {
  // Get suffix counts
  const suffixCounts = await getDataFirebaseDocData('suffixCounts', { drawings: 0, monsterDrawings: 0 });
  const documentPrefix = `${prefix}${language.toUpperCase()}`;

  let tries = 0;

  while (tries < 5) {
    const suffix = suffixCounts[prefix] + tries;
    const documentFullName = `${documentPrefix}${suffix}`;

    try {
      const docRef = utils.firebase.getDataRef().doc(documentFullName);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update(data);
      } else {
        await docRef.set(data);
      }
      await utils.firebase
        .getDataRef()
        .doc('suffixCounts')
        .update({ [prefix]: suffix });
      return true;
    } catch (error) {
      tries++;
      console.error(`Error updating document '${prefix}' (attempt ${tries}): ${error}`);
    }
  }

  return true;
};

export const updateCardDataCollection = async (
  type: 'cards' | 'imageCards',
  language: Language,
  data: Record<CardId | ImageCardId, string[]>
): Promise<boolean> => {
  const documentName = `${type}Clues${language.toUpperCase()}`;

  // Get currentDoc
  const docRef = utils.firebase.getDataRef().doc(documentName);
  const doc = await docRef.get();
  if (doc.exists) {
    const currentData = doc.data() ?? {};
    // Merge data
    Object.entries(data).forEach(([cardId, clues]) => {
      if (currentData[cardId]) {
        currentData[cardId] = [...currentData[cardId], ...clues];
      } else {
        currentData[cardId] = clues;
      }
    });

    await docRef.update(currentData);
  }

  return true;
};

type OpposingIdeaClue = Record<CardId, Record<string | number, any>>;

// TODO: Delete after its run once
export const updateOpposingIdeasClues = async (pastCategories: PastCategories) => {
  const previouslySavedCategories: OpposingIdeaClue = await getDataFirebaseDocData(
    DATA_DOCUMENTS.OPPOSING_IDEAS_CLUES
  );

  Object.keys(previouslySavedCategories).forEach((cardId) => {
    Object.keys(previouslySavedCategories[cardId]).forEach((target) => {
      if (!Array.isArray(previouslySavedCategories[cardId][target]))
        previouslySavedCategories[cardId][target] = [previouslySavedCategories[cardId][target]];
    });
  });

  pastCategories.forEach((entry) => {
    const target = String(entry.target ?? 11);

    if (previouslySavedCategories[entry.id] === undefined) {
      previouslySavedCategories[entry.id] = {};
    }

    if (previouslySavedCategories[entry.id][target] === undefined) {
      previouslySavedCategories[entry.id][target] = [];
    }
    if (entry.clue && Array.isArray(previouslySavedCategories[entry.id][target])) {
      previouslySavedCategories[entry.id][target].push(entry.clue);
    }
  });

  await utils.firebase.getDataRef().doc(DATA_DOCUMENTS.OPPOSING_IDEAS_CLUES).set(previouslySavedCategories);
};
