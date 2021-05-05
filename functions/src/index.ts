import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as commonEngine from './engine/common';
import * as arteRuimEngine from './engine/arte-ruim';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/**
 * Demo function
 */
exports.test = functions.https.onCall(async () => {
  return 'hello world';
});

// COMMON HTTP CALLS

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

// ARTE RUIM HTTP CALLS

/**
 * Make player ready, if it's the last player to be ready, move to the next phase
 */
exports.arteRuimMakeMeReady = functions.https.onCall(arteRuimEngine.makeMeReady);

/**
 * Submit player's drawing, if it's the last player to be ready, move to the next phase
 */
exports.arteRuimSubmitDrawing = functions.https.onCall(arteRuimEngine.submitDrawing);

/**
 * Submit players votes, if it's the last player to be ready, move to the next phase
 */
exports.arteRuimSubmitVoting = functions.https.onCall(arteRuimEngine.submitVoting);

/**
 * Admin action to force game to go to its next phase
 */
exports.arteRuimGoToNextPhase = functions.https.onCall(arteRuimEngine.goToNextPhase);

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
