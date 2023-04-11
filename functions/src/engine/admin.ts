import * as admin from 'firebase-admin';
// Constants
import { GAME_CODES, USED_GAME_IDS } from '../utils/constants';
// Utils
import * as delegatorUtils from '../utils/delegators';
import utils from '../utils';
import { feedEmulatorDB } from './emulator';

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
  const { gameName, language, options } = data;

  if (!gameName) {
    return utils.firebase.throwException('a gameName is required', actionText);
  }

  // Get gameCode
  const gameCode = GAME_CODES[gameName];

  if (!gameCode) {
    return utils.firebase.throwException(`provided gameCode is invalid ${gameName}`, actionText);
  }

  if (process.env.FUNCTIONS_EMULATOR) {
    await feedEmulatorDB();
  }

  // Get list of used ids
  const globalRef = utils.firebase.getGlobalRef();
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
    return utils.firebase.throwException(
      `the generated game id ${gameId} belongs to an existing session`,
      actionText
    );
  }

  if (process.env.FUNCTIONS_EMULATOR) {
    gameId = Array(4).fill(gameCode).join('');
  }

  // Create game entry in database
  let response = {};
  try {
    const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
    const { getInitialState } = delegatorUtils.getEngine(gameName);

    const uid = context?.auth?.uid ?? 'admin?';
    const { meta, players, state, store } = getInitialState(gameId, uid, language ?? 'pt', options);

    await sessionRef.doc('players').set(players);
    await sessionRef.doc('state').set(state);
    await sessionRef.doc('store').set(store);

    const metaRef = utils.firebase.getMetaRef();
    await metaRef.doc(gameId).set(meta);

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
  const { gameId, gameName } = data;

  const actionText = 'lock game';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyAuth(context, actionText);

  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};

  // Verify minimum number of players
  const numPlayers = utils.players.getPlayerCount(players);
  const { playerCounts } = delegatorUtils.getEngine(gameName);

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

  // Update meta with players Ids
  const listOfPlayers = utils.helpers
    .orderBy(utils.players.getListOfPlayers(players), ['name'], 'asc')
    .map((player) => player.id);

  try {
    // Set info with players object and isLocked
    await utils.firebase.getMetaRef().doc(gameId).update({ isLocked: true, playersIds: listOfPlayers });
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

/**
 * Unlocks the game and move everybody to the lobby
 * @param data
 * @param context
 * @returns
 */
const unlockAndResetGame = async (data: BasicGamePayload, context: FirebaseContext) => {
  const { gameId, gameName } = data;

  const actionText = 'reset game';
  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyAuth(context, actionText);

  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);

  try {
    // Unlock game
    await utils.firebase.getMetaRef().doc(gameId).update({ isLocked: false });
    // Set state with new Phase: Lobby
    await sessionRef.doc('state').set({
      phase: 'LOBBY',
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
  RESET_GAME: 'RESET_GAME',
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
  const { gameId, gameName, action, state } = data;

  utils.firebase.verifyAuth(context, action);
  utils.firebase.validateActionPayload(gameId, gameName, action, action);

  switch (action) {
    case ADMIN_ACTIONS.GO_TO_NEXT_PHASE:
      return await goToNextPhase(gameId, gameName);
    case ADMIN_ACTIONS.FORCE_STATE_PROPERTY:
      return await forceStateProperty(gameId, gameName, state);
    case ADMIN_ACTIONS.PLAY_AGAIN:
      return await playAgain(gameId, gameName);
    case ADMIN_ACTIONS.FORCE_END_GAME:
      return await forceStateProperty(gameId, gameName, { 'round.forceLastRound': true });
    case ADMIN_ACTIONS.RESET_GAME:
      return await unlockAndResetGame(data, context);
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
 * @param gameName
 * @returns
 */
const goToNextPhase = async (gameId: GameId, gameName: GameName) => {
  const actionText = 'go to next phase';
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const { getNextPhase } = delegatorUtils.getEngine(gameName);

  return getNextPhase(gameName, gameId, players);
};

/**
 * Adds a property to game game state
 * @param gameId
 * @param gameName
 * @param stateUpdate
 * @returns
 */
const forceStateProperty = async (gameId: GameId, gameName: GameName, stateUpdate: PlainObject) => {
  const actionText = 'force state property';

  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);

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
 * @param gameName
 * @returns
 */
const playAgain = async (gameId: GameId, gameName: GameName) => {
  const actionText = 'play game again';

  const sessionRef = utils.firebase.getSessionRef(gameName, gameId);
  // Reset players
  const playersDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'players', actionText);
  const players: Players = playersDoc.data() ?? {};
  const newPlayers = utils.players.resetPlayers(players);

  // Update meta
  const metaDoc = await utils.firebase.getSessionDoc(gameName, gameId, 'meta', actionText);
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
