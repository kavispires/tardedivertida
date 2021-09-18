import { functions } from '../services/firebase';

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

export const CONTADORES_HISTORIAS_API = {
  submitAction: functions.httpsCallable('contadoresHistoriasSubmitAction'),
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
};

export const ONDA_TELEPATICA_API = {
  submitSides: functions.httpsCallable('ondaTelepaticaSubmitSides'),
  submitClue: functions.httpsCallable('ondaTelepaticaSubmitClue'),
  submitGuess: functions.httpsCallable('ondaTelepaticaSubmitGuess'),
  submitRivalGuess: functions.httpsCallable('ondaTelepaticaSubmitRivalGuess'),
};

export const POLEMICA_DA_VEZ_API = {
  submitAction: functions.httpsCallable('polemicaDaVezSubmitAction'),
};

export const SONHOS_PESADELOS_API = {
  submitAction: functions.httpsCallable('sonhosPesadelosSubmitAction'),
};

export const TESTEMUNHA_OCULAR_API = {
  submitAction: functions.httpsCallable('testemunhaOcularSubmitAction'),
};

export const UE_SO_ISSO_API = {
  submitAction: functions.httpsCallable('ueSoIssoSubmitAction'),
};
