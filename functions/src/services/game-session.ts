// eslint-disable-next-line
import * as functions from 'firebase-functions/v2';
import { isEmpty } from 'lodash';
// Utils
import utils from '../utils';
import { isEmulatingEnvironment } from '../utils/environment';
import { print } from '../utils/helpers';
// Internal
import { throwHttpsError } from './firebase-core';
import { getMetaCollectionRef, getSessionRef } from './firestore-core';
import * as firestoreValueUtils from './firestore-core';

/**
 * Retrieves the meta document for a game and throws an error if it doesn't exist
 * @param gameId - The unique identifier for the game
 * @param actionText - Description of the action being performed, used in error messages
 * @returns The game's meta document snapshot
 */
export async function fetchGameMetaDoc(
  gameId: string,
  actionText: string,
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const metaRef = getMetaCollectionRef();
  const gameDoc = await metaRef.doc(gameId).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${gameId} does not exist`,
    );
  }

  return gameDoc;
}

/**
 * Retrieves a specific document from a game session and throws an error if it doesn't exist
 * @param sessionRef - The Firestore collection reference for the game session
 * @param gameName - The name of the game
 * @param gameId - The unique identifier for the game session
 * @param docName - The name of the document to retrieve (e.g., 'state', 'store')
 * @param actionText - Description of the action being performed, used in error messages
 * @returns The requested session document snapshot
 */
export async function fetchGameSessionDoc(
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  gameName: string,
  gameId: string,
  docName: string,
  actionText: string,
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const gameDoc = await sessionRef.doc(docName).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${gameName}/${gameId}/${docName} does not exist`,
    );
  }

  return gameDoc;
}

/**
 * Gathers all necessary document references and data for game state management
 * @param gameName - The name of the game
 * @param gameId - The unique identifier for the game session
 * @param actionText - Description of the action being performed, used in error messages
 * @returns Object containing session reference, state document, parsed state data, and players
 */
