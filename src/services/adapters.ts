import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';

export const GAME_API = {
  addPlayer: httpsCallable(functions, 'addPlayer'),
  loadGame: httpsCallable(functions, 'loadGame'),
  makePlayerReady: httpsCallable(functions, 'makePlayerReady'),
  rateGame: httpsCallable(functions, 'rateGame'),
};

export const USER_API = {
  getUser: httpsCallable(functions, 'getUser'),
  getUserById: httpsCallable(functions, 'getUserById'),
  getUsers: httpsCallable(functions, 'getUsers'),
  updateUserDB: httpsCallable(functions, 'updateUserDB'),
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
