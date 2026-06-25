// eslint-disable-next-line
import { initializeApp } from 'firebase-admin/app';
// eslint-disable-next-line
import { onCall } from 'firebase-functions/v2/https';
// Utils
import { isEmulatingEnvironment } from './utils/environment';
import { feedEmulatorUser } from './utils/mocks/emulator';
// Internal
import { gameEngine } from './gameEngine';
import { dailyEngine } from './games/daily';
import { hostEngine } from './games/host';
import { userEngine } from './games/user';

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
exports.userEngine = onCall(userEngine);

/**
 * All daily game actions
 */
exports.dailyEngine = onCall(dailyEngine);

/**
 * All game engine actions
 */
exports.gameEngine = onCall(gameEngine);

/**
 * All game host actions
 */
exports.hostEngine = onCall(hostEngine);
