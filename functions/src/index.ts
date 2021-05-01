import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from './utils/index';

import { ARTE_RUIM_GOAL, ARTE_RUIM_PHASES } from './utils/constants';
import { isEverybodyReady, readyPlayer, unReadyPlayers } from './engine/arte-ruim';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/**
 * Demo function
 */
export const helloWorld = functions.https.onCall(async () => {
  return 'hello world';
});

/**
 * Create a new game instance returning its meta data with gameId
 */
export const initializeGame = functions.https.onCall(async (data, context) => {
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
    console.error(e);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText} in the firestore database: ${e}`
    );
  }

  return {
    ...response,
  };
});

/**
 * Load an existing game
 */
exports.loadGame = functions.https.onCall(async (data) => {
  // Extract gameCode to figure out
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
});

/**
 * Add player to the game, if it's an existing player, only return its state
 */
exports.addPlayer = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName, playerAvatarId } = data;

  const actionText = 'add player';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  // Get 'state' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gamePlayers = await sessionRef.doc('players').get();

  if (!gamePlayers.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  const players = gamePlayers.data() ?? {};

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
  } catch (e) {
    utils.throwException(e, actionText);
  }
});

/**
 * Locks game so new players cannot join
 */
exports.lockGame = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'lock game';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  // Find game state and get all players
  // Get 'state' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // Parse players into two objects: info with static information, state with variable information (score, etc)
  const gameStateData = gameState.data();
  const players = gameStateData?.players;
  const methods = utils.getGameMethodsByCollection(collectionName);
  const { state, info } = methods.lockGame(players);

  // Set info with players object and isLocked
  await sessionRef.doc('info').set(info);
  // Set state with players variable info and new phase Rules
  await sessionRef.doc('state').set(state);

  return info;
});

/**
 * Make user ready, and if it's the last user, move the game to its next phase
 */
exports.arteRuimMakeMeReady = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'make you ready';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // Make player ready
  const gameStateData = gameState.data();
  const players = readyPlayer(gameStateData?.players ?? {}, playerName);

  if (!isEverybodyReady(players)) {
    await sessionRef.doc('state').set({
      ...gameStateData,
      players,
    });

    return true;
  }

  // If all players are now ready, check the next phase then prepare it and go to it
  // From RULES to ROUND 1/DRAW
  const currentPhase = gameStateData?.phase;

  // Unready players
  const newPlayers = unReadyPlayers(players);
  let newPhase = currentPhase;
  let addInfo = {};

  if (currentPhase === ARTE_RUIM_PHASES.RULES) {
    newPhase = ARTE_RUIM_PHASES.DRAW;
    addInfo = {
      round: 1,
      pointsToVictory: ARTE_RUIM_GOAL,
    };
  }

  // Set info with players object and isLocked
  if (Object.keys(addInfo).length) {
    await sessionRef.doc('info').update(addInfo);
  }

  // Set state with players variable info and new phase Rules
  await sessionRef.doc('state').update({
    players,
    newPlayers,
    phase: newPhase,
  });
  return true;
});

exports.arteRuimSubmitDrawing = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'submit your drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // TODO

  // Save drawing

  // Make player ready

  // If all players are now ready, check phase then prepare and go to next phase

  return {};
});

exports.arteRuimSubmitVoting = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'submit your votes';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // TODO

  // Save votes

  // Make player ready

  // If all players are now ready, check phase then prepare and go to next phase

  return {};
});

exports.arteRuimSubmitRating = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName } = data;

  const actionText = 'rate a drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // TODO

  // Save rating for drawing

  return true;
});

exports.arteRuimGoToGalleryItem = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to gallery item';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // TODO

  // Navigate through gallery

  return {};
});

exports.arteRuimForceEverybodyReady = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'force to make everybody ready';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const gameState = await sessionRef.doc('state').get();

  if (!gameState.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game '${collectionName}/${gameId}' does not exist`
    );
  }

  // TODO

  // Force all players to be ready and perform a next phase

  return {};
});
