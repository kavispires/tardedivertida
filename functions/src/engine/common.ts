import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from '../utils/index';
import {
  AddPlayerPayload,
  CreateGamePayload,
  FirebaseContext,
  LoadGamePayload,
  BasicGamePayload,
  Players,
  MakeMeReadyPayload,
} from '../utils/interfaces';
import { GAME_PLAYERS_LIMIT } from '../utils/constants';

/**
 * Creates a new game instance
 * @param data
 * @param context a logged in user is required to perform this
 * @returns
 */
export const createGame = async (data: CreateGamePayload, context: FirebaseContext) => {
  const actionText = 'create new game';
  utils.verifyAuth(context, actionText);

  // Get collection name by game code on request
  const { gameCode } = data;

  if (!gameCode) {
    throw new functions.https.HttpsError('internal', `Failed to ${actionText}: a gameCode is required`);
  }

  const collectionName = utils.getCollectionNameByGameCode(gameCode);

  if (!collectionName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: provided gameCode is invalid ${gameCode}`
    );
  }

  // Get list of code ids present in database
  const collectionRef = admin.firestore().collection(collectionName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string | null = null;
  while (!gameId) {
    const tempId = utils.generateGameId(gameCode);
    const tempDoc = await collectionRef.doc(tempId).get();
    if (!tempDoc.exists) {
      gameId = tempId;
    }
  }

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await collectionRef.doc(gameId).get();
  if (tempGame.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: the generated game id ${gameCode} belongs to an existing session`
    );
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = utils.getSessionRef(collectionName, gameId);

    const getInitialState = utils.getInitialStateForCollection(collectionName);
    const uid = context?.auth?.uid ?? '';

    const { meta, players, state, store } = getInitialState(gameId, uid, data.language ?? 'BR');

    await sessionRef.doc('meta').set(meta);
    await sessionRef.doc('players').set(players);
    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    response = meta;
  } catch (e) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText} in the firestore database: ${e}`
    );
  }

  return {
    ...response,
  };
};

/**
 * Loads a new game instance
 * @param data
 * @returns
 */
export const loadGame = async (data: LoadGamePayload) => {
  const { gameId } = data;

  const actionText = 'load game';
  utils.verifyPayload(gameId, 'gameId', 'load game');

  const collectionName = utils.getCollectionNameByGameId(gameId);

  if (!collectionName) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: there is no game engine for the given id: ${gameId}`
    );
  }

  // Get 'meta' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameMeta = await sessionRef.doc('meta').get();

  if (!gameMeta.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${gameId} does not exist`
    );
  }

  return gameMeta.data();
};

/**
 * Add player to a game given gameId
 * @param data
 * @returns
 */
export const addPlayer = async (data: AddPlayerPayload) => {
  const { gameId, gameName: collectionName, playerName, playerAvatarId } = data;

  const actionText = 'add player';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  if (players?.[playerName]) {
    return players[playerName];
  }

  // Verify maximum number of players
  const collectionKey = utils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const numPlayers = Object.keys(players).length;
  const maximum = GAME_PLAYERS_LIMIT[collectionKey].max;
  if (numPlayers === maximum) {
    utils.throwException(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${maximum}`,
      actionText
    );
  }

  // Verify if game is locked
  const metaDoc = await utils.getSessionDoc(collectionName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  if (meta?.isLocked) {
    utils.throwException(`This game ${gameId} is locked and cannot accept new players`, actionText);
  }

  try {
    const newPlayer = utils.createPlayer(playerName, playerAvatarId, players);
    await sessionRef.doc('players').update({
      [playerName]: newPlayer,
    });
    return newPlayer;
  } catch (error) {
    utils.throwException(error, actionText);
  }
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
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Verify minimum number of players
  const collectionKey = utils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const numPlayers = Object.keys(players).length;
  const minimum = GAME_PLAYERS_LIMIT[collectionKey].min;
  if (numPlayers < minimum) {
    utils.throwException(
      `Game ${gameId} has an insufficient number of players: Minimum ${minimum} players, has ${numPlayers}`,
      actionText
    );
  }

  try {
    // Set info with players object and isLocked
    await sessionRef.doc('meta').update({ isLocked: true });
    // Set state with new Phase: Rules
    await sessionRef.doc('state').set({
      phase: 'RULES',
      round: 0,
    });

    return true;
  } catch (error) {
    utils.throwException(error, actionText);
  }

  return false;
};

// Make me ready
export const makeMeReady = async (data: MakeMeReadyPayload) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'make you ready';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerName);

  if (!utils.isEverybodyReady(updatedPlayers)) {
    try {
      await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
      return true;
    } catch (error) {
      utils.throwException(error, actionText);
    }
  }

  const collectionKey = utils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const nextPhaseDelegator = utils.getNextPhaseForCollection(collectionKey);

  // If all players are ready, trigger next phase
  return nextPhaseDelegator(collectionName, gameId, players);
};

// Next phase
export const goToNextPhase = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to the next phase';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const collectionKey = utils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const nextPhaseDelegator = utils.getNextPhaseForCollection(collectionKey);

  return nextPhaseDelegator(collectionName, gameId, players);
};

/**
 * Play game again within the same session (keeping used cards and same players)
 * @param data
 * @param context
 * @returns
 */
export const playAgain = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'play game again';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  // Reset players
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};
  const newPlayers = utils.resetPlayers(players);

  // Update meta
  const metaDoc = await utils.getSessionDoc(collectionName, gameId, 'meta', actionText);
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
      round: 0,
    });

    return true;
  } catch (error) {
    utils.throwException(error, actionText);
  }

  return false;
};
