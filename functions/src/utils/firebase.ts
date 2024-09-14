// eslint-disable-next-line
import * as functions from 'firebase-functions/v2';

import { GenericCallableFunction } from '../types/reference';
import utils from '../utils';

export const isEmulatingFunctions = () => !!process.env.FUNCTIONS_EMULATOR;
export const isEmulatingFirestore = () => !!process.env.FIRESTORE_EMULATOR_HOST;
export const isEmulatingEnvironment = () => isEmulatingFunctions() && isEmulatingFirestore();

/**
 * CLOUD FUNCTIONS V2 MIGRATION
 */

export const throwException = (error: any, action: string) => {
  // TODO: Verify
  // if (isEmulatingFirestore()) {
  //   console.error(`Failed to ${action}`, error);
  // }
  throw new functions.https.HttpsError('internal', `Failed to ${action}: ${String(error)}`);
};

export const apiDelegator = (
  request: functions.https.CallableRequest<ActionPayload>,
  actions: Record<string, GenericCallableFunction>
) => {
  const uid = request.auth?.uid;
  const action = request.data?.action;

  if (!action) {
    return utils.firebase.throwException('Action not provided', 'perform request');
  }

  if (!uid) {
    return utils.firebase.throwException('User not authenticated', action.toLowerCase());
  }

  if (!actions[action]) {
    return utils.firebase.throwException('Invalid action', action.toLowerCase());
  }

  return actions[action](request.data, request.auth);
};

/**
 * Validate if payload property exists
 * @param property
 * @param propertyName
 * @param action
 */
export function verifyPayload(property?: any, propertyName = 'unknown property', action = 'function') {
  if (property === undefined || property === null) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

/**
 * Validate payload data for an action
 * @param gameId
 * @param gameName
 * @param action
 * @param actionText
 */
export function validateActionPayload(
  gameId: GameId,
  gameName: GameName,
  action: string,
  actionText: string
) {
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Validate payload data for a submit action
 * @param gameId
 * @param gameName
 * @param playerId
 * @param action
 */
export function validateSubmitActionPayload(
  gameId: GameId,
  gameName: GameName,
  playerId: PlayerId,
  action: string
) {
  const actionText = 'submit action';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(playerId, 'playerId', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Verify if data object has all properties in the the properties array
 * @param data
 * @param properties
 * @param action
 */
export function validateSubmitActionProperties(data: PlainObject, properties: string[], action: string) {
  properties.forEach((propertyName) => verifyPayload(data[propertyName], propertyName, action));
}