export const getStateReferences = async <A = FirebaseFirestore.DocumentData>(
  gameName: string,
  gameId: UID,
  actionText: string,
): Promise<{
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  state: A;
  players: Players;
}> => {
  const sessionRef = getSessionRef(gameName, gameId);
  const stateDoc = await fetchGameSessionDoc(sessionRef, gameName, gameId, 'state', actionText);
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
 * Gathers all necessary document references and data including both state and store for game management
 * @param gameName - The name of the game
 * @param gameId - The unique identifier for the game session
 * @param actionText - Description of the action being performed, used in error messages
 * @param previousState - Optional previously fetched state to avoid re-fetching
 * @returns Object containing session reference, state/store documents, parsed state/store data, and players
 */
export const getStateAndStoreReferences = async <
  A = FirebaseFirestore.DocumentData,
  O = FirebaseFirestore.DocumentData,
>(
  gameName: string,
  gameId: UID,
  actionText: string,
  previousState?: A,
): Promise<{
  sessionRef: FirebaseFirestore.CollectionReference;
  stateDoc: FirebaseFirestore.DocumentSnapshot;
  storeDoc: FirebaseFirestore.DocumentSnapshot;
  state: A;
  store: O;
  players: Players;
}> => {
  const sessionRef = getSessionRef(gameName, gameId);
  const storeDoc = await fetchGameSessionDoc(sessionRef, gameName, gameId, 'store', actionText);
  const stateDoc = await fetchGameSessionDoc(sessionRef, gameName, gameId, 'state', actionText);
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
 * Saves or updates game session data to Firestore, handling both state and store updates with cleanup
 * @param sessionRef - The Firestore collection reference for the game session
 * @param saveContent - Payload containing state/store updates, sets, and cleanup instructions
 * @returns True when save operation completes successfully
 */
export const saveGame = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  saveContent: SaveGamePayload,
) => {
  const now = Date.now();
  const hasStateUpdate = !isEmpty(saveContent?.update?.state);
  const hasStoreUpdate = !isEmpty(saveContent?.update?.store);
  const hasStateSet = !isEmpty(saveContent?.set?.state);

  if (saveContent?.set?.state?.phase || saveContent?.update?.state?.phase) {
    utils.helpers.print(
      `➡️ Saving game state phase: ${
        (saveContent?.set?.state?.phase ?? saveContent?.update?.state?.phase) as string
      }`,
    );
  }

  if (isEmulatingEnvironment()) {
    const undefinedValues = verifyUndefinedValues(saveContent);
    if (undefinedValues) {
      if (saveContent.update?.state?.phase) {
        // biome-ignore lint/suspicious/noConsole: on purpose
        console.warn('📛 Undefined values on', saveContent.update.state.phase);
      } else {
        // biome-ignore lint/suspicious/noConsole: on purpose
        console.warn('📛 Undefined values');
      }

      print(undefinedValues);
    }
  }

  try {
    if (hasStateSet) {
      await sessionRef.doc('state').set({ ...(saveContent?.set?.state ?? {}), updatedAt: Date.now() });
    }
  } catch (error) {
    throwHttpsError(error, 'set game state');
  }
  try {
    if (hasStoreUpdate || saveContent?.update?.storeCleanup?.length) {
      const cleanup = (saveContent?.update?.storeCleanup ?? []).reduce((acc, key) => {
        if (key) {
          acc[key] = firestoreValueUtils.deleteValue();
        }
        return acc;
      }, {});
      await sessionRef.doc('store').update({ ...(saveContent?.update?.store ?? {}), ...cleanup });
    }
  } catch (error) {
    throwHttpsError(error, 'update game store');
  }

  try {
    if (hasStateUpdate || saveContent?.update?.stateCleanup?.length) {
      const cleanup = (saveContent?.update?.stateCleanup ?? []).reduce((acc, key) => {
        if (key) {
          acc[key] = firestoreValueUtils.deleteValue();
        }
        return acc;
      }, {});

      await sessionRef
        .doc('state')
        .update({ ...(saveContent?.update?.state ?? {}), ...cleanup, updatedAt: Date.now() });
    }
  } catch (error) {
    throwHttpsError(error, 'update game state');
  }

  if (hasStateSet || hasStateUpdate) {
    const phase = (saveContent?.set?.state?.phase ?? saveContent?.update?.state?.phase) as string | undefined;

    // So players can see the animation and there's a sense of things are getting setup we wait at least 7 seconds
    if (phase && phase === 'SETUP' && Date.now() - now < 7000) {
      await utils.helpers.forceWait(7000 - (Date.now() - now));
    }

    // TODO: Needs to figure out how to get the gameId, too risky to check the payload and not have it
    // if (phase && phase === 'GAME_OVER') {
    //   await getMetaRef().doc(gameId).update({ isComplete: true });
    // }
  }

  return true;
};

/**
 * Marks a game as complete in its metadata document
 * @param gameId - The unique identifier for the game
 * @returns True when the update completes successfully
 */
export const markGameAsComplete = async (gameId: UID) => {
  await getMetaCollectionRef().doc(gameId).update({ isComplete: true });
  return true;
};

/**
 * Transitions the game to the SETUP phase, showing the setup UI to players during initialization
 * @param sessionRef - The Firestore collection reference for the game session
 * @returns True when the phase transition completes successfully
 */
export const triggerSetupPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
) => {
  await sessionRef.doc('state').update({ phase: 'SETUP', updatedAt: Date.now() });
  await utils.helpers.devSimulateWait(2000);
  return true;
};

/**
 * Transitions the game to the WAIT phase, typically used during processing between phases
 * @param sessionRef - The Firestore collection reference for the game session
 * @returns True when the phase transition completes successfully
 */
export const triggerWaitPhase = async (
  sessionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
) => {
  await sessionRef.doc('state').update({ phase: 'WAIT', updatedAt: Date.now() });
  await utils.helpers.devSimulateWait(2000);
  return true;
};

