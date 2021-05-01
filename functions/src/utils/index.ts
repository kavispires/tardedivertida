import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as constants from './constants';
import { arteRuim } from '../engine/arte-ruim';

const { GAME_CODES, GAME_COLLECTIONS } = constants;

/**
 * Validate if payload property exists
 * @param property
 * @param propertyName
 * @param action
 */
export function verifyPayload(property?: string, propertyName = 'unknown property', action = 'function') {
  if (!property) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

/**
 * Validate if user is authenticated
 * @param context
 * @param action
 */
export function verifyAuth(context: any, action = 'perform function') {
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
 * Get firebase doc verifying its existense
 * @param collectionName
 * @param gameId
 * @param doc
 * @param actionText
 * @returns
 */
export async function getSessionDoc(
  collectionName: string,
  gameId: string,
  doc: string,
  actionText: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const sessionRef = getSessionRef(collectionName, gameId);
  const gameDoc = await sessionRef.doc(doc).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${collectionName}/${gameId}/${doc} does not exist`
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

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (gameCode: string, usedIds: string[] = [], length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: string, length: number) {
    let id = `${gameCode}`;
    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || usedIds.includes(gameId)) {
    gameId = generateId(gameCode, length);
  }

  return gameId;
};

/**
 * Get collection name by single letter game code
 * @param gameCode
 * @returns
 */
export const getCollectionNameByGameCode = (gameCode: string): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_COLLECTIONS.ARTE_RUIM;
    default:
      return null;
  }
};

/**
 * Get collection name by extracting the first letter of a game id
 * @param {string} gameId
 */
export const getCollectionNameByGameId = (gameId: string): string | null => {
  return getCollectionNameByGameCode(gameId[0]);
};

/**
 * Get all methods from game collection
 * @param collectionName
 * @returns
 */
export const getGameMethodsByCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuim;
    default:
      throw new Error(`Collection '${collectionName}' does not exist`);
  }
};
