import { merge, uniq } from 'lodash';
// Constants
import { DATA_DOCUMENTS } from '../utils/constants';
// Utils
import { isEmulatingEnvironment } from '../utils/environment';
// Internal
import { getDataCollectionRef, getPublicCollectionRef } from './firestore-core';

/**
 * Retrieves a document from the community data Firestore collection
 * @param documentName - The name of the document to retrieve
 * @param fallback - Default value returned if the document doesn't exist or fetch fails
 * @returns The document data or fallback value
 */
export const getFirestoreCommunityData = async <T = PlainObject>(
  documentName: string,
  fallback: T = {} as T,
): Promise<T> => {
  let response: T;

  if (isEmulatingEnvironment()) {
    return fallback;
  }

  try {
    response = ((await getDataCollectionRef().doc(documentName)?.get())?.data() ?? fallback) as T;
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: Log error but don't error for the user
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Updates a community data document in Firestore by merging new data with existing data
 * @param documentName - The name of the document to update
 * @param data - The data to merge with existing document data
 * @returns True if the update was successful
 */
export const updateFirestoreCommunityData = async (
  documentName: string,
  data: PlainObject,
): Promise<boolean> => {
  const currentData = await getFirestoreCommunityData(documentName, {});

  const newData: PlainObject = merge(currentData, data);

  if (newData) {
    await getDataCollectionRef().doc(documentName).update(newData);
  }

  return true;
};

/**
 * Updates community data collection for drawings with retry logic and automatic suffix management
 * @param prefix - The collection prefix type (drawings or monsterDrawings)
 * @param language - The language code for the data
 * @param data - The data to update or create in the collection
 * @returns True if the update was successful after up to 5 retry attempts
 */
export const updateFirestoreCommunityDataRecursively = async (
  prefix: 'drawings' | 'monsterDrawings',
  language: Language,
  data: PlainObject,
): Promise<boolean> => {
  // Get suffix counts
  const documentPrefix = prefix === 'drawings' ? `${prefix}${language.toUpperCase()}` : `${prefix}`;
  const suffixCounts = await getFirestoreCommunityData('suffixCounts', { [documentPrefix]: 1 });

  let tries = 0;

  while (tries < 5) {
    const suffix = suffixCounts[documentPrefix] + tries;
    const documentFullName = `${documentPrefix}${suffix}`;

    try {
      const docRef = getDataCollectionRef().doc(documentFullName);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update(data);
      } else {
        await docRef.set(data);
      }
      await getDataCollectionRef()
        .doc('suffixCounts')
        .update({ [documentPrefix]: suffix });
      return true;
    } catch (error) {
      tries++;
      // biome-ignore lint/suspicious/noConsole: Log error but don't error for the user
      console.error(`Error updating document '${prefix}' (attempt ${tries}): ${error}`);
    }
  }

  return true;
};

/**
 * Updates card clues collection by merging new clues with existing ones, removing duplicates
 * @param type - The type of cards (cards or imageCards)
 * @param language - The language code for the clues
 * @param data - Object mapping card UIDs to arrays of clue strings to merge
 * @returns True if the update was successful
 */
export const updateFirestoreCommunityDataForCards = async (
  type: 'cards' | 'imageCards',
  language: Language,
  data: Record<UID | UID, string[]>,
): Promise<boolean> => {
  const documentName = `${type}Clues${language.toUpperCase()}`;

  // Get currentDoc
  const docRef = getDataCollectionRef().doc(documentName);
  const doc = await docRef.get();
  if (doc.exists) {
    const currentData = doc.data() ?? {};
    // Merge data
    Object.entries(data).forEach(([cardId, clues]) => {
      if (clues.length === 0) return;
      if (currentData[cardId]) {
        currentData[cardId] = uniq([...currentData[cardId], ...clues]);
      } else {
        currentData[cardId] = clues;
      }
    });

    await docRef.update(currentData);
  }

  return true;
};

/**
 * Updates image card relationships by creating bidirectional connections and removing duplicates
 * @param relationships - Object mapping image card UIDs to arrays of related card UIDs
 */
export const updateFirestoreCommunityDataForImageCardsRelationships = async (
  relationships: ImageCardRelationship,
): Promise<void> => {
  const previouslySavedRelationships: ImageCardRelationship =
    await getFirestoreCommunityData<ImageCardRelationship>(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS);

  const parsedRelationships: ImageCardRelationship = {};

  // Add each card id as a key to the parsed object with an empty array value
  transpileRelationships(previouslySavedRelationships, parsedRelationships);
  transpileRelationships(relationships, parsedRelationships);

  // Remove duplicates
  Object.entries(parsedRelationships).forEach(([key, relatedIds]) => {
    parsedRelationships[key] = uniq(relatedIds);
  });

  // Save
  await getDataCollectionRef().doc(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS).update(parsedRelationships);
};

/**
 * Transpile relationships by creating bidirectional connections between image cards
 * @param source - The source relationships object to process
 * @param result - The result object to populate with bidirectional relationships (mutated)
 */
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

/**
 * Retrieves a document from the public Firestore collection
 * @param documentName - The name of the document to retrieve
 * @param fallback - Default value returned if the document doesn't exist or fetch fails
 * @returns The document data or fallback value
 */
export const getFirestorePublicDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response: Promise<any>;

  if (isEmulatingEnvironment()) {
    return fallback;
  }

  try {
    response = (await getPublicCollectionRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Updates a public document in Firestore by merging objects or appending arrays
 * @param documentName - The name of the document to update
 * @param data - The data to merge (objects) or append (arrays)
 * @returns True if the update was successful
 */
export const updateFirestorePublicDocData = async (documentName: string, data: any): Promise<boolean> => {
  const expectedType = Array.isArray(data) ? 'array' : typeof data;

  const defaultCurrentData =
    {
      object: {},
      array: [],
      string: '',
      number: 0,
      boolean: false,
    }?.[expectedType] ?? {};

  const currentData = await getFirestorePublicDocData(documentName, defaultCurrentData);

  let newData: any = null;
  switch (expectedType) {
    case 'array':
      newData = [...currentData, ...data];
      break;
    case 'object':
      newData = { ...currentData, ...data };
      break;
    default:
      newData = currentData;
  }

  if (newData) {
    await getPublicCollectionRef().doc(documentName).update(newData);
  }

  return true;
};
