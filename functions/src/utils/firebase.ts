import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { FirebaseContext } from '../utils/interfaces';

/**
 * Validate if payload property exists
 * @param property
 * @param propertyName
 * @param action
 */
export function verifyPayload(property?: any, propertyName = 'unknown property', action = 'function') {
  if (property === undefined || property === null) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

/**
 * Validate if user is authenticated
 * @param context
 * @param action
 */
export function verifyAuth(context: FirebaseContext, action = 'perform function') {
  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: you must be logged in`);
  }
}

/**
 * Get Firebase session for gameId in collection
 * @param collectionName
 * @param gameId
 * @returns firebase session reference
 */
export function getSessionRef(
  collectionName: string,
  gameId: string
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return admin.firestore().collection(collectionName).doc(gameId).collection('session');
}

/**
 * Aids deleting a value of a document on an update
 * @returns
 */
export function deleteValue() {
  return admin.firestore.FieldValue.delete();
}

/**
 * Get firebase doc verifying its existence
 * @param collectionName
 * @param gameId
 * @param doc
 * @param actionText
 * @returns
 */
export async function getSessionDoc(
  collectionName: string,
  gameId: string,
  docName: string,
  actionText: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const sessionRef = getSessionRef(collectionName, gameId);
  const gameDoc = await sessionRef.doc(docName).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${collectionName}/${gameId}/${docName} does not exist`
    );
  }

  return gameDoc;
}

/**
 * Throws an exception. It should be used only inside a catch
 * @param error
 * @param action
 */
export function throwException(error: any, action = 'function') {
  throw new functions.https.HttpsError('internal', `Failed to ${action}: ${JSON.stringify(error)}`);
}