/**
 * Updates player properties in the game state and optionally triggers phase progression
 * @param args.gameName - The name of the game
 * @param args.gameId - The unique identifier for the game session
 * @param args.playerId - The unique identifier for the player being updated
 * @param args.actionText - Description of the action being performed, used in error messages
 * @param args.shouldReady - Whether to mark the player as ready after the update
 * @param args.change - Object containing player properties to update
 * @param args.nextPhaseFunction - Optional function to call for phase progression
 * @param args.shouldGoToNextPhase - Whether to force progression regardless of ready status
 * @returns True when the update completes, or the result of nextPhaseFunction if triggered
 */
export const updatePlayer = async ({
  gameName,
  gameId,
  playerId,
  actionText,
  shouldReady,
  change,
  nextPhaseFunction,
  shouldGoToNextPhase,
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
    // TODO: log error
    return throwHttpsError(error, actionText);
  }
  if ((shouldReady || shouldGoToNextPhase) && nextPhaseFunction) {
    const { state } = await getStateReferences<DefaultState>(gameName, gameId, actionText);
    const players = state?.players ?? {};
    // If all players are ready, trigger next phase
    if (shouldGoToNextPhase || utils.players.isEverybodyReady(players)) {
      return nextPhaseFunction(gameName, gameId, state);
    }
  }

  return true;
};

/**
 * Updates store properties in the game session and optionally triggers a callback
 * @param args.gameName - The name of the game
 * @param args.gameId - The unique identifier for the game session
 * @param args.actionText - Description of the action being performed, used in error messages
 * @param args.change - Object containing store properties to update
 * @param args.nextPhaseFunction - Optional function to call after the update
 * @returns True when the update completes, or the result of nextPhaseFunction if provided
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
    return throwHttpsError(error, actionText);
  }

  if (nextPhaseFunction) {
    return nextPhaseFunction(gameName, gameId);
  }

  return true;
};

/**
 * Updates state properties in the game session and optionally triggers a callback
 * @param args.gameName - The name of the game
 * @param args.gameId - The unique identifier for the game session
 * @param args.actionText - Description of the action being performed, used in error messages
 * @param args.change - Object containing state properties to update
 * @param args.nextPhaseFunction - Optional function to call after the update
 * @returns True when the update completes, or the result of nextPhaseFunction if provided
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
    return throwHttpsError(error, actionText);
  }

  if (nextPhaseFunction) {
    return nextPhaseFunction(gameName, gameId);
  }

  return true;
};

/**
 * Identifies store properties to be removed, excluding default properties and specified keys
 * @param store - The store object to analyze for cleanup
 * @param keepKeys - Additional property keys that should be preserved
 * @returns Array of property keys to be deleted from the store
 */
export const cleanupStore = (store: PlainObject, keepKeys: string[]): string[] => {
  const keys = ['language', 'options', 'turnOrder', 'gameOrder', 'createdAt', 'achievements', ...keepKeys];
  return Object.keys(store).filter((key) => !keys.includes(key));
};

/**
 * Recursively inspects an object for undefined values and returns an array of paths to these values.
 *
 * @template T - The type of the object to inspect.
 * @param obj - The object to inspect for undefined values.
 * @param [parentKey=''] - The parent key path (used for recursive calls).
 * @returns - An array of string paths to undefined values, or null if no undefined values found.
 *
 * @example
 * const obj = { a: 1, b: undefined, c: { d: undefined, e: 2 } };
 * verifyUndefinedValues(obj); // Returns ["b", "c.d"]
 */
function verifyUndefinedValues<T extends object>(obj: T, parentKey = ''): string[] | null {
  const result: string[] = [];

  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    const fullKey = parentKey ? `${parentKey}.${String(key)}` : String(key);

    if (value === undefined) {
      result.push(fullKey);
    } else if (value !== null && typeof value === 'object') {
      const nested = verifyUndefinedValues(value as object, fullKey);
      if (nested) result.push(...nested);
    }
  }

  return result.length > 0 ? result : null;
}
