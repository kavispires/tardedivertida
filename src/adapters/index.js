import { functions } from '../services/firebase';
import { GAME_COLLECTION } from '../utils/constants';

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

export const UE_SO_ISSO_API = {
  makeMeReady: functions.httpsCallable('ueSoIssoMakeMeReady'),
  submitWordSelectionVotes: functions.httpsCallable('ueSoIssoSubmitWordSelectionVotes'),
  submitSuggestions: functions.httpsCallable('ueSoIssoSubmitSuggestions'),
  submitValidation: functions.httpsCallable('ueSoIssoSubmitValidation'),
  confirmGuess: functions.httpsCallable('ueSoIssoConfirmGuess'),
};

/**
 * Gets the game specific API http functions
 * @param {string} gameName
 * @returns
 */
export const getAPI = (gameName) => {
  switch (gameName) {
    case GAME_COLLECTION.ARTE_RUIM:
      return ARTE_RUIM_API;
    case GAME_COLLECTION.UE_SO_ISSO:
      return UE_SO_ISSO_API;
    default:
      throw Error(`Adapter for ${gameName} does not exist`);
  }
};
