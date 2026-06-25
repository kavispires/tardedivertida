// Internal
import { getGlobalCollectionRef } from './firestore-core';

/**
 * Retrieves a document from the global Firestore collection
 * @param documentName - The name of the document to retrieve
 * @param fallback - Default value returned if the document doesn't exist or fetch fails
 * @returns The document data or fallback value
 */
export const fetchGlobalTrackerDocumentData = async (
  documentName: string,
  fallback: any = {},
): Promise<any> => {
  let response: Promise<any>;

  try {
    response = (await getGlobalCollectionRef().doc(documentName)?.get())?.data() ?? fallback;
  } catch (e) {
    console.error(e);
    response = fallback;
  }
  return response;
};

/**
 * Updates a document in the global Firestore collection by merging or appending data
 * @param documentName - The name of the document to update
 * @param data - The data to merge (objects) or append (arrays)
 * @returns True if the update was successful
 */
export const updateGlobalTrackerDocumentData = async (documentName: string, data: any): Promise<boolean> => {
  const expectedType = Array.isArray(data) ? 'array' : typeof data;

  const defaultCurrentData =
    {
      object: {},
      array: [],
      string: '',
      number: 0,
      boolean: false,
    }?.[expectedType] ?? {};

  const currentData = await fetchGlobalTrackerDocumentData(documentName, defaultCurrentData);

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
    await getGlobalCollectionRef().doc(documentName).update(newData);
  }

  return true;
};

/**
 * Resets a global tracker document to its default state
 * @param documentName - The name of the document to reset
 */
export const resetGlobalTrackerDocument = async (documentName: string): Promise<void> => {
  await getGlobalCollectionRef().doc(documentName).set({ 'a-a-a': true });
};
