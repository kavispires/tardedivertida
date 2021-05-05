import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as utils from './utils/index';
import * as commonEngine from './engine/common';
import * as arteRuimEngine from './engine/arte-ruim';
import { DrawingEntry } from './utils/interfaces';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/**
 * Demo function
 */
exports.test = functions.https.onCall(async () => {
  return 'hello world';
});

/**
 * Create a new game instance returning its meta data with gameId
 */
exports.initializeGame = functions.https.onCall(commonEngine.createGame);

/**
 * Load an existing game
 */
exports.loadGame = functions.https.onCall(commonEngine.loadGame);

/**
 * Add player to the game, if it's an existing player, only return its state
 */
exports.addPlayer = functions.https.onCall(commonEngine.addPlayer);

/**
 * Lock game so new players cannot join
 */
exports.lockGame = functions.https.onCall(commonEngine.lockGame);

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
  const updatedPlayers = utils.readyPlayer(players, playerName);

  if (!utils.isEverybodyReady(updatedPlayers)) {
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
  const updatedPlayers = utils.readyPlayer(players, playerName);

  if (!utils.isEverybodyReady(updatedPlayers)) {
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
  const updatedPlayers = utils.readyPlayer(players, playerName);

  if (!utils.isEverybodyReady(updatedPlayers)) {
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

// exports.arteRuimSubmitRating = functions.https.onCall(async (data) => {
//   const { gameId, gameName: collectionName, playerName } = data;

//   const actionText = 'rate a drawing';
//   utils.verifyPayload(gameId, 'gameId', actionText);
//   utils.verifyPayload(collectionName, 'collectionName', actionText);
//   utils.verifyPayload(playerName, 'playerName', actionText);

//   const sessionRef = utils.getSessionRef(collectionName, gameId);
//   const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);
//   const storeDoc = await utils.getSessionDoc(collectionName, gameId, 'store', actionText);

//   // Submit drawing
//   const store = storeDoc.data();
//   try {
//     const newStore = { ...store };
//     newStore.currentVoting = {
//       [playerName]: votes,
//       ...newStore?.currentVoting,
//     };

//     await sessionRef.doc('store').set({ ...newStore });
//   } catch (error) {
//     utils.throwException(error, actionText);
//   }

//   // Make player ready
//   const players = playersDoc.data() ?? {};
//   const updatedPlayers = arteRuimEngine.readyPlayer(players, playerName);

//   return arteRuimEngine.nextArteRuimPhase(collectionName, gameId, playerName, players);
// });

exports.arteRuimGoToNextPhase = functions.https.onCall(async (data, context) => {
  const { gameId, gameName: collectionName } = data;

  const actionText = 'go to ranking | go to new round';
  utils.verifyPayload(gameId, 'gameId', actionText);
  utils.verifyPayload(collectionName, 'collectionName', actionText);
  utils.verifyAuth(context, actionText);

  const playersDoc = await utils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  return arteRuimEngine.nextArteRuimPhase(collectionName, gameId, 'admin', players);
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
