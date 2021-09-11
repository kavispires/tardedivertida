import { GAME_CODES, GAME_COLLECTIONS, GAME_KEYS } from './constants';
import { GameCode, GameId } from '../utils/interfaces';
import { getInitialState as arteRuimGetInitialState, nextArteRuimPhase } from '../engine/arte-ruim';
import {
  getInitialState as ContadoresHistoriasInitialState,
  nextContadoresHistoriasPhase,
} from '../engine/contadores-historias';
import {
  getInitialState as detetivesImaginativosGetInitialState,
  nextDetetivesImaginativosPhase,
} from '../engine/detetives-imaginativos';
import {
  getInitialState as espiaoEntreNosGetInitialState,
  nextEspiaoEntreNosPhase,
} from '../engine/espiao-entre-nos';
import {
  getInitialState as menteColetivaGetInitialState,
  nextMenteColetivaPhase,
} from '../engine/mente-coletiva';
import {
  getInitialState as ondaTelepaticaGetInitialState,
  nextOndaTelepaticaPhase,
} from '../engine/onda-telepatica';
import {
  getInitialState as polemicaDaVezGetInitialState,
  nextPolemicaDaVezPhase,
} from '../engine/polemica-da-vez';
import {
  getInitialState as testemunhaOcularGetInitialState,
  nextTestemunhaOcularPhase,
} from '../engine/testemunha-ocular';
import { getInitialState as ueSoIssoGetInitialState, nextUeSoIssoPhase } from '../engine/ue-so-isso';

/**
 * Get collection name by single letter game code
 * @param gameCode
 * @returns
 */
export const getCollectionNameByGameCode = (gameCode: GameCode): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_COLLECTIONS.ARTE_RUIM;
    case GAME_CODES.C:
      return GAME_COLLECTIONS.CONTADORES_HISTORIAS;
    case GAME_CODES.D:
      return GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS;
    case GAME_CODES.E:
      return GAME_COLLECTIONS.ESPIAO_ENTRE_NOS;
    case GAME_CODES.M:
      return GAME_COLLECTIONS.MENTE_COLETIVA;
    case GAME_CODES.O:
      return GAME_COLLECTIONS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_COLLECTIONS.POLEMICA_DA_VEZ;
    case GAME_CODES.T:
      return GAME_COLLECTIONS.TESTEMUNHA_OCULAR;
    case GAME_CODES.U:
      return GAME_COLLECTIONS.UE_SO_ISSO;
    default:
      return null;
  }
};

/**
 * Get collection internal key by single letter game code
 * @param gameCode
 * @returns
 */
export const getCollectionKeyByGameCode = (gameCode: GameCode): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_KEYS.ARTE_RUIM;
    case GAME_CODES.C:
      return GAME_KEYS.CONTADORES_HISTORIAS;
    case GAME_CODES.D:
      return GAME_KEYS.DETETIVES_IMAGINATIVOS;
    case GAME_CODES.E:
      return GAME_KEYS.ESPIAO_ENTRE_NOS;
    case GAME_CODES.M:
      return GAME_KEYS.MENTE_COLETIVA;
    case GAME_CODES.O:
      return GAME_KEYS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_KEYS.POLEMICA_DA_VEZ;
    case GAME_CODES.T:
      return GAME_KEYS.TESTEMUNHA_OCULAR;
    case GAME_CODES.U:
      return GAME_KEYS.UE_SO_ISSO;
    default:
      return null;
  }
};

/**
 * Get collection name by extracting the first letter of a game id
 * @param {string} gameId
 */
export const getCollectionNameByGameId = (gameId: GameId): string | null => {
  return getCollectionNameByGameCode(gameId[0]);
};

/**
 * Get the initial state from game collection
 * @param collectionName
 * @returns
 */
export const getInitialStateForCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuimGetInitialState;
    case GAME_COLLECTIONS.CONTADORES_HISTORIAS:
      return ContadoresHistoriasInitialState;
    case GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS:
      return detetivesImaginativosGetInitialState;
    case GAME_COLLECTIONS.ESPIAO_ENTRE_NOS:
      return espiaoEntreNosGetInitialState;
    case GAME_COLLECTIONS.MENTE_COLETIVA:
      return menteColetivaGetInitialState;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepaticaGetInitialState;
    case GAME_COLLECTIONS.POLEMICA_DA_VEZ:
      return polemicaDaVezGetInitialState;
    case GAME_COLLECTIONS.TESTEMUNHA_OCULAR:
      return testemunhaOcularGetInitialState;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIssoGetInitialState;
    default:
      throw new Error(`Collection '${collectionName}' initial state does not exist`);
  }
};

/**
 * Get the next phase delegator from game collection
 * @param collectionName
 * @returns
 */
export const getNextPhaseForCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_KEYS.ARTE_RUIM:
      return nextArteRuimPhase;
    case GAME_KEYS.CONTADORES_HISTORIAS:
      return nextContadoresHistoriasPhase;
    case GAME_KEYS.DETETIVES_IMAGINATIVOS:
      return nextDetetivesImaginativosPhase;
    case GAME_KEYS.ESPIAO_ENTRE_NOS:
      return nextEspiaoEntreNosPhase;
    case GAME_KEYS.MENTE_COLETIVA:
      return nextMenteColetivaPhase;
    case GAME_KEYS.ONDA_TELEPATICA:
      return nextOndaTelepaticaPhase;
    case GAME_KEYS.POLEMICA_DA_VEZ:
      return nextPolemicaDaVezPhase;
    case GAME_KEYS.TESTEMUNHA_OCULAR:
      return nextTestemunhaOcularPhase;
    case GAME_KEYS.UE_SO_ISSO:
      return nextUeSoIssoPhase;
    default:
      throw new Error(`Collection '${collectionName}' phase delegator does not exist`);
  }
};
