import * as functions from 'firebase-functions/v1';
import * as functionsV2 from 'firebase-functions/v2';

import { GenericCallableFunctionV2 } from '../types/reference';
import utils from '../utils';

export const config = functions.config;

/**
 * CLOUD FUNCTIONS V2 MIGRATION
 */

export const throwExceptionV2 = (error: any, action: string) => {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.error(`Failed to ${action}`, error);
  }
  throw new functionsV2.https.HttpsError('internal', `Failed to ${action}: ${String(error)}`);
};

export const apiDelegatorV2 = (
  request: functionsV2.https.CallableRequest,
  actions: Record<string, GenericCallableFunctionV2>
) => {
  const uid = request.auth?.uid;
  const action = request.data?.action;

  if (!action) {
    return utils.firebase.throwExceptionV2('Action not provided', 'perform request');
  }

  if (!uid) {
    return utils.firebase.throwExceptionV2('User not authenticated', action.toLowerCase());
  }

  if (!actions[action]) {
    return utils.firebase.throwExceptionV2('Invalid action', action.toLowerCase());
  }

  return actions[action](request.data, request.auth);
};

/**
 * Created a delegating function for API actions
 * @param actions Dictionary of actions accepted by the API
 * @returns a function that delegates given action to the corresponding function
 */
export const apiDelegator = (apiName: string, actions: Record<string, GenericCallableFunction>) => {
  return (payload: CallablePayload<unknown>, context: FirebaseContext) => {
    const { action, ...data } = payload;

    if (!action) {
      return throwException('Missing action', apiName);
    }

    if (!actions[action]) {
      return throwException('Invalid action', apiName);
    }

    return actions[action](data, context);
  };
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

/**
 * Validate if user is authenticated
 * @param context
 * @param action
 */
export function verifyAuth(context: FirebaseContext, action = 'perform function') {
  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: you must be logged in`);
  }
}

/**
 * Throws an exception. It should be used only inside a catch
 * @param error
 * @param action
 */
export function throwException(error: unknown, action = 'function') {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.error(`Failed to ${action}`, error);
  }
  throw new functions.https.HttpsError('internal', `Failed to ${action}`, error);
}
