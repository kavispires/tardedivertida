import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as delegatorUtils from '../utils/delegators';
import * as firebaseUtils from '../utils/firebase';
import * as utils from '../utils/helpers';
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

  // Get list of used ids
  const globalRef = firebaseUtils.getGlobalRef();
  const usedGameIdsDocs = await globalRef.doc('usedGameIds').get();
  const usedGameIdsData = usedGameIdsDocs.data();
  const usedGameIds = Object.keys(usedGameIdsData ?? {});

  // Get list of code ids present in database
  const collectionRef = admin.firestore().collection(collectionName);

  // Generate unique 4 digit code starting with game code letter
  const gameId: string = utils.generateGameId(gameCode, usedGameIds);

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await collectionRef.doc(gameId).get();
  if (tempGame.exists) {
    return firebaseUtils.throwException(
      `the generated game id ${gameCode} belongs to an existing session`,
      actionText
    );
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);

    const getInitialState = delegatorUtils.getInitialStateForCollection(collectionName);
    const uid = context?.auth?.uid ?? '';

    const { meta, players, state, store } = getInitialState(gameId, uid, data.language ?? 'BR');

    await sessionRef.doc('meta').set(meta);
    await sessionRef.doc('players').set(players);
    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);
    // Update global ids
    await globalRef.doc('usedGameIds').update({ gameId: true });

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
  firebaseUtils.verifyPayload(gameId, 'gameId', 'load game');

  const collectionName = delegatorUtils.getCollectionNameByGameId(gameId);

  if (!collectionName) {
    return firebaseUtils.throwException(`there is no game engine for the given id: ${gameId}`, actionText);
  }

  // Get 'meta' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const gameMeta = await sessionRef.doc('meta').get();

  if (!gameMeta.exists) {
    return firebaseUtils.throwException(`game ${gameId} does not exist`, actionText);
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
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Remove symbols from the player name
  const cleanPlayerName = playerName.replace(/[\][(){},.:;!?<>%]/g, '');

  // Generate playerId by removing accents and lower casing the name
  const playerId = `_${cleanPlayerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Replace characters with accents
    .toLowerCase()}`;

  if (players?.[playerId]) {
    return players[playerId];
  }

  // Verify maximum number of players
  const collectionKey = delegatorUtils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const numPlayers = Object.keys(players).length;
  const maximum = GAME_PLAYERS_LIMIT[collectionKey].max;
  if (numPlayers === maximum) {
    firebaseUtils.throwException(
      `Sorry, you can't join. Game ${gameId} already has the maximum number of players: ${maximum}`,
      actionText
    );
  }

  // Verify if game is locked
  const metaDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  if (meta?.isLocked) {
    firebaseUtils.throwException(`This game ${gameId} is locked and cannot accept new players`, actionText);
  }

  try {
    const newPlayer = utils.createPlayer(playerId, cleanPlayerName, `${playerAvatarId}`, players);
    await sessionRef.doc('players').update({
      [playerId]: newPlayer,
    });
    return newPlayer;
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
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
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyAuth(context, actionText);

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Verify minimum number of players
  const collectionKey = delegatorUtils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const numPlayers = Object.keys(players).length;
  const minimum = GAME_PLAYERS_LIMIT[collectionKey].min;
  if (numPlayers < minimum) {
    firebaseUtils.throwException(
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
    firebaseUtils.throwException(error, actionText);
  }

  return false;
};

/**
 * Makes player ready, if all players are ready
 * @param data
 * @returns
 */
export const makeMeReady = async (data: MakeMeReadyPayload) => {
  const { gameId, gameName: collectionName, playerId } = data;

  const actionText = 'make you ready';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  if (!utils.isEverybodyReady(updatedPlayers)) {
    try {
      const key = `${playerId}.ready`;
      await sessionRef.doc('players').update({ [key]: true });
      return true;
    } catch (error) {
      firebaseUtils.throwException(error, actionText);
    }
  }

  const collectionKey = delegatorUtils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const nextPhaseDelegator = delegatorUtils.getNextPhaseForCollection(collectionKey);

  // If all players are ready, trigger next phase
  try {
    return nextPhaseDelegator(collectionName, gameId, players);
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }
};

// Next phase
export const goToNextPhase = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to the next phase';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyAuth(context, actionText);

  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const collectionKey = delegatorUtils.getCollectionKeyByGameCode(gameId[0]) ?? '';
  const nextPhaseDelegator = delegatorUtils.getNextPhaseForCollection(collectionKey);

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
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyAuth(context, actionText);

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
      round: 0,
    });

    return true;
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return false;
};
