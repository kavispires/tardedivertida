import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';

export const GAME_API = {
  addPlayer: httpsCallable(functions, 'addPlayer'),
  loadGame: httpsCallable(functions, 'loadGame'),
  makePlayerReady: httpsCallable(functions, 'makePlayerReady'),
  rateGame: httpsCallable(functions, 'rateGame'),
};

export const USER_API_ACTIONS = {
  GET_USER: 'GET_USER',
  GET_USER_BY_ID: 'GET_USER_BY_ID',
  GET_USERS: 'GET_USERS',
  UPDATE_USER_DB: 'UPDATE_USER_DB',
};

export const USER_API = {
  run: httpsCallable(functions, 'userActions'),
};

export const DAILY_API = {
  getDaily: httpsCallable(functions, 'getDaily'),
  saveDaily: httpsCallable(functions, 'saveDaily'),
};

export const ADMIN_API = {
  createGame: httpsCallable(functions, 'createGame'),
  lockGame: httpsCallable(functions, 'lockGame'),
  performAdminAction: httpsCallable(functions, 'performAdminAction'),
};
