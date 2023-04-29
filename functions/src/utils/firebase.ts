import * as functions from 'firebase-functions';
// eslint-disable-next-line
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
// Utils
import utils from '../utils';

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
 * Validate payload data for an action
 * @param gameId
 * @param gameName
 * @param action
 * @param actionText
 */
export function validateActionPayload(
  gameId: GameId,
  gameName: GameName,
  action: string,
  actionText: string
) {
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Validate payload data for a submit action
 * @param gameId
 * @param gameName
 * @param playerId
 * @param action
 */
export function validateSubmitActionPayload(
  gameId: GameId,
  gameName: GameName,
  playerId: PlayerId,
  action: string
) {
  const actionText = 'submit action';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
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
 * Get Firebase session for the data collection (used to save bot/seed data)
 * @returns firebase data reference
 */
export function getDataRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('data');
}

/**
 * Get Firebase session for the global collection
 * @returns firebase global reference
 */
export function getGlobalRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('global');
}

/**
 * Get Firebase session for the meta collection
 * @returns firebase meta reference
 */
export function getMetaRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('meta');
}

/**
 * Get Firebase session for the public collection
 * @returns firebase public reference
 */
export function getPublicRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('public');
}

/**
 * Get Firebase session for the user collection
 * @returns firebase public reference
 */
export function getUserRef(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('users');
}

/**
 * Get Firebase session for gameId in collection
 * @param gameName
 * @param gameId
 * @returns firebase session reference
 */
export function getSessionRef(
  gameName: string,
  gameId: string
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return getFirestore().collection('games').doc(gameName).collection(gameId);
}

/**
 * Aids deleting a value of a document on an update
 */
export function deleteValue() {
  return FieldValue.delete();
}

/**
 * Aids increasing a numerical value of a document on an update
 * @param value number
 */
export function incrementValue(value = 1) {
  return FieldValue.increment(value);
}

/**
 * Get firebase doc verifying its existence
 * @param gameId
 * @param actionText
 * @returns
 */
export async function getMetaDoc(
  gameId: string,
  actionText: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const metaRef = getMetaRef();
  const gameDoc = await metaRef.doc(gameId).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${gameId} does not exist`
    );
  }

  return gameDoc;
}

/**
 * Get firebase doc verifying its existence
 * @param gameName
 * @param gameId
 * @param docName
 * @param actionText
 * @returns
 */
export async function getSessionDoc(
  gameName: string,
  gameId: string,
  docName: string,
  actionText: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const sessionRef = getSessionRef(gameName, gameId);
  const gameDoc = await sessionRef.doc(docName).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${gameName}/${gameId}/${docName} does not exist`
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
 * @param gameName
 * @param gameId
 * @param actionText
 * @returns
 */
export const getStateReferences = async <A = FirebaseFirestore.DocumentData>(
  gameName: GameName,
  gameId: GameId,
  actionText: string
): Promise<{
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  state: A;
  players: Players;
}> => {
  const sessionRef = getSessionRef(gameName, gameId);
  const stateDoc = await getSessionDoc(gameName, gameId, 'state', actionText);
  const state = (stateDoc.data() ?? {}) as A;
  const players = ((state as PlainObject)?.players ?? {}) as Players;

  return {
    sessionRef,
    stateDoc,
    state,
    players,
  };
};

/**
 * Gather docs and references needed in every nextPhase function
 * @param gameName
 * @param gameId
 * @param actionText
 * @returns
 */
export const getStateAndStoreReferences = async <
  A = FirebaseFirestore.DocumentData,
  O = FirebaseFirestore.DocumentData
>(
  gameName: GameName,
  gameId: GameId,
  actionText: string,
  previousState?: A
): Promise<{
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  storeDoc: FirebaseFirestore.DocumentSnapshot;
  state: A;
  store: O;
  players: Players;
}> => {
  const sessionRef = getSessionRef(gameName, gameId);
  const storeDoc = await getSessionDoc(gameName, gameId, 'store', actionText);
  const stateDoc = await getSessionDoc(gameName, gameId, 'state', actionText);
  const store = (storeDoc.data() ?? {}) as O;
  const state = previousState ?? ((stateDoc.data() ?? {}) as A);
  const players = ((state as PlainObject)?.players ?? {}) as Players;
  return {
    sessionRef,
    stateDoc,
    storeDoc,
    state,
    store,
    players,
  };
};

/**
 * Saves (setting or updating) the game's session
 * @param sessionRef
 * @param saveContent
 * @returns
 */
export const saveGame = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  saveContent: SaveGamePayload
) => {
  try {
    if (saveContent?.set?.state) {
      await sessionRef.doc('state').set({ ...saveContent.set.state, updatedAt: Date.now() } ?? {});
    }

    if (saveContent?.update?.store || saveContent?.update?.storeCleanup) {
      const cleanup = (saveContent?.update?.storeCleanup ?? []).reduce((acc, key) => {
        if (key) {
          acc[key] = deleteValue();
        }
        return acc;
      }, {});
      await sessionRef.doc('store').update({ ...(saveContent.update.store ?? {}), ...cleanup });
    }

    if (saveContent?.update?.state || saveContent?.update?.stateCleanup) {
      const cleanup = (saveContent?.update?.stateCleanup ?? []).reduce((acc, key) => {
        if (key) {
          acc[key] = deleteValue();
        }
        return acc;
      }, {});

      await sessionRef
        .doc('state')
        .update({ ...(saveContent.update.state ?? {}), ...cleanup, updatedAt: Date.now() });
    }
  } catch (error) {
    throwException(error, 'update game');
  }

  return true;
};

