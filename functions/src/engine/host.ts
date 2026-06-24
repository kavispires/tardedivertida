// eslint-disable-next-line
import * as admin from 'firebase-admin';
import { orderBy } from 'lodash';
// Types
import type { CallableRequest, FirebaseAuth } from '../types/reference';
// Constants
import { GAME_CODES, USED_GAME_IDS } from '../utils/constants';
// Services
import { throwHttpsError, verifyPayload } from '../services/firebase-core';
import { getGlobalCollectionRef, getMetaCollectionRef, getSessionRef } from '../services/firestore-core';
import { fetchGameSessionDoc, getStateReferences } from '../services/game-session';
// Utils
import utils from '../utils';
import { retireGamesFromUsers } from '../utils/admin-cleanup';
import * as delegatorUtils from '../utils/delegators';
import { isEmulatingEnvironment } from '../utils/environment';
import { feedEmulatorDB } from '../utils/mocks/emulator';

export type CreateGamePayload = {
  gameName: string;
  language: string;
  version: string;
  options?: GameOptions;
  action: string;
};

/**
 * Creates a new game
 * @param data - The payload containing game information
 * @param auth - The Firebase authentication object
 */
const createGame = async (data: CreateGamePayload, auth: FirebaseAuth) => {
  if (isEmulatingEnvironment()) {
    feedEmulatorDB();
  }

  const actionText = 'create new game';

  // Get collection name by game code on request
  const { gameName, language, version, options } = data;

  if (!gameName) {
    return throwHttpsError('a gameName is required', actionText);
  }

  // Get gameCode
  const gameCode = GAME_CODES[gameName];

  if (!gameCode) {
    return throwHttpsError(`provided gameCode is invalid ${gameName}`, actionText);
  }

  // Get list of used ids
  const globalRef = getGlobalCollectionRef();
  const usedGameIdsDocs = await globalRef.doc(USED_GAME_IDS).get();
  const usedGameIdsData = usedGameIdsDocs.data();
  const usedGameIds = Object.keys(usedGameIdsData ?? {});

  // Get list of code ids present in database
  const gameRef = admin.firestore().collection('games').doc(gameName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string = utils.game.generateGameId(gameCode, language as Language, usedGameIds);

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await gameRef.collection(gameId).doc('state').get();
  if (tempGame.exists) {
    return throwHttpsError(`the generated game id ${gameId} belongs to an existing session`, actionText);
  }

  if (isEmulatingEnvironment()) {
    gameId = Array(4).fill(gameCode).join('');
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = getSessionRef(gameName, gameId);
    const { getInitialState } = delegatorUtils.getEngine(gameName);

    const uid = auth?.uid ?? 'admin?';
    const { meta, state, store } = getInitialState(gameId, uid, language ?? 'pt', version, options);

    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    const metaRef = getMetaCollectionRef();
    await metaRef.doc(gameId).set(meta);

    response = meta;
  } catch (e) {
    return throwHttpsError(`${e}`, `${actionText} in the firestore database`);
  }

  try {
    // Update global ids. This is in a different block just for dev purposes
    await globalRef.doc(USED_GAME_IDS).update({ [gameId]: Date.now() });
  } catch (_e) {
    // Do nothing
  }

  return {
    ...response,
  };
};

export type BasicGamePayload = {
  gameId: UID;
  gameName: string;
  action: string;
  [key: string]: AnyOrUnknownPlaceholder;
};

/**
 * Locks a game and updates its state and metadata
 * @param data - The payload containing the game ID and game name
 */
const lockGame = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'lock game';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const { state } = await getStateReferences<DefaultState>(gameName, gameId, actionText);

  const players = state?.players ?? {};

  // Verify minimum number of players
  const numPlayers = utils.players.getPlayerCount(players);
  const { getPlayerCounts, getNextPhase } = delegatorUtils.getEngine(gameName);
  const playerCounts = getPlayerCounts();

  if (numPlayers < playerCounts.MIN) {
    throwHttpsError(
      `Game ${gameId} has an insufficient number of players: Minimum ${playerCounts.MIN} players, but has ${numPlayers}`,
      actionText,
    );
  }

  if (numPlayers > playerCounts.MAX) {
    throwHttpsError(
      `Game ${gameId} has more players than it supports: Maximum ${playerCounts.MAX} players, but has ${numPlayers}`,
      actionText,
    );
  }

  // Update meta with players Ids
  const listOfPlayers = orderBy(utils.players.getListOfPlayers(players), ['name'], 'asc').map(
    (player) => player.id,
  );

  try {
    // Set info with players object and isLocked
    await getMetaCollectionRef().doc(gameId).update({ isLocked: true, playersIds: listOfPlayers });
    // Starts setup phase
    await getNextPhase(gameName, gameId);

    return true;
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  return false;
};

/**
 * Unlocks the game and resets it to the initial state
 * @param data - The payload containing the game ID and game name
 */
const unlockAndResetGame = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'reset game';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = getSessionRef(gameName, gameId);

  try {
    // Unlock game
    await getMetaCollectionRef().doc(gameId).update({ isLocked: false });
    // Set state with new Phase: Lobby
    await sessionRef.doc('state').set({
      phase: 'LOBBY',
      round: {
        current: 0,
        total: 0,
        forceLastRound: false,
      },
      players: {},
    });

    return true;
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  return false;
};

/**
 * Advances the game to the next phase
 * @param data - The payload containing the game ID and game name
 */
const goToNextPhase = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'go to next phase';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const { getNextPhase } = delegatorUtils.getEngine(gameName);

  return getNextPhase(gameName, gameId);
};

