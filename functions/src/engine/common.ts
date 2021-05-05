import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from '../utils/index';
// import * as arteRuimEngine from './arte-ruim';
import {
  AddPlayerPayload,
  CreateGamePayload,
  FirebaseContext,
  LoadGamePayload,
  BasicGamePayload,
  Players,
} from '../utils/interfaces';

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

    const methods = utils.getGameMethodsByCollection(collectionName);
    const uid = context?.auth?.uid ?? '';
    const { meta, players, state, store } = methods?.getInitialSession(gameId, uid);

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

  try {
    const methods = utils.getGameMethodsByCollection(collectionName);
    const newPlayer = methods.createPlayer(playerName, playerAvatarId, players);
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
  await utils.getSessionDoc(collectionName, gameId, 'meta', actionText);

  try {
    // Parse players into two objects: info with static information, state with variable information (score, etc)
    const methods = utils.getGameMethodsByCollection(collectionName);
    const newState = methods.lockGame();

    // Set info with players object and isLocked
    await sessionRef.doc('meta').update({ isLocked: true });
    // Set state with new Phase: Rules
    await sessionRef.doc('state').set(newState);

    return true;
  } catch (error) {
    utils.throwException(error, actionText);
  }

  return false;
};
