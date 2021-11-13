import { GAME_CODES, GAME_COLLECTIONS, GAME_KEYS } from './constants';
import { Engine, GameCode, GameId } from '../utils/interfaces';
import * as arteRuimEngine from '../engine/arte-ruim';
import * as contadoresHistoriasEngine from '../engine/contadores-historias';
import * as detetivesImaginativosEngine from '../engine/detetives-imaginativos';
import * as espiaoEntreNosEngine from '../engine/espiao-entre-nos';
import * as instrumentosCodificadosEngine from '../engine/instrumentos-codificados';
import * as menteColetivaEngine from '../engine/mente-coletiva';
import * as ondaTelepaticaEngine from '../engine/onda-telepatica';
import * as polemicaDaVezEngine from '../engine/polemica-da-vez';
import * as sonhosPesadelosEngine from '../engine/sonhos-pesadelos';
import * as testemunhaOcularEngine from '../engine/testemunha-ocular';
import * as ueSoIssoEngine from '../engine/ue-so-isso';

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
    case GAME_CODES.I:
      return GAME_COLLECTIONS.INSTRUMENTOS_CODIFICADOS;
    case GAME_CODES.M:
      return GAME_COLLECTIONS.MENTE_COLETIVA;
    case GAME_CODES.O:
      return GAME_COLLECTIONS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_COLLECTIONS.POLEMICA_DA_VEZ;
    case GAME_CODES.S:
      return GAME_COLLECTIONS.SONHOS_PESADELOS;
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
    case GAME_CODES.I:
      return GAME_KEYS.INSTRUMENTOS_CODIFICADOS;
    case GAME_CODES.M:
      return GAME_KEYS.MENTE_COLETIVA;
    case GAME_CODES.O:
      return GAME_KEYS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_KEYS.POLEMICA_DA_VEZ;
    case GAME_CODES.S:
      return GAME_KEYS.SONHOS_PESADELOS;
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

export const getEngine = (collectionName: string): Engine => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuimEngine;
    case GAME_COLLECTIONS.CONTADORES_HISTORIAS:
      return contadoresHistoriasEngine;
    case GAME_COLLECTIONS.DETETIVES_IMAGINATIVOS:
      return detetivesImaginativosEngine;
    case GAME_COLLECTIONS.ESPIAO_ENTRE_NOS:
      return espiaoEntreNosEngine;
    case GAME_COLLECTIONS.INSTRUMENTOS_CODIFICADOS:
      return instrumentosCodificadosEngine;
    case GAME_COLLECTIONS.MENTE_COLETIVA:
      return menteColetivaEngine;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepaticaEngine;
    case GAME_COLLECTIONS.POLEMICA_DA_VEZ:
      return polemicaDaVezEngine;
    case GAME_COLLECTIONS.SONHOS_PESADELOS:
      return sonhosPesadelosEngine;
    case GAME_COLLECTIONS.TESTEMUNHA_OCULAR:
      return testemunhaOcularEngine;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIssoEngine;
    default:
      throw new Error(`Collection '${collectionName}' initial state does not exist`);
  }
};
