import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';

export const USER_API_ACTIONS = {
  GET_USER: 'GET_USER',
  GET_USER_BY_ID: 'GET_USER_BY_ID',
  GET_USERS: 'GET_USERS',
  UPDATE_USER_DB: 'UPDATE_USER_DB',
};

/**
 * User API cloud function v2
 */
export const USER_API = {
  run: httpsCallable(functions, 'userEngine'),
};

export const GAME_API_ACTIONS = {
  ADD_PLAYER: 'ADD_PLAYER',
  LOAD_GAME: 'LOAD_GAME',
  MAKE_PLAYER_READY: 'MAKE_PLAYER_READY',
  RATE_GAME: 'RATE_GAME',
};

export const GAME_API = {
  run: httpsCallable(functions, 'gameActions'),
};

export const DAILY_API_ACTIONS = {
  GET_DAILY: 'GET_DAILY',
  SAVE_DAILY: 'SAVE_DAILY',
  SAVE_DRAWING: 'SAVE_DRAWING',
};

export const DAILY_API = {
  run: httpsCallable(functions, 'dailyActions'),
};

export const ADMIN_API_ACTIONS = {
  CREATE_GAME: 'CREATE_GAME',
  LOCK_GAME: 'LOCK_GAME',
};

export const ADMIN_API = {
  run: httpsCallable(functions, 'adminActions'),
  performAdminAction: httpsCallable(functions, 'performAdminAction'),
};