/**
 * Mark game as complete on its meta data doc
 * @param gameId
 * @returns
 */
export const markGameAsComplete = async (gameId: GameId) => {
  await getMetaRef().doc(gameId).update({ isComplete: true });
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
  // await utils.wait();
  return true;
};

/**
 * Aides updating player properties on submit actions
 * @param args.gameName
 * @param args.gameId
 * @param args.playerId
 * @param args.actionText
 * @param args.shouldReady
 * @param args.change
 * @param args.nextPhaseFunction
 * @returns
 */
export const updatePlayer = async ({
  gameName,
  gameId,
  playerId,
  actionText,
  shouldReady,
  change,
  nextPhaseFunction,
}: UpdatePlayerArgs) => {
  const sessionRef = getSessionRef(gameName, gameId);

  const playerChange = {};
  for (const key in change) {
    if (change[key] !== undefined) {
      playerChange[`players.${playerId}.${key}`] = change[key];
    }
  }
  // Ready player if so
  if (shouldReady) {
    playerChange[`players.${playerId}.ready`] = true;
  }

  try {
    await sessionRef.doc('state').update({ ...playerChange });
  } catch (error) {
    return throwException(error, actionText);
  }
  if (shouldReady && nextPhaseFunction) {
    const { state } = await utils.firebase.getStateReferences<DefaultState>(gameName, gameId, actionText);
    const players = state?.players ?? {};
    // If all players are ready, trigger next phase
    if (utils.players.isEverybodyReady(players)) {
      return nextPhaseFunction(gameName, gameId, state);
    }
  }

  return true;
};

/**
 * Aides updating simple store properties on submit actions
 * @param args.gameName
 * @param args.gameId
 * @param args.playerId
 * @param args.actionText
 * @param args.change
 * @param args.nextPhaseFunction
 * @returns
 */
export const updateStore = async ({
  gameName,
  gameId,
  actionText,
  change,
  nextPhaseFunction,
}: UpdateStoreArgs) => {
  const sessionRef = getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('store').update({ ...change });
  } catch (error) {
    return throwException(error, actionText);
  }

  if (nextPhaseFunction) {
    return nextPhaseFunction(gameName, gameId);
  }

  return true;
};

/**
 * Aides updating simple state properties on submit actions
 * @param args.gameName
 * @param args.gameId
 * @param args.playerId
 * @param args.actionText
 * @param args.change
 * @param args.nextPhaseFunction
 * @returns
 */
export const updateState = async ({
  gameName,
  gameId,
  actionText,
  change,
  nextPhaseFunction,
}: UpdateStoreArgs) => {
  const sessionRef = getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('state').update({ ...change });
  } catch (error) {
    return throwException(error, actionText);
  }

  if (nextPhaseFunction) {
    return nextPhaseFunction(gameName, gameId);
  }

  return true;
};

/**
 * Resets to default any given global used document
 * @param documentName
 */
export const resetGlobalUsedDocument = async (documentName: string) => {
  await utils.firebase.getGlobalRef().doc(documentName).set({ 'a-a-a': true });
};
