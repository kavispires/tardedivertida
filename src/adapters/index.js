import { functions } from '../services/firebase';

export const GAME_API = {
  helloWorld: functions.httpsCallable('helloWorld'),
  initializeGame: functions.httpsCallable('initializeGame'),
  loadGame: functions.httpsCallable('loadGame'),
  addPlayer: functions.httpsCallable('addPlayer'),
  lockGame: functions.httpsCallable('lockGame'),
};
