import { COMMON_ACTIONS } from './engine/common';
import { CallableRequest } from './types/reference';
import utils from './utils';
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
    return utils.firebase.throwException('Action not provided', 'perform request');
  }

  // Verify auth
  const uid = request.auth?.uid;
  if (!uid) {
    return utils.firebase.throwException('User not authenticated', action);
  }

  // Special case: Load Game cannot require gameName because it only has the ID
  if (action === 'LOAD_GAME' && COMMON_ACTIONS[action]) {
    return COMMON_ACTIONS[action](request.data);
  }

  // Verify gameName
  const gameName = request.data?.gameName;
  if (!gameName) {
    return utils.firebase.throwException('Game name not provided', action);
  }

  // Delegate global actions
  if (COMMON_ACTIONS[action]) {
    return COMMON_ACTIONS[action](request.data, request.auth);
  }

  // Delegate game first, then action
  const engine = getEngine(gameName);
  if (!engine) {
    return utils.firebase.throwException('Invalid game name', action);
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
