import { merge, uniq } from 'lodash';
import utils from '../utils';
import { DATA_DOCUMENTS } from '../utils/constants';

/**
 * Gets document from data in firestore
 * @param documentName - The name of the document to retrieve
 * @param fallback - The fallback value if the document doesn't exist
 */
export const getDataFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response: any;

  if (utils.firebase.isEmulatingEnvironment()) {
    return fallback;
  }

  try {
    response = (await utils.firestore.getDataRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: Log error but don't error for the user
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Saves data to data in firestore
 * @param documentName - The name of the document to update
 * @param data - The data to save
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
      newData = merge(currentData, data);
      break;
    default:
      newData = currentData;
  }

  if (newData) {
    await utils.firestore.getDataRef().doc(documentName).update(newData);
  }

  return true;
};

/**
 * Recursively updates data collection for drawings or monster drawings with retry logic
 * @param prefix - The collection prefix type
 * @param language - The language code
 * @param data - The data to update
 */
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
      // biome-ignore lint/suspicious/noConsole: Log error but don't error for the user
      console.error(`Error updating document '${prefix}' (attempt ${tries}): ${error}`);
    }
  }

  return true;
};

/**
 * Updates card data collection by merging new clues with existing ones
 * @param type - The type of cards
 * @param language - The language code
 * @param data - The card clues data to merge
 */
export const updateCardDataCollection = async (
  type: 'cards' | 'imageCards',
  language: Language,
  data: Record<UID | UID, string[]>,
): Promise<boolean> => {
  const documentName = `${type}Clues${language.toUpperCase()}`;

  // Get currentDoc
  const docRef = utils.firestore.getDataRef().doc(documentName);
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
 * Updates image cards relationships by merging new relationships with existing ones
 * @param relationships - The image card relationships to merge
 */
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
    parsedRelationships[key] = uniq(relatedIds);
  });

  // Save
  await utils.firestore
    .getDataRef()
    .doc(DATA_DOCUMENTS.IMAGE_CARDS_RELATIONSHIPS)
    .update(parsedRelationships);
};

/**
 * Transpiles relationships from source to result by creating bidirectional connections
 * @param source - The source relationships to transpile
 * @param result - The result object to populate with bidirectional relationships
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
