// Internal
import { getGlobalCollectionRef } from './firestore-core';

/**
 * Resets to default any given global used document
 * @param documentName
 */
export const resetGlobalUsedDocument = async (documentName: string) => {
  await getGlobalCollectionRef().doc(documentName).set({ 'a-a-a': true });
};
