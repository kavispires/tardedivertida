import { httpsCallable } from 'firebase/functions';
// Services
import { functions } from 'services/firebase';

export const USER_API_ACTIONS = {
  GET_USER: 'GET_USER',
  GET_USER_BY_ID: 'GET_USER_BY_ID',
  GET_USERS: 'GET_USERS',
  UPDATE_USER_DB: 'UPDATE_USER_DB',
} as const;

/**
 * User API cloud function v2
 */
export const USER_API = {
  run: httpsCallable(functions, 'userEngine'),
};

export const DAILY_API_ACTIONS = {
  GET_DAILY: 'GET_DAILY',
  SAVE_DAILY: 'SAVE_DAILY',
  SAVE_DRAWING: 'SAVE_DRAWING',
} as const;

/**
 * Daily API cloud function v2
 */
export const DAILY_API = {
  run: httpsCallable(functions, 'dailyEngine'),
};

export const HOST_API_ACTIONS = {
  CREATE_GAME: 'CREATE_GAME',
  FORCE_END_GAME: 'FORCE_END_GAME',
  FORCE_STATE_PROPERTY: 'FORCE_STATE_PROPERTY',
  GO_TO_NEXT_PHASE: 'GO_TO_NEXT_PHASE',
  LOCK_GAME: 'LOCK_GAME',
  PLAY_AGAIN: 'PLAY_AGAIN',
  RESET_GAME: 'RESET_GAME',
} as const;

/**
 * Host API cloud function v2
 */
export const HOST_API = {
  run: httpsCallable(functions, 'hostEngine'),
};

export const GAME_API_COMMON_ACTIONS = {
  JOIN_GAME: 'JOIN_GAME',
  LOAD_GAME: 'LOAD_GAME',
  MAKE_ME_READY: 'MAKE_ME_READY',
  RATE_GAME: 'RATE_GAME',
} as const;

/**
 * Game API cloud function v2
 */
export const GAME_API = {
  run: httpsCallable(functions, 'gameEngine'),
};
