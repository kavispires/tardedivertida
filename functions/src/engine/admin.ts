import * as admin from 'firebase-admin';
// Constants
import { GLOBAL_USED_DOCUMENTS, USED_GAME_IDS } from '../utils/constants';
// Types
import type {
  CreateGamePayload,
  FirebaseContext,
  BasicGamePayload,
  Players,
  ExtendedPayload,
  GameId,
  GameName,
  PlainObject,
} from '../utils/types';
// Utils
import * as delegatorUtils from '../utils/delegators';
import * as utils from '../utils';

/**
 * Creates a new game instance
 * @param data
 * @param context a logged in user is required to perform this
 * @returns
 */
export const createGame = async (data: CreateGamePayload, context: FirebaseContext) => {
  const actionText = 'create new game';
  utils.firebase.verifyAuth(context, actionText);

  // Get collection name by game code on request
  const { gameCode } = data;

  if (!gameCode) {
    return utils.firebase.throwException('a gameCode is required', actionText);
  }

  const collectionName = delegatorUtils.getCollectionNameByGameCode(gameCode);

  if (!collectionName) {
    return utils.firebase.throwException(`provided gameCode is invalid ${gameCode}`, actionText);
  }

  if (process.env.FUNCTIONS_EMULATOR) {
    await _feedEmulatorDB();
  }

  // Get list of used ids
  const globalRef = utils.firebase.getGlobalRef();
  const usedGameIdsDocs = await globalRef.doc(USED_GAME_IDS).get();
  const usedGameIdsData = usedGameIdsDocs.data();
  const usedGameIds = Object.keys(usedGameIdsData ?? {});

  // Get list of code ids present in database
  const collectionRef = admin.firestore().collection(collectionName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string = utils.helpers.generateGameId(gameCode, usedGameIds);

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await collectionRef.doc(gameId).get();
  if (tempGame.exists) {
    return utils.firebase.throwException(
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
    const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
    const { getInitialState } = delegatorUtils.getEngine(collectionName);

    const uid = context?.auth?.uid ?? 'admin?';
    const { meta, players, state, store } = getInitialState(gameId, uid, data.language ?? 'pt', data.options);

    await sessionRef.doc('meta').set(meta);
    await sessionRef.doc('players').set(players);
    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    response = meta;
  } catch (e) {
    return utils.firebase.throwException(`${e}`, `${actionText} in the firestore database`);
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
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(collectionName, 'collectionName', actionText);
  utils.firebase.verifyAuth(context, actionText);

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Verify minimum number of players
  const numPlayers = Object.keys(players).length;
  const { playerCounts } = delegatorUtils.getEngine(collectionName);

  if (numPlayers < playerCounts.MIN) {
    utils.firebase.throwException(
      `Game ${gameId} has an insufficient number of players: Minimum ${playerCounts.MIN} players, but has ${numPlayers}`,
      actionText
    );
  }

  if (numPlayers > playerCounts.MAX) {
    utils.firebase.throwException(
      `Game ${gameId} has more players than it supports: Maximum ${playerCounts.MAX} players, but has ${numPlayers}`,
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
    utils.firebase.throwException(error, actionText);
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

  utils.firebase.verifyAuth(context, action);
  utils.firebase.validateActionPayload(gameId, collectionName, action, action);

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
      return utils.firebase.throwException(
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
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);

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

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);

  try {
    await sessionRef.doc('state').update(stateUpdate);
  } catch (error) {
    return utils.firebase.throwException(error, actionText);
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

  const sessionRef = utils.firebase.getSessionRef(collectionName, gameId);
  // Reset players
  const playersDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};
  const newPlayers = utils.players.resetPlayers(players);

  // Update meta
  const metaDoc = await utils.firebase.getSessionDoc(collectionName, gameId, 'meta', actionText);
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
    utils.firebase.throwException(error, actionText);
  }

  return false;
};

/**
 * Feeds basic data to the emulator DB
 */
const _feedEmulatorDB = async () => {
  const sample = { 'a-a-a': true };

  // GLOBAL
  await utils.firebase.getGlobalRef().doc(USED_GAME_IDS).set(sample);

  // ARTE_RUIM

  await utils.firebase.getPublicRef().doc('arteRuimDrawingsPt').set(sample);
  await utils.firebase.getPublicRef().doc('arteRuimDrawingsEn').set(sample);
  await utils.firebase.getPublicRef().doc('ratings').set(sample);

  const usedEntries = Object.values(GLOBAL_USED_DOCUMENTS).map((usedEntryName) =>
    utils.firebase.getGlobalRef().doc(usedEntryName).set(sample)
  );

  await Promise.all(usedEntries);
};
