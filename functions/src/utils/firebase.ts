import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// Interfaces
import {
  FirebaseContext,
  GameId,
  GameName,
  PlainObject,
  PlayerId,
  SaveGamePayload,
  StateAndStoreReferences,
  UpdatePlayerArgs,
  UpdateStoreArgs,
} from '../utils/interfaces';
// Utils
import * as utils from '../utils/helpers';

export const config = functions.config;

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
 * Validate payload data for a submit action
 * @param gameId
 * @param collectionName
 * @param playerId
 * @param action
 */
export function validateSubmitActionPayload(
  gameId: GameId,
  collectionName: GameName,
  playerId: PlayerId,
  action: string
) {
  const actionText = 'submit action';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(collectionName, 'collectionName', actionText);
  verifyPayload(playerId, 'playerId', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Verify if data object has all properties in the the properties array
 * @param data
 * @param properties
 * @param action
 */
export function validateSubmitActionProperties(data: PlainObject, properties: string[], action: string) {
  properties.forEach((propertyName) => verifyPayload(data[propertyName], propertyName, action));
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
 * Get Firebase session for the _global collection
 * @returns firebase _global reference
 */
export function getGlobalRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return admin.firestore().collection('_global');
}

/**
 * Get Firebase session for the _public collection
 * @returns firebase _public reference
 */
export function getPublicRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return admin.firestore().collection('_public');
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
  console.log(error);
  throw new functions.https.HttpsError('internal', `Failed to ${action}: ${JSON.stringify(error)}`);
}

/**
 * Gather docs and references needed in every nextPhase function
 * @param collectionName
 * @param gameId
 * @param actionText
 * @returns
 */
export const getStateAndStoreReferences = async (
  collectionName: GameName,
  gameId: GameId,
  actionText: string
): Promise<StateAndStoreReferences> => {
  const sessionRef = getSessionRef(collectionName, gameId);
  const stateDoc = await getSessionDoc(collectionName, gameId, 'state', actionText);
  const storeDoc = await getSessionDoc(collectionName, gameId, 'store', actionText);
  const state = stateDoc.data() ?? {};
  const store = storeDoc.data() ?? {};

  return {
    sessionRef,
    stateDoc,
    storeDoc,
    state,
    store,
  };
};

/**
 * Saves (setting or updating) the game's session
 * @param sessionRef
 * @param toSet
 * @param toUpdate
 * @returns
 */
export const saveGame = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  saveContent: SaveGamePayload
) => {
  try {
    if (saveContent?.set?.players) {
      await sessionRef.doc('players').set(saveContent.set.players ?? {});
    }

    if (saveContent?.set?.state) {
      await sessionRef.doc('state').set({ ...saveContent.set.state, updatedAt: Date.now() } ?? {});
    }

    if (saveContent?.update?.store) {
      await sessionRef.doc('store').update(saveContent.update.store);
    }

    if (saveContent?.update?.players) {
      await sessionRef.doc('players').update(saveContent.update.players);
    }

    if (saveContent?.update?.state) {
      await sessionRef.doc('state').update({ ...saveContent.update.state, updatedAt: Date.now() });
    }

    if (saveContent?.update?.meta) {
      await sessionRef.doc('meta').update(saveContent.update.meta);
    }
  } catch (error) {
    throwException(error, 'update game');
  }

  return true;
};

/**
 * Triggers setup phase so game ui stops in the setup window while stuff gets set up
 * @param sessionRef
 * @returns
 */
export const triggerSetupPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
) => {
  await sessionRef.doc('state').update({ phase: 'SETUP', updatedAt: Date.now() });

  return true;
};

/**
 * Aides updating player properties on submit actions
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param shouldReady
 * @param change
 * @param nextPhaseFunction
 * @returns
 */
export const updatePlayer = async ({
  collectionName,
  gameId,
  playerId,
  actionText,
  shouldReady,
  change,
  nextPhaseFunction,
}: UpdatePlayerArgs) => {
  const sessionRef = getSessionRef(collectionName, gameId);

  const playerChange = {};
  for (const key in change) {
    playerChange[`${playerId}.${key}`] = change[key];
  }
  // Ready player if so
  if (shouldReady) {
    playerChange[`${playerId}.ready`] = true;
  }

  try {
    await sessionRef.doc('players').update({ ...playerChange });
  } catch (error) {
    return throwException(error, actionText);
  }
  if (shouldReady && nextPhaseFunction) {
    const playersDoc = await getSessionDoc(collectionName, gameId, 'players', actionText);
    const players = playersDoc.data() ?? {};

    // If all players are ready, trigger next phase
    if (utils.isEverybodyReady(players)) {
      return nextPhaseFunction(collectionName, gameId, players);
    }
  }

  return true;
};

/**
 * Aides updating simple store properties on submit actions
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param change
 * @param nextPhaseFunction
 * @returns
 */
export const updateStore = async ({
  collectionName,
  gameId,
  actionText,
  change,
  nextPhaseFunction,
}: UpdateStoreArgs) => {
  const sessionRef = getSessionRef(collectionName, gameId);

  try {
    await sessionRef.doc('store').update({ ...change });
  } catch (error) {
    return throwException(error, actionText);
  }

  if (nextPhaseFunction) {
    const playersDoc = await getSessionDoc(collectionName, gameId, 'players', actionText);
    const players = playersDoc.data() ?? {};
    return nextPhaseFunction(collectionName, gameId, players);
  }

  return true;
};

/**
 * Aides updating simple state properties on submit actions
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param change
 * @param nextPhaseFunction
 * @returns
 */
export const updateState = async ({
  collectionName,
  gameId,
  actionText,
  change,
  nextPhaseFunction,
}: UpdateStoreArgs) => {
  const sessionRef = getSessionRef(collectionName, gameId);

  try {
    await sessionRef.doc('state').update({ ...change });
  } catch (error) {
    return throwException(error, actionText);
  }

  if (nextPhaseFunction) {
    const playersDoc = await getSessionDoc(collectionName, gameId, 'players', actionText);
    const players = playersDoc.data() ?? {};
    return nextPhaseFunction(collectionName, gameId, players);
  }

  return true;
};
