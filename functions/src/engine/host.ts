import * as admin from 'firebase-admin';
// Constants
import { GAME_CODES, USED_GAME_IDS } from '../utils/constants';
// Utils
import * as delegatorUtils from '../utils/delegators';
import utils from '../utils';
import { feedEmulatorDB } from '../utils/mocks/emulator';
import { CallableRequestV2, FirebaseAuth } from '../types/reference';

export type CreateGamePayload = {
  gameName: string;
  language: string;
  version: string;
  options?: GameOptions;
  action: string;
};

/**
 * Creates a new game.
 *
 * @param data - The payload containing game information.
 * @param context - The Firebase context.
 * @returns The metadata of the created game.
 */
const createGame = async (data: CreateGamePayload, auth: FirebaseAuth) => {
  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    feedEmulatorDB();
  }

  const actionText = 'create new game';

  // Get collection name by game code on request
  const { gameName, language, version, options } = data;

  if (!gameName) {
    return utils.firebase.throwExceptionV2('a gameName is required', actionText);
  }

  // Get gameCode
  const gameCode = GAME_CODES[gameName];

  if (!gameCode) {
    return utils.firebase.throwExceptionV2(`provided gameCode is invalid ${gameName}`, actionText);
  }

  // Get list of used ids
  const globalRef = utils.firestore.getGlobalRef();
  const usedGameIdsDocs = await globalRef.doc(USED_GAME_IDS).get();
  const usedGameIdsData = usedGameIdsDocs.data();
  const usedGameIds = Object.keys(usedGameIdsData ?? {});

  // Get list of code ids present in database
  const gameRef = admin.firestore().collection('games').doc(gameName);

  // Generate unique 4 digit code starting with game code letter
  let gameId: string = utils.helpers.generateGameId(gameCode, language as Language, usedGameIds);

  // Make sure the game does not exist, I do not trust that while loop
  const tempGame = await gameRef.collection(gameId).doc('state').get();
  if (tempGame.exists) {
    return utils.firebase.throwExceptionV2(
      `the generated game id ${gameId} belongs to an existing session`,
      actionText
    );
  }

  if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
    gameId = Array(4).fill(gameCode).join('');
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = utils.firestore.getSessionRef(gameName, gameId);
    const { getInitialState } = delegatorUtils.getEngine(gameName);

    const uid = auth?.uid ?? 'admin?';
    const { meta, state, store } = getInitialState(gameId, uid, language ?? 'pt', version, options);

    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    const metaRef = utils.firestore.getMetaRef();
    await metaRef.doc(gameId).set(meta);

    response = meta;
  } catch (e) {
    return utils.firebase.throwExceptionV2(`${e}`, `${actionText} in the firestore database`);
  }

  try {
    // Update global ids. This is in a different block just for dev purposes
    await globalRef.doc(USED_GAME_IDS).update({ [gameId]: Date.now() });
  } catch (e) {
    // Do nothing
  }

  return {
    ...response,
  };
};

export type BasicGamePayload = {
  gameId: GameId;
  gameName: GameName;
  action: string;
  [key: string]: any;
};

/**
 * Locks a game and updates its state and metadata.
 *
 * @param data - The payload containing the game ID and game name.
 * @returns A boolean indicating whether the game was successfully locked.
 * @throws Throws an exception if the game has an insufficient number of players or if there are more players than the game supports.
 */
const lockGame = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'lock game';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const { sessionRef, state } = await utils.firestore.getStateReferences<DefaultState>(
    gameName,
    gameId,
    actionText
  );

  const players = state?.players ?? {};

  // Verify minimum number of players
  const numPlayers = utils.players.getPlayerCount(players);
  const { getPlayerCounts } = delegatorUtils.getEngine(gameName);
  const playerCounts = getPlayerCounts();

  if (numPlayers < playerCounts.MIN) {
    utils.firebase.throwExceptionV2(
      `Game ${gameId} has an insufficient number of players: Minimum ${playerCounts.MIN} players, but has ${numPlayers}`,
      actionText
    );
  }

  if (numPlayers > playerCounts.MAX) {
    utils.firebase.throwExceptionV2(
      `Game ${gameId} has more players than it supports: Maximum ${playerCounts.MAX} players, but has ${numPlayers}`,
      actionText
    );
  }

  // Update meta with players Ids
  const listOfPlayers = utils.helpers
    .orderBy(utils.players.getListOfPlayers(players), ['name'], 'asc')
    .map((player) => player.id);

  try {
    // Set info with players object and isLocked
    await utils.firestore.getMetaRef().doc(gameId).update({ isLocked: true, playersIds: listOfPlayers });
    // Set state with new Phase: Rules
    await sessionRef.doc('state').update({
      phase: 'RULES',
    });

    return true;
  } catch (error) {
    utils.firebase.throwExceptionV2(error, actionText);
  }

  return false;
};