/**
 * Forces a state property update for a game
 * @param data - The payload containing the game ID, game name, and state to update
 */
const forceStateProperty = async (data: BasicGamePayload) => {
  const { gameId, gameName, state } = data;

  const actionText = 'force state property';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('state').update(state);
  } catch (error) {
    return throwHttpsError(error, actionText);
  }

  return true;
};

/**
 * Forces the last round of the game
 * @param data - The payload containing the game ID and game name
 */
const forceLastRound = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'force last round';

  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('state').update({ 'round.forceLastRound': true });
  } catch (error) {
    return throwHttpsError(error, actionText);
  }

  return true;
};

/**
 * Resets the game state and allows players to play the game again
 * @param data - The payload containing the game ID and game name
 */
const playAgain = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;
  const actionText = 'play game again';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);

  const { sessionRef, state } = await getStateReferences<DefaultState>(gameName, gameId, actionText);

  const players = state?.players ?? {};
  // Reset players
  utils.players.resetPlayers(players);
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.forceMetaRefresh = player.updatedAt ?? 0;
  });

  // Update meta
  const metaDoc = await fetchGameSessionDoc(sessionRef, gameName, gameId, 'meta', actionText);
  const meta = metaDoc.data() ?? {};

  try {
    // Set info with players object and isLocked
    await sessionRef.doc('meta').update({
      isComplete: false,
      replay: meta.replay + 1,
    });
    // Update players

    // Force rules phase which will trigger new setup
    await sessionRef.doc('state').set({
      phase: 'LOBBY',
      round: {
        current: 0,
        total: 0,
      },
      players,
    });

    return true;
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  return false;
};

export type RetireGamesPayload = {
  gameNames: string[];
  action: string;
};

/**
 * Retires games from all user profiles by removing game data and updating statistics for deprecated or cancelled games
 * @param data - The payload containing the array of game names to retire
 */
const retireGames = async (data: RetireGamesPayload) => {
  const { gameNames } = data;

  const actionText = 'retire games';
  verifyPayload(gameNames, 'gameNames', actionText);

  if (!Array.isArray(gameNames) || gameNames.length === 0) {
    return throwHttpsError('gameNames must be a non-empty array', actionText);
  }

  try {
    // biome-ignore lint/suspicious/noConsole: debug purposes
    console.log(`Starting game retirement for: ${gameNames.join(', ')}`);
    const result = await retireGamesFromUsers(gameNames);
    // biome-ignore lint/suspicious/noConsole: debug purposes
    console.log('Game retirement completed:', result);
    return result;
  } catch (error) {
    return throwHttpsError(error, actionText);
  }
};

const HOST_API_ACTIONS = {
  CREATE_GAME: createGame,
  LOCK_GAME: lockGame,
  GO_TO_NEXT_PHASE: goToNextPhase,
  FORCE_STATE_PROPERTY: forceStateProperty,
  PLAY_AGAIN: playAgain,
  FORCE_END_GAME: forceLastRound,
  RESET_GAME: unlockAndResetGame,
  RETIRE_GAMES: retireGames,
};

/**
 * Executes the game host engine by delegating to the appropriate action
 * @param request - The callable request object
 */
export const hostEngine = (
  request: CallableRequest<CreateGamePayload | BasicGamePayload | RetireGamesPayload>,
) => {
  // Verify action
  const action = request.data?.action;
  if (!action) {
    return throwHttpsError('Action not provided', 'perform request');
  }

  // Verify auth
  const uid = request.auth?.uid;
  if (!uid) {
    return throwHttpsError('User not authenticated', action);
  }

  if (HOST_API_ACTIONS[action]) {
    return HOST_API_ACTIONS[action](request.data, request.auth);
  }

  return throwHttpsError('Admin action does not exist', action);
};
