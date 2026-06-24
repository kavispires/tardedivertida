// Types
import type { CallableRequest } from './types/reference';
// Services
import { throwHttpsError } from './services/firebase-core';
// API
import { gameSessionActions } from './api/session-api';
// Utils
import { getEngine } from './utils/delegators';

/**
 * Executes the game engine.
 *
 * @param request - The CallableRequest object.
 */
export const gameEngine = (request: CallableRequest<ActionPayload>) => {
  // Verify action
  const action = request.data?.action;
  if (!action) {
    return throwHttpsError('Action not provided', 'perform request');
  }

  // Special case: Load Game cannot require gameName because it only has the ID
  if (action === 'LOAD_GAME' && gameSessionActions[action]) {
    return gameSessionActions[action](request.data);
  }

  // Verify auth
  const uid = request.auth?.uid;
  if (!uid) {
    return throwHttpsError('User not authenticated', action);
  }

  // Verify gameName
  const gameName = request.data?.gameName;
  if (!gameName) {
    return throwHttpsError('Game name not provided', action);
  }

  // Delegate global actions
  if (gameSessionActions[action]) {
    return gameSessionActions[action](request.data, request.auth);
  }

  // Delegate game first, then action
  const engine = getEngine(gameName);
  if (!engine) {
    return throwHttpsError('Invalid game name', action);
  }

  const basicActions = {
    GET_INITIAL_STATE: engine.getInitialState,
    GET_PLAYER_COUNTS: engine.getPlayerCounts,
    GET_NEXT_PHASE: engine.getNextPhase,
  };

  // Delegate basic actions if available
  if (basicActions[action]) {
    return basicActions[action](request.data, request.auth);
  }

  return engine.submitAction(request.data);
};
