// eslint-disable-next-line
import * as functions from 'firebase-functions/v1';
// eslint-disable-next-line
import * as functionsV2 from 'firebase-functions/v2';
// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
import * as commonEngine from './engine/common';
import * as adminEngine from './engine/admin';
import { dailyEngine } from './engine/daily';
import { userEngine } from './engine/user';

import { feedEmulatorUser } from './utils/mocks/emulator';
import { gameEngine } from './gameEngine';

initializeApp();

if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
  feedEmulatorUser();
}

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// ADMIN HTTP CALLS (require auth)

/**
 * Admin Actions
 * Create a new game instance returning its meta data with gameId
 * Lock game so new players cannot join
 */
exports.adminActions = functions.https.onCall(adminEngine.adminApi);

/**
 * Collection of admin actions like `nextPhase`, `playAgain`, `endGame`, etc
 */
exports.performAdminAction = functions.https.onCall(adminEngine.performAdminAction);

/**
 * Common game actions
 */
exports.gameActions = functions.https.onCall(commonEngine.gameApi);

/**
 * CLOUD FUNCTION V2
 */

/**
 * All user actions outside a game
 */
exports.userEngine = functionsV2.https.onCall(userEngine);

/**
 * All daily game actions
 */
exports.dailyEngine = functionsV2.https.onCall(dailyEngine);

/**
 * All game engine actions
 */
exports.gameEngine = functionsV2.https.onCall(gameEngine);