/**
 * Unlocks the game and resets it to the initial state.
 *
 * @param data - The payload containing the game ID and game name.
 * @returns A boolean indicating whether the game was successfully unlocked and reset.
 */
const unlockAndResetGame = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'reset game';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = utils.firestore.getSessionRef(gameName, gameId);

  try {
    // Unlock game
    await utils.firestore.getMetaRef().doc(gameId).update({ isLocked: false });
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
    utils.firebase.throwExceptionV2(error, actionText);
  }

  return false;
};

/**
 * Goes to the next phase of the game.
 *
 * @param data - The payload containing the game ID and game name.
 * @returns A promise that resolves to the result of the next phase.
 */
const goToNextPhase = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'go to next phase';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const { getNextPhase } = delegatorUtils.getEngine(gameName);

  return getNextPhase(gameName, gameId);
};

/**
 * Forces a state property update for a game.
 *
 * @param data - The data object containing the game ID, game name, and state.
 * @returns A boolean indicating whether the state property update was successful.
 */
const forceStateProperty = async (data: BasicGamePayload) => {
  const { gameId, gameName, state } = data;

  const actionText = 'force state property';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = utils.firestore.getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('state').update(state);
  } catch (error) {
    return utils.firebase.throwExceptionV2(error, actionText);
  }

  return true;
};

/**
 * Forces the last round of the game.
 *
 * @param data - The basic game payload.
 * @returns A boolean indicating whether the last round was successfully forced.
 */
const forceLastRound = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;

  const actionText = 'force last round';

  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const sessionRef = utils.firestore.getSessionRef(gameName, gameId);

  try {
    await sessionRef.doc('state').update({ 'round.forceLastRound': true });
  } catch (error) {
    return utils.firebase.throwExceptionV2(error, actionText);
  }

  return true;
};

/**
 * Resets the game state and allows players to play the game again.
 *
 * @param data - The payload containing the game ID and game name.
 * @returns A boolean indicating whether the game was successfully reset.
 */
const playAgain = async (data: BasicGamePayload) => {
  const { gameId, gameName } = data;
  const actionText = 'play game again';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);

  const { sessionRef, state } = await utils.firestore.getStateReferences<DefaultState>(
    gameName,
    gameId,
    actionText
  );

  const players = state?.players ?? {};
  // Reset players
  const newPlayers = utils.players.resetPlayers(players);

  // Update meta
  const metaDoc = await utils.firestore.getSessionDoc(gameName, gameId, 'meta', actionText);
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
      phase: 'RULES',
      round: {
        current: 0,
        total: 0,
      },
      players: newPlayers,
    });

    return true;
  } catch (error) {
    utils.firebase.throwExceptionV2(error, actionText);
  }

  return false;
};

const HOST_API_ACTIONS = {
  CREATE_GAME: createGame,
  LOCK_GAME: lockGame,
  GO_TO_NEXT_PHASE: goToNextPhase,
  FORCE_STATE_PROPERTY: forceStateProperty,
  PLAY_AGAIN: playAgain,
  FORCE_END_GAME: forceLastRound,
  RESET_GAME: unlockAndResetGame,
};

/**
 * Executes the user engine function.
 *
 * @param request - The callable request object.
 * @returns The result of the user engine function.
 */
/**
 * Executes the game host engine.
 *
 * @param request - The CallableRequestV2 object.
 */
export const hostEngine = (request: CallableRequestV2<CreateGamePayload | BasicGamePayload>) => {
  // Verify action
  const action = request.data?.action;
  if (!action) {
    return utils.firebase.throwExceptionV2('Action not provided', 'perform request');
  }

  // Verify auth
  const uid = request.auth?.uid;
  if (!uid) {
    return utils.firebase.throwExceptionV2('User not authenticated', action);
  }

  if (HOST_API_ACTIONS[action]) {
    return HOST_API_ACTIONS[action](request.data, request.auth);
  }

  return utils.firebase.throwExceptionV2('Admin action does not exist', action);
};
