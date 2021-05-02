import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from './utils/index';
import * as arteRuimEngine from './engine/arte-ruim';
import { DrawingEntry } from './utils/interfaces';

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

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

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

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = arteRuimEngine.readyPlayer(players, playerName);

  if (!arteRuimEngine.isEverybodyReady(updatedPlayers)) {
    try {
      await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
      return true;
    } catch (error) {
      utils.throwException(error, actionText);
    }
  }

  console.log('All players are ready!');

  // If all players are ready, trigger next phase
  return arteRuimEngine.nextArteRuimPhase(collectionName, gameId, playerName, players);
});

exports.arteRuimSubmitDrawing = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName, drawing, cardId } = data;

  const actionText = 'submit your drawing';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(drawing, 'drawing', actionText);
  utils.verifyPayload(cardId, 'cardId', actionText);

  // Get 'players' from given game session
  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  // Submit drawing
  const store = storeDoc.data();
  try {
    const newStore = { ...store };
    newStore?.currentDrawings?.push(<DrawingEntry>{
      drawing,
      cardId: `${cardId}`,
      playerName,
    });

    await sessionRef.doc('store').set({ ...newStore });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = arteRuimEngine.readyPlayer(players, playerName);

  if (!arteRuimEngine.isEverybodyReady(updatedPlayers)) {
    try {
      await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
      return true;
    } catch (error) {
      utils.throwException(error, actionText);
    }
  }

  console.log('All players are ready!');

  // If all players are ready, trigger next phase
  return arteRuimEngine.nextArteRuimPhase(collectionName, gameId, playerName, players);
});

exports.arteRuimSubmitVoting = functions.https.onCall(async (data) => {
  const { gameId, gameName: collectionName, playerName, votes } = data;

  const actionText = 'submit your votes';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyPayload(playerName, 'playerName', actionText);
  utils.verifyPayload(votes, 'votes', actionText);

  const sessionRef = utils.getSessionRef(collectionName, gameId);
  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

  // Submit drawing
  const store = storeDoc.data();
  try {
    const newStore = { ...store };
    newStore.currentVoting = {
      [playerName]: votes,
      ...newStore?.currentVoting,
    };

    await sessionRef.doc('store').set({ ...newStore });
  } catch (error) {
    utils.throwException(error, actionText);
  }

  // Make player ready
  const players = playersDoc.data() ?? {};
  const updatedPlayers = arteRuimEngine.readyPlayer(players, playerName);

  if (!arteRuimEngine.isEverybodyReady(updatedPlayers)) {
    try {
      await sessionRef.doc('players').update({ [playerName]: updatedPlayers[playerName] });
      return true;
    } catch (error) {
      utils.throwException(error, actionText);
    }
  }

  console.log('All players are ready!');

  // If all players are ready, trigger next phase
  return arteRuimEngine.nextArteRuimPhase(collectionName, gameId, playerName, players);
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
