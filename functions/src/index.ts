// eslint-disable-next-line
import * as functionsV2 from 'firebase-functions/v2';
// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
import { dailyEngine } from './engine/daily';
import { userEngine } from './engine/user';
import { hostEngine } from './engine/host';
import { feedEmulatorUser } from './utils/mocks/emulator';
import { gameEngine } from './gameEngine';

initializeApp();

if (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) {
  feedEmulatorUser();
}

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

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

/**
 * All game host actions
 */
exports.hostEngine = functionsV2.https.onCall(hostEngine);
