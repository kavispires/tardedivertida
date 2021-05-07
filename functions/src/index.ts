import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as commonEngine from './engine/common';
import * as arteRuimEngine from './engine/arte-ruim';
import * as umSoEngine from './engine/um-so';

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

// ARTE_RUIM HTTP CALLS

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

// UM_SO HTTP CALLS

/**
 * Make player ready, if it's the last player to be ready, move to the next phase
 */
exports.umSoMakeMeReady = functions.https.onCall(umSoEngine.makeMeReady);

/**
 * Submit word selection votes, if it's the last player to be ready, move to the next phase
 */
exports.umSoSubmitWordSelectionVotes = functions.https.onCall(umSoEngine.submitWordSelectionVotes);
