import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as commonEngine from './engine/common';
import * as arteRuimEngine from './engine/arte-ruim';
import * as espiaoEntreNosEngine from './engine/espiao-entre-nos';
import * as ondaTelepaticaEngine from './engine/onda-telepatica';
import * as ueSoIssoEngine from './engine/ue-so-isso';

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

/**
 * Play game again within the same session
 */
exports.playAgain = functions.https.onCall(commonEngine.playAgain);

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

// ESPIAO_ENTRE_NOS HTTP CALLS

/**
 * Make player ready, if it's the last player to be ready, move to the next phase
 */
exports.espiaoEntreNosMakeMeReady = functions.https.onCall(espiaoEntreNosEngine.makeMeReady);

/**
 * handles admin actions
 */
exports.espiaoEntreNosHandleAdminAction = functions.https.onCall(espiaoEntreNosEngine.handleAdminAction);

/**
 * Pause game and accuse someone
 */
exports.espiaoEntreNosMakeAccusation = functions.https.onCall(espiaoEntreNosEngine.makeAccusation);

/**
 * Pause game and guess location
 */
exports.espiaoEntreNosGuessLocation = functions.https.onCall(espiaoEntreNosEngine.guessLocation);

/**
 * Submit individual voting, if it's the last player to be ready, move to the next phase
 */
exports.espiaoEntreNosSubmitVoting = functions.https.onCall(espiaoEntreNosEngine.submitVoting);

// ONDA_TELEPATICA HTTP CALLS

/**
 * Make player ready, if it's the last player to be ready, move to the next phase
 */
exports.ondaTelepaticaMakeMeReady = functions.https.onCall(ondaTelepaticaEngine.makeMeReady);

/**
 * Submit dial sides and final clue and move to the next phase
 */
exports.ondaTelepaticaSubmitSides = functions.https.onCall(ondaTelepaticaEngine.submitSides);

/**
 * Submit dial sides and final clue and move to the next phase
 */
exports.ondaTelepaticaSubmitClue = functions.https.onCall(ondaTelepaticaEngine.submitClue);

/**
 * Submit team guess and move to the next phase
 */
exports.ondaTelepaticaSubmitGuess = functions.https.onCall(ondaTelepaticaEngine.submitGuess);

/**
 * Submit rival team guess and move to the next phase
 */
exports.ondaTelepaticaSubmitRivalGuess = functions.https.onCall(ondaTelepaticaEngine.submitRivalGuess);

/**
 * Just goes to next phase (admin action)
 */
exports.ondaTelepaticaGoToNextPhase = functions.https.onCall(ondaTelepaticaEngine.goToNextPhase);

// UE_SO_ISSO HTTP CALLS

/**
 * Make player ready, if it's the last player to be ready, move to the next phase
 */
exports.ueSoIssoMakeMeReady = functions.https.onCall(ueSoIssoEngine.makeMeReady);

/**
 * Submit word selection votes, if it's the last player to be ready, move to the next phase
 */
exports.ueSoIssoSubmitWordSelectionVotes = functions.https.onCall(ueSoIssoEngine.submitWordSelectionVotes);

/**
 * Submit user suggestions, if it's the last player to be ready, move to the next phase
 */
exports.ueSoIssoSubmitSuggestions = functions.https.onCall(ueSoIssoEngine.submitSuggestions);

/**
 * Submit user validation and move to the next phase
 */
exports.ueSoIssoSubmitValidation = functions.https.onCall(ueSoIssoEngine.submitValidation);

/**
 * Submit guesser guess and move to the next phase
 */
exports.ueSoIssoConfirmGuess = functions.https.onCall(ueSoIssoEngine.confirmGuess);
