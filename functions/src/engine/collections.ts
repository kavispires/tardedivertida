import utils from '../utils';

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
  prefix: 'drawing' | 'monsterDrawing',
  language: Language,
  data: any
): Promise<boolean> => {
  // Get suffix counts
  const suffixCounts = await getDataFirebaseDocData('suffixCounts', { drawing: 0, monsterDrawing: 0 });
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
