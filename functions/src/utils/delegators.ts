import { GAME_CODES, GAME_COLLECTIONS, GAME_KEYS } from './constants';
import * as arteRuimEngine from '../engine/arte-ruim';
import * as contadoresHistoriasEngine from '../engine/contadores-historias';
import * as detetivesImaginativosEngine from '../engine/detetives-imaginativos';
import * as espiaoEntreNosEngine from '../engine/espiao-entre-nos';
import * as galeriaDeSonhosEngine from '../engine/galeria-de-sonhos';
import * as crimesHediondosEngine from '../engine/crimes-hediondos';
import * as portadosDesesperadosEngine from '../engine/porta-dos-desesperados';
import * as linhasCruzadasEngine from '../engine/linhas-cruzadas';
import * as menteColetivaEngine from '../engine/mente-coletiva';
import * as naRuaDoMedoEngine from '../engine/na-rua-do-medo';
import * as ondaTelepaticaEngine from '../engine/onda-telepatica';
import * as polemicaDaVezEngine from '../engine/polemica-da-vez';
import * as retratoFaladoEngine from '../engine/retrato-falado';
import * as quemNaoMataEngine from '../engine/quem-nao-mata';
import * as sonhosPesadelosEngine from '../engine/sonhos-pesadelos';
import * as testemunhaOcularEngine from '../engine/testemunha-ocular';
import * as ueSoIssoEngine from '../engine/ue-so-isso';
import * as vendavalDePalpiteEngine from '../engine/vendaval-de-palpite';
import * as superCampeonatoEngine from '../engine/super-campeonato';
import * as cruzaPalavrasEngine from '../engine/cruza-palavras';
import * as trevoDaSorteEngine from '../engine/trevo-da-sorte';

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
    case GAME_CODES.G:
      return GAME_COLLECTIONS.GALERIA_DE_SONHOS;
    case GAME_CODES.H:
      return GAME_COLLECTIONS.CRIMES_HEDIONDOS;
    case GAME_CODES.I:
      return GAME_COLLECTIONS.PORTA_DOS_DESESPERADOS;
    case GAME_CODES.L:
      return GAME_COLLECTIONS.LINHAS_CRUZADAS;
    case GAME_CODES.M:
      return GAME_COLLECTIONS.MENTE_COLETIVA;
    case GAME_CODES.N:
      return GAME_COLLECTIONS.NA_RUA_DO_MEDO;
    case GAME_CODES.O:
      return GAME_COLLECTIONS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_COLLECTIONS.POLEMICA_DA_VEZ;
    case GAME_CODES.Q:
      return GAME_COLLECTIONS.QUEM_NAO_MATA;
    case GAME_CODES.R:
      return GAME_COLLECTIONS.RETRATO_FALADO;
    case GAME_CODES.S:
      return GAME_COLLECTIONS.SONHOS_PESADELOS;
    case GAME_CODES.T:
      return GAME_COLLECTIONS.TESTEMUNHA_OCULAR;
    case GAME_CODES.U:
      return GAME_COLLECTIONS.UE_SO_ISSO;
    case GAME_CODES.V:
      return GAME_COLLECTIONS.VENDAVAL_DE_PALPITE;
    case GAME_CODES.W:
      return GAME_COLLECTIONS.SUPER_CAMPEONATO;
    case GAME_CODES.X:
      return GAME_COLLECTIONS.CRUZA_PALAVRAS;
    case GAME_CODES.Y:
      return GAME_COLLECTIONS.TREVO_DA_SORTE;

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
    case GAME_CODES.G:
      return GAME_KEYS.GALERIA_DE_SONHOS;
    case GAME_CODES.H:
      return GAME_KEYS.CRIMES_HEDIONDOS;
    case GAME_CODES.I:
      return GAME_KEYS.PORTA_DOS_DESESPERADOS;
    case GAME_CODES.L:
      return GAME_KEYS.LINHAS_CRUZADAS;
    case GAME_CODES.M:
      return GAME_KEYS.MENTE_COLETIVA;
    case GAME_CODES.N:
      return GAME_KEYS.NA_RUA_DO_MEDO;
    case GAME_CODES.O:
      return GAME_KEYS.ONDA_TELEPATICA;
    case GAME_CODES.P:
      return GAME_KEYS.POLEMICA_DA_VEZ;
    case GAME_CODES.Q:
      return GAME_KEYS.QUEM_NAO_MATA;
    case GAME_CODES.R:
      return GAME_KEYS.RETRATO_FALADO;
    case GAME_CODES.S:
      return GAME_KEYS.SONHOS_PESADELOS;
    case GAME_CODES.T:
      return GAME_KEYS.TESTEMUNHA_OCULAR;
    case GAME_CODES.U:
      return GAME_KEYS.UE_SO_ISSO;
    case GAME_CODES.V:
      return GAME_KEYS.VENDAVAL_DE_PALPITE;
    case GAME_CODES.W:
      return GAME_KEYS.SUPER_CAMPEONATO;
    case GAME_CODES.X:
      return GAME_KEYS.CRUZA_PALAVRAS;
    case GAME_CODES.Y:
      return GAME_KEYS.TREVO_DA_SORTE;
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
 *
 * @param collectionName
 * @returns
 */
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
    case GAME_COLLECTIONS.GALERIA_DE_SONHOS:
      return galeriaDeSonhosEngine;
    case GAME_COLLECTIONS.CRIMES_HEDIONDOS:
      return crimesHediondosEngine;
    case GAME_COLLECTIONS.PORTA_DOS_DESESPERADOS:
      return portadosDesesperadosEngine;
    case GAME_COLLECTIONS.LINHAS_CRUZADAS:
      return linhasCruzadasEngine;
    case GAME_COLLECTIONS.MENTE_COLETIVA:
      return menteColetivaEngine;
    case GAME_COLLECTIONS.NA_RUA_DO_MEDO:
      return naRuaDoMedoEngine;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepaticaEngine;
    case GAME_COLLECTIONS.POLEMICA_DA_VEZ:
      return polemicaDaVezEngine;
    case GAME_COLLECTIONS.QUEM_NAO_MATA:
      return quemNaoMataEngine;
    case GAME_COLLECTIONS.RETRATO_FALADO:
      return retratoFaladoEngine;
    case GAME_COLLECTIONS.SONHOS_PESADELOS:
      return sonhosPesadelosEngine;
    case GAME_COLLECTIONS.TESTEMUNHA_OCULAR:
      return testemunhaOcularEngine;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIssoEngine;
    case GAME_COLLECTIONS.VENDAVAL_DE_PALPITE:
      return vendavalDePalpiteEngine;
    case GAME_COLLECTIONS.SUPER_CAMPEONATO:
      return superCampeonatoEngine;
    case GAME_COLLECTIONS.CRUZA_PALAVRAS:
      return cruzaPalavrasEngine;
    case GAME_COLLECTIONS.TREVO_DA_SORTE:
      return trevoDaSorteEngine;
    default:
      throw new Error(`Collection '${collectionName}' initial state does not exist`);
  }
};
