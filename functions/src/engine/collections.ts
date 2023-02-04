import utils from '../utils';

/**
 * Gets document from data in firestore
 * @param documentName
 * @param fallback
 * @returns
 */
export const getDataFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response: any;

  if (process.env.FUNCTIONS_EMULATOR) {
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
