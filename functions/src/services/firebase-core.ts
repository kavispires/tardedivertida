// eslint-disable-next-line
import * as functions from 'firebase-functions/v2';
// Types
import type { GenericCallableFunction } from '../types/reference';
// Utils
import { isEmulatingEnvironment } from '../utils/environment';

/**
 * Core Firebase Cloud Functions utilities
 *
 * Provides essential utilities for Firebase Cloud Functions v2 including:
 * - Error handling and exception throwing
 * - API request delegation and routing
 * - Payload validation for actions and submissions
 *
 * These utilities ensure consistent error handling, authentication,
 * and data validation across all game engine functions.
 */

/**
 * Throws a Firebase HTTPS error with consistent formatting
 * Logs error details in emulator environment for debugging
 * @param error - The error object or message to throw
 * @param action - Description of the action that failed
 */
export const throwHttpsError = (error: unknown, action: string) => {
  if (isEmulatingEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Only for debugging purposes on dev
    console.error(`Failed to ${action}`, error);
  }
  throw new functions.https.HttpsError('internal', `Failed to ${action}: ${String(error)}`);
};

/**
 * Routes incoming API requests to the appropriate action handler
 * Validates authentication and action existence before delegation
 * @param request - The callable request containing auth and action data
 * @param actions - Dictionary mapping action names to handler functions
 * @returns Result from the delegated action handler
 */
export const delegateApiRequest = (
  request: functions.https.CallableRequest<ActionPayload>,
  actions: Dictionary<GenericCallableFunction>,
) => {
  const uid = request.auth?.uid;
  const action = request.data?.action;
  if (isEmulatingEnvironment()) {
    // biome-ignore lint/suspicious/noConsole: Only for debugging purposes on dev
    console.log(`Received request for action: ${action} from user: ${uid}`);
  }

  if (!action) {
    return throwHttpsError('Action not provided', 'perform request');
  }

  if (!uid) {
    return throwHttpsError('User not authenticated', action.toLowerCase());
  }

  if (!actions[action]) {
    return throwHttpsError('Invalid action', action.toLowerCase());
  }

  return actions[action](request.data, request.auth);
};

/**
 * Validates that a payload property exists and is not null or undefined
 * Throws an error if validation fails
 * @param property - The property value to validate
 * @param propertyName - Name of the property for error messages
 * @param action - Action context for error messages
 */
export function verifyPayload(property?: unknown, propertyName = 'unknown property', action = 'function') {
  if (property === undefined || property === null) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

/**
 * Validates required fields for a game action payload
 * Ensures gameId, gameName, and action are all present
 * @param gameId - The unique identifier of the game
 * @param gameName - The name of the game
 * @param action - The action being performed
 * @param actionText - Description of the action for error messages
 */
export function validateActionPayload(gameId: UID, gameName: string, action: string, actionText: string) {
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Validates required fields for a player submit action payload
 * Ensures gameId, gameName, playerId, and action are all present
 * @param gameId - The unique identifier of the game
 * @param gameName - The name of the game
 * @param playerId - The unique identifier of the player
 * @param action - The action being submitted
 */
export function validateSubmitActionPayload(gameId: UID, gameName: string, playerId: UID, action: string) {
  const actionText = 'submit action';
  verifyPayload(gameId, 'gameId', actionText);
  verifyPayload(gameName, 'gameName', actionText);
  verifyPayload(playerId, 'playerId', actionText);
  verifyPayload(action, 'action', actionText);
}

/**
 * Validates that a data object contains all required properties
 * Checks each property in the array and throws if any are missing
 * @param data - The data object to validate
 * @param properties - Array of required property names
 * @param action - Action context for error messages
 */
export function validateSubmitActionProperties(data: PlainObject, properties: string[], action: string) {
  properties.forEach((propertyName) => {
    verifyPayload(data[propertyName], propertyName, action);
  });
}
