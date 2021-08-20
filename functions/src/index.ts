import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as commonEngine from './engine/common';
import * as arteRuimEngine from './engine/arte-ruim';
import * as DetetivesImaginativosEngine from './engine/detetives-imaginativos';
import * as espiaoEntreNosEngine from './engine/espiao-entre-nos';
import * as menteColetivaEngine from './engine/mente-coletiva';
import * as ondaTelepaticaEngine from './engine/onda-telepatica';
import * as polemicaDaVezEngine from './engine/polemica-da-vez';
import * as testemunhaOcularEngine from './engine/testemunha-ocular';
import * as ueSoIssoEngine from './engine/ue-so-isso';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

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
 * Make player ready and go to next game phase if all players are ready
 */
exports.makePlayerReady = functions.https.onCall(commonEngine.makePlayerReady);

/**
 * Action to force game to go to its next phase.
 * It may be using by players during a specific time during the game, or by the admin at any phase
 */
exports.goToNextPhase = functions.https.onCall(commonEngine.goToNextPhase);

/**
 * Admin action to force game certain state property and value
 */
exports.forceStateProperty = functions.https.onCall(commonEngine.forceStateProperty);

/**
 * Play game again within the same session
 */
exports.playAgain = functions.https.onCall(commonEngine.playAgain);

// ARTE_RUIM HTTP CALLS

exports.arteRuimSubmitAction = functions.https.onCall(arteRuimEngine.submitAction);

// DETETIVES_IMAGINATIVOS HTTP CALLS

exports.detetivesImaginativosSubmitAction = functions.https.onCall(DetetivesImaginativosEngine.submitAction);

// ESPIAO_ENTRE_NOS HTTP CALLS

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

// MENTE_COLETIVA HTTP CALLS

exports.menteColetivaSubmitAction = functions.https.onCall(menteColetivaEngine.submitAction);
exports.menteColetivaUpdateAction = functions.https.onCall(menteColetivaEngine.updateAction);

// ONDA_TELEPATICA HTTP CALLS

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

// POLEMICA_DA_VEZ HTTP CALLS

exports.polemicaDaVezSubmitAction = functions.https.onCall(polemicaDaVezEngine.submitAction);

// TESTEMUNHA_OCULAR HTTP CALLS

exports.testemunhaOcularSubmitAction = functions.https.onCall(testemunhaOcularEngine.submitAction);

// UE_SO_ISSO HTTP CALLS

exports.ueSoIssoSubmitAction = functions.https.onCall(ueSoIssoEngine.submitAction);
