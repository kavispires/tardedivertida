// eslint-disable-next-line
import * as functions from 'firebase-functions/v2';
// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
import { dailyEngine } from './engine/daily';
import { userEngine } from './engine/user';
import { hostEngine } from './engine/host';
import { feedEmulatorUser } from './utils/mocks/emulator';
import { gameEngine } from './gameEngine';
import { isEmulatingEnvironment } from './utils/firebase';

initializeApp();

if (isEmulatingEnvironment()) {
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
exports.userEngine = functions.https.onCall(userEngine);

/**
 * All daily game actions
 */
exports.dailyEngine = functions.https.onCall(dailyEngine);

/**
 * All game engine actions
 */
exports.gameEngine = functions.https.onCall(gameEngine);

/**
 * All game host actions
 */
exports.hostEngine = functions.https.onCall(hostEngine);
