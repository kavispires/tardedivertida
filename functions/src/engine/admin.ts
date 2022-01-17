import * as admin from 'firebase-admin';
import * as delegatorUtils from '../utils/delegators';
import * as firebaseUtils from '../utils/firebase';
import * as utils from '../utils/helpers';
import {
  CreateGamePayload,
  FirebaseContext,
  BasicGamePayload,
  Players,
  ExtendedPayload,
  GameId,
  GameName,
  PlainObject,
} from '../utils/types';
import { GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../utils/constants';

/**
 * Creates a new game instance
 * @param data
 * @param context a logged in user is required to perform this
 * @returns
 */
export const createGame = async (data: CreateGamePayload, context: FirebaseContext) => {
  const actionText = 'create new game';
  firebaseUtils.verifyAuth(context, actionText);

  // Get collection name by game code on request
  const { gameCode } = data;

  if (!gameCode) {
    return firebaseUtils.throwException('a gameCode is required', actionText);
  }

  const collectionName = delegatorUtils.getCollectionNameByGameCode(gameCode);

  if (!collectionName) {
    return firebaseUtils.throwException(`provided gameCode is invalid ${gameCode}`, actionText);
  }

  if (process.env.FUNCTIONS_EMULATOR) {
    await _feedEmulatorDB();
  }

  // Get list of used ids
  const globalRef = firebaseUtils.getGlobalRef();
  const usedGameIdsDocs = await globalRef.doc(USED_GAME_IDS).get();
  const usedGameIdsData = usedGameIdsDocs.data();
  const usedGameIds = Object.keys(usedGameIdsData ?? {});

  // Get list of code ids present in database
  const collectionRef = admin.firestore().collection(collectionName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string = utils.generateGameId(gameCode, usedGameIds);

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await collectionRef.doc(gameId).get();
  if (tempGame.exists) {
    return firebaseUtils.throwException(
      `the generated game id ${gameCode} belongs to an existing session`,
      actionText
    );
  }

  if (process.env.FUNCTIONS_EMULATOR) {
    gameId = Array(4).fill(gameCode).join('');
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
    const { getInitialState } = delegatorUtils.getEngine(collectionName);

    const uid = context?.auth?.uid ?? 'admin?';
    const { meta, players, state, store } = getInitialState(gameId, uid, data.language ?? 'pt', data.options);

    await sessionRef.doc('meta').set(meta);
    await sessionRef.doc('players').set(players);
    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    response = meta;
  } catch (e) {
    return firebaseUtils.throwException(`${e}`, `${actionText} in the firestore database`);
  }

  try {
    // Update global ids. This is in a different block just for dev purposes
    await globalRef.doc(USED_GAME_IDS).update({ [gameId]: true });
  } catch (e) {
    // Do nothing
  }

  return {
    ...response,
  };
};

/**
 * Lock game so new players cannot join
 * @param data
 * @param context
 * @returns
 */
export const lockGame = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'lock game';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyAuth(context, actionText);

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Verify minimum number of players
  const numPlayers = Object.keys(players).length;
  const { playerCount } = delegatorUtils.getEngine(collectionName);

  if (numPlayers < playerCount.MIN) {
    firebaseUtils.throwException(
      `Game ${gameId} has an insufficient number of players: Minimum ${playerCount.MIN} players, but has ${numPlayers}`,
      actionText
    );
  }

  if (numPlayers > playerCount.MAX) {
    firebaseUtils.throwException(
      `Game ${gameId} has more players than it supports: Maximum ${playerCount.MAX} players, but has ${numPlayers}`,
      actionText
    );
  }

  try {
    // Set info with players object and isLocked
    await sessionRef.doc('meta').update({ isLocked: true });
    // Set state with new Phase: Rules
    await sessionRef.doc('state').update({
      phase: 'RULES',
    });

    return true;
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return false;
};

const ADMIN_ACTIONS = {
  GO_TO_NEXT_PHASE: 'GO_TO_NEXT_PHASE',
  FORCE_STATE_PROPERTY: 'FORCE_STATE_PROPERTY',
  PLAY_AGAIN: 'PLAY_AGAIN',
  FORCE_END_GAME: 'FORCE_END_GAME',
};

/**
 * Performs admin action depending on the keys
 *
 * If data contains key `state`, perform a force state property,
 * @param data
 * @param context
 * @returns
 */
export const performAdminAction = async (data: ExtendedPayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName, action } = data;

  firebaseUtils.verifyAuth(context, action);
  firebaseUtils.validateActionPayload(gameId, collectionName, action, action);

  switch (action) {
    case ADMIN_ACTIONS.GO_TO_NEXT_PHASE:
      return await goToNextPhase(gameId, collectionName);
    case ADMIN_ACTIONS.FORCE_STATE_PROPERTY:
      return await forceStateProperty(gameId, collectionName, data.state);
    case ADMIN_ACTIONS.PLAY_AGAIN:
      return await playAgain(gameId, collectionName);
    case ADMIN_ACTIONS.FORCE_END_GAME:
      return await forceStateProperty(gameId, collectionName, { lastRound: true });
    default:
      return firebaseUtils.throwException(
        'Failed to perform admin action',
        `Action ${action} is not allowed`
      );
  }
};

/**
 * Goes to next phase of the current game
 * @param gameId
 * @param collectionName
 * @returns
 */
const goToNextPhase = async (gameId: GameId, collectionName: GameName) => {
  const actionText = 'go to next phase';
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const { getNextPhase } = delegatorUtils.getEngine(collectionName);

  return getNextPhase(collectionName, gameId, players);
};

/**
 * Adds a property to game game state
 * @param gameId
 * @param collectionName
 * @param stateUpdate
 * @returns
 */
const forceStateProperty = async (gameId: GameId, collectionName: GameName, stateUpdate: PlainObject) => {
  const actionText = 'force state property';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

  try {
    await sessionRef.doc('state').update(stateUpdate);
  } catch (error) {
    return firebaseUtils.throwException(error, actionText);
  }

  return false;
};

/**
 *
 * @param gameId
 * @param collectionName
 * @returns
 */
const playAgain = async (gameId: GameId, collectionName: GameName) => {
  const actionText = 'play game again';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  // Reset players
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};
  const newPlayers = utils.resetPlayers(players);

  // Update meta
  const metaDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  try {
    // Set info with players object and isLocked
    await sessionRef.doc('meta').update({
      isComplete: false,
      replay: meta.replay + 1,
    });
    // Update players
    await sessionRef.doc('players').set(newPlayers);
    // Force rules phase which will trigger new setup
    await sessionRef.doc('state').set({
      phase: 'RULES',
      round: {
        current: 0,
        total: 0,
      },
    });

    return true;
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return false;
};

/**
 * Feeds basic data to the emulator DB
 */
const _feedEmulatorDB = async () => {
  const sample = { 'a-a-a': true };

  // GLOBAL
  await firebaseUtils.getGlobalRef().doc(USED_GAME_IDS).set(sample);

  // ARTE_RUIM

  await firebaseUtils.getPublicRef().doc('arteRuimDrawingsPt').set(sample);
  await firebaseUtils.getPublicRef().doc('arteRuimDrawingsEn').set(sample);
  await firebaseUtils.getPublicRef().doc('ratings').set(sample);

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    firebaseUtils.getGlobalRef().doc(usedEntryName).set(sample)
  );

  await Promise.all(usedEntries);
};
