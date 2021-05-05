import { functions } from '../services/firebase';

export const GAME_API = {
  helloWorld: functions.httpsCallable('helloWorld'),
  initializeGame: functions.httpsCallable('initializeGame'),
  loadGame: functions.httpsCallable('loadGame'),
  addPlayer: functions.httpsCallable('addPlayer'),
  lockGame: functions.httpsCallable('lockGame'),
};

export const ARTE_RUIM_API = {
  makeMeReady: functions.httpsCallable('arteRuimMakeMeReady'),
  submitDrawing: functions.httpsCallable('arteRuimSubmitDrawing'),
  submitVoting: functions.httpsCallable('arteRuimSubmitVoting'),
  submitRating: functions.httpsCallable('arteRuimSubmitRating'),
  goToNextPhase: functions.httpsCallable('arteRuimGoToNextPhase'),
};
