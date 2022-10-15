import utils from '../utils';

/**
 * Gets document from public in firestore
 * @param documentName
 * @param fallback
 * @returns
 */
export const getPublicFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response;

  if (process.env.FUNCTIONS_EMULATOR) {
    return fallback;
  }

  try {
    response = (await utils.firebase.getPublicRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Saves data to public in firestore
 * @param documentName
 * @param data
 * @returns
 */
export const updatePublicFirebaseDoc = async (documentName: string, data: any): Promise<boolean> => {
  const expectedType = Array.isArray(data) ? 'array' : typeof data;

  const defaultCurrentData =
    {
      object: {},
      array: [],
      string: '',
      number: 0,
      boolean: false,
    }?.[expectedType] ?? {};

  const currentData = await getPublicFirebaseDocData(documentName, defaultCurrentData);

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
    await utils.firebase.getPublicRef().doc(documentName).update(newData);
  }

  return true;
};
