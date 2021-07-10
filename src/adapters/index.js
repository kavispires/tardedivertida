import { functions } from '../services/firebase';
import { GAME_COLLECTION } from '../utils/constants';

export const GAME_API = {
  helloWorld: functions.httpsCallable('helloWorld'),
  initializeGame: functions.httpsCallable('initializeGame'),
  loadGame: functions.httpsCallable('loadGame'),
  addPlayer: functions.httpsCallable('addPlayer'),
  lockGame: functions.httpsCallable('lockGame'),
  makeMeReady: functions.httpsCallable('makeMeReady'),
  playAgain: functions.httpsCallable('playAgain'),
  goToNextPhase: functions.httpsCallable('goToNextPhase'),
};

export const ARTE_RUIM_API = {
  submitDrawing: functions.httpsCallable('arteRuimSubmitDrawing'),
  submitVoting: functions.httpsCallable('arteRuimSubmitVoting'),
};

export const CLUBE_DETETIVES_API = {
  submitAction: functions.httpsCallable('clubeDetetivesSubmitAction'),
};

export const ESPIAO_ENTRE_NOS_API = {
  handleAdminAction: functions.httpsCallable('espiaoEntreNosHandleAdminAction'),
  makeAccusation: functions.httpsCallable('espiaoEntreNosMakeAccusation'),
  guessLocation: functions.httpsCallable('espiaoEntreNosGuessLocation'),
  submitVoting: functions.httpsCallable('espiaoEntreNosSubmitVoting'),
};

export const ONDA_TELEPATICA = {
  submitSides: functions.httpsCallable('ondaTelepaticaSubmitSides'),
  submitClue: functions.httpsCallable('ondaTelepaticaSubmitClue'),
  submitGuess: functions.httpsCallable('ondaTelepaticaSubmitGuess'),
  submitRivalGuess: functions.httpsCallable('ondaTelepaticaSubmitRivalGuess'),
};

export const UE_SO_ISSO_API = {
  submitWordSelectionVotes: functions.httpsCallable('ueSoIssoSubmitWordSelectionVotes'),
  submitSuggestions: functions.httpsCallable('ueSoIssoSubmitSuggestions'),
  submitValidation: functions.httpsCallable('ueSoIssoSubmitValidation'),
  confirmGuess: functions.httpsCallable('ueSoIssoConfirmGuess'),
  sendGuess: functions.httpsCallable('ueSoIssoSendGuess'),
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
    case GAME_COLLECTION.ESPIAO_ENTRE_NOS:
      return ESPIAO_ENTRE_NOS_API;
    case GAME_COLLECTION.ONDA_TELEPATICA:
      return ONDA_TELEPATICA;
    case GAME_COLLECTION.UE_SO_ISSO:
      return UE_SO_ISSO_API;
    default:
      throw Error(`Adapter for ${gameName} does not exist`);
  }
};
