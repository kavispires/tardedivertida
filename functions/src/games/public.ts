// Services
import { getPublicCollectionRef } from '../services/firestore-core';
// Utils
import { isEmulatingEnvironment } from '../utils/environment';

/**
 * Gets document from public in firestore
 * @param documentName - The name of the document to retrieve
 * @param fallback - The fallback value if the document doesn't exist
 */
export const getPublicFirebaseDocData = async (documentName: string, fallback: any = {}): Promise<any> => {
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
 * Saves data to public in firestore
 * @param documentName - The name of the document to update
 * @param data - The data to save
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
    await getPublicCollectionRef().doc(documentName).update(newData);
  }

  return true;
};
