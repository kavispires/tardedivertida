import { functions } from '../services/firebase';
import { GAME_COLLECTION } from '../utils/constants';

export const GAME_API = {
  helloWorld: functions.httpsCallable('helloWorld'),
  initializeGame: functions.httpsCallable('initializeGame'),
  loadGame: functions.httpsCallable('loadGame'),
  addPlayer: functions.httpsCallable('addPlayer'),
  lockGame: functions.httpsCallable('lockGame'),
  makePlayerReady: functions.httpsCallable('makePlayerReady'),
  playAgain: functions.httpsCallable('playAgain'),
  goToNextPhase: functions.httpsCallable('goToNextPhase'),
  forceStateProperty: functions.httpsCallable('forceStateProperty'),
};

export const ARTE_RUIM_API = {
  submitAction: functions.httpsCallable('arteRuimSubmitAction'),
};

export const DETETIVES_IMAGINATIVOS_API = {
  submitAction: functions.httpsCallable('detetivesImaginativosSubmitAction'),
};

export const ESPIAO_ENTRE_NOS_API = {
  handleAdminAction: functions.httpsCallable('espiaoEntreNosHandleAdminAction'),
  makeAccusation: functions.httpsCallable('espiaoEntreNosMakeAccusation'),
  guessLocation: functions.httpsCallable('espiaoEntreNosGuessLocation'),
  submitVoting: functions.httpsCallable('espiaoEntreNosSubmitVoting'),
};

export const MENTE_COLETIVA_API = {
  submitAction: functions.httpsCallable('menteColetivaSubmitAction'),
  updateAction: functions.httpsCallable('menteColetivaUpdateAction'),
};

export const ONDA_TELEPATICA_API = {
  submitSides: functions.httpsCallable('ondaTelepaticaSubmitSides'),
  submitClue: functions.httpsCallable('ondaTelepaticaSubmitClue'),
  submitGuess: functions.httpsCallable('ondaTelepaticaSubmitGuess'),
  submitRivalGuess: functions.httpsCallable('ondaTelepaticaSubmitRivalGuess'),
};

export const TESTEMUNHA_OCULAR_API = {
  submitAction: functions.httpsCallable('testemunhaOcularSubmitAction'),
};

export const UE_SO_ISSO_API = {
  submitAction: functions.httpsCallable('ueSoIssoSubmitAction'),
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
      return ONDA_TELEPATICA_API;
    case GAME_COLLECTION.TESTEMUNHA_OCULAR:
      return TESTEMUNHA_OCULAR_API;
    case GAME_COLLECTION.UE_SO_ISSO:
      return UE_SO_ISSO_API;
    default:
      throw Error(`Adapter for ${gameName} does not exist`);
  }
};
