import utils from '../utils';
import { DATA_DOCUMENTS } from '../utils/constants';
import type { PastCategories } from './onda-telepatica/types';

/**
 * Gets document from data in firestore
 * @param documentName
 * @param fallback
 * @returns
 */
export const getDataFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response: any;

  if (utils.firebase.isEmulatingEnvironment()) {
    return fallback;
  }

  try {
    response = (await utils.firestore.getDataRef().doc(documentName)?.get())?.data() ?? fallback;
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
    await utils.firestore.getDataRef().doc(documentName).update(newData);
  }

  return true;
};

export const updateDataCollectionRecursively = async (
  prefix: 'drawings' | 'monsterDrawings',
  language: Language,
  data: any,
): Promise<boolean> => {
  // Get suffix counts
  const documentPrefix = prefix === 'drawings' ? `${prefix}${language.toUpperCase()}` : `${prefix}`;
  const suffixCounts = await getDataFirebaseDocData('suffixCounts', { [documentPrefix]: 1 });

  let tries = 0;

  while (tries < 5) {
    const suffix = suffixCounts[documentPrefix] + tries;
    const documentFullName = `${documentPrefix}${suffix}`;

    try {
      const docRef = utils.firestore.getDataRef().doc(documentFullName);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update(data);
      } else {
        await docRef.set(data);
      }
      await utils.firestore
        .getDataRef()
        .doc('suffixCounts')
        .update({ [documentPrefix]: suffix });
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
  data: Record<CardId | ImageCardId, string[]>,
): Promise<boolean> => {
  const documentName = `${type}Clues${language.toUpperCase()}`;

  // Get currentDoc
  const docRef = utils.firestore.getDataRef().doc(documentName);
  const doc = await docRef.get();
  if (doc.exists) {
    const currentData = doc.data() ?? {};
    // Merge data
    Object.entries(data).forEach(([cardId, clues]) => {
      if (currentData[cardId]) {
        currentData[cardId] = utils.game.removeDuplicates([...currentData[cardId], ...clues]);
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
    DATA_DOCUMENTS.OPPOSING_IDEAS_CLUES,
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

  await utils.firestore
    .getDataRef()
    .doc(DATA_DOCUMENTS.OPPOSING_IDEAS_CLUES)
    .update(previouslySavedCategories);
};

export const updateImageCardsRelationships = async (relationships: ImageCardRelationship) => {
  const previouslySavedRelationships: ImageCardRelationship = await getDataFirebaseDocData(
    DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS,
  );

  const parsedRelationships: ImageCardRelationship = {};

  // Add each card id as a key to the parsed object with an empty array value
  transpileRelationships(previouslySavedRelationships, parsedRelationships);
  transpileRelationships(relationships, parsedRelationships);

  // Remove duplicates
  Object.entries(parsedRelationships).forEach(([key, relatedIds]) => {
    parsedRelationships[key] = utils.game.removeDuplicates(relatedIds);
  });

  // Save
  await utils.firestore
    .getDataRef()
    .doc(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS)
    .update(parsedRelationships);
};

function transpileRelationships(source: ImageCardRelationship, result: ImageCardRelationship) {
  Object.entries(source).forEach(([cardId, relatedIds]) => {
    if (result[cardId] === undefined) {
      result[cardId] = [];
    }

    result[cardId] = [...result[cardId], ...relatedIds];
    relatedIds.forEach((relatedId) => {
      if (result[relatedId] === undefined) {
        result[relatedId] = [];
      }

      result[relatedId].push(cardId);
    });
  });
}
