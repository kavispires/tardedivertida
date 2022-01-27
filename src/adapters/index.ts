import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';

export const GAME_API = {
  loadGame: httpsCallable(functions, 'loadGame'),
  addPlayer: httpsCallable(functions, 'addPlayer'),
  makePlayerReady: httpsCallable(functions, 'makePlayerReady'),
  rateGame: httpsCallable(functions, 'rateGame'),
};

export const ADMIN_API = {
  createGame: httpsCallable(functions, 'createGame'),
  lockGame: httpsCallable(functions, 'lockGame'),
  performAdminAction: httpsCallable(functions, 'performAdminAction'),
};

export const ARTE_RUIM_API = {
  submitAction: httpsCallable(functions, 'arteRuimSubmitAction'),
};

export const CONTADORES_HISTORIAS_API = {
  submitAction: httpsCallable(functions, 'contadoresHistoriasSubmitAction'),
};

export const DETETIVES_IMAGINATIVOS_API = {
  submitAction: httpsCallable(functions, 'detetivesImaginativosSubmitAction'),
};

export const ESPIAO_ENTRE_NOS_API = {
  handleAdminAction: httpsCallable(functions, 'espiaoEntreNosHandleAdminAction'),
  makeAccusation: httpsCallable(functions, 'espiaoEntreNosMakeAccusation'),
  guessLocation: httpsCallable(functions, 'espiaoEntreNosGuessLocation'),
  submitVoting: httpsCallable(functions, 'espiaoEntreNosSubmitVoting'),
};

export const GALERIA_DE_SONHOS_API = {
  submitAction: httpsCallable(functions, 'galeriaDeSonhosSubmitAction'),
};

export const CRIMES_HEDIONDOS_API = {
  submitAction: httpsCallable(functions, 'crimesHediondosSubmitAction'),
};

export const INSTRUMENTOS_CODIFICADOS_API = {
  submitAction: httpsCallable(functions, 'instrumentosCodificadosSubmitAction'),
};

export const MENTE_COLETIVA_API = {
  submitAction: httpsCallable(functions, 'menteColetivaSubmitAction'),
};

export const ONDA_TELEPATICA_API = {
  submitAction: httpsCallable(functions, 'ondaTelepaticaSubmitAction'),
};

export const POLEMICA_DA_VEZ_API = {
  submitAction: httpsCallable(functions, 'polemicaDaVezSubmitAction'),
};

export const RETRATO_FALADO_API = {
  submitAction: httpsCallable(functions, 'retratoFaladoSubmitAction'),
};

export const SONHOS_PESADELOS_API = {
  submitAction: httpsCallable(functions, 'sonhosPesadelosSubmitAction'),
};

export const TESTEMUNHA_OCULAR_API = {
  submitAction: httpsCallable(functions, 'testemunhaOcularSubmitAction'),
};

export const UE_SO_ISSO_API = {
  submitAction: httpsCallable(functions, 'ueSoIssoSubmitAction'),
};

export const CRUZA_PALAVRAS_API = {
  submitAction: httpsCallable(functions, 'cruzaPalavrasSubmitAction'),
};
