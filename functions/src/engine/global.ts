import utils from '../utils';

/**
 * Gets document from global in firestore
 * @param documentName
 * @param fallback
 * @returns
 */
export const getGlobalFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
  let response;

  try {
    response = (await utils.firestore.getGlobalRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Saves data to global in firestore
 * @param documentName
 * @param data
 * @returns
 */
export const updateGlobalFirebaseDoc = async (documentName: string, data: any): Promise<boolean> => {
  const expectedType = Array.isArray(data) ? 'array' : typeof data;

  const defaultCurrentData =
    {
      object: {},
      array: [],
      string: '',
      number: 0,
      boolean: false,
    }?.[expectedType] ?? {};

  const currentData = await getGlobalFirebaseDocData(documentName, defaultCurrentData);

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
    await utils.firestore.getGlobalRef().doc(documentName).update(newData);
  }

  return true;
};
