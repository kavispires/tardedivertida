import { GAME_NAMES } from './constants';
import * as arteRuimEngine from '../engine/arte-ruim';
import * as comunicacaoAlienigenaEngine from '../engine/comunicacao-alienigena';
import * as contadoresHistoriasEngine from '../engine/contadores-historias';
import * as crimesHediondosEngine from '../engine/crimes-hediondos';
import * as cruzaPalavrasEngine from '../engine/cruza-palavras';
import * as detetivesImaginativosEngine from '../engine/detetives-imaginativos';
import * as espiaoEntreNosEngine from '../engine/espiao-entre-nos';
import * as galeriaDeSonhosEngine from '../engine/galeria-de-sonhos';
import * as portadosDesesperadosEngine from '../engine/porta-dos-desesperados';
import * as linhasCruzadasEngine from '../engine/linhas-cruzadas';
import * as megamixEngine from '../engine/megamix';
import * as menteColetivaEngine from '../engine/mente-coletiva';
import * as naRuaDoMedoEngine from '../engine/na-rua-do-medo';
import * as ondaTelepaticaEngine from '../engine/onda-telepatica';
import * as polemicaDaVezEngine from '../engine/polemica-da-vez';
import * as retratoFaladoEngine from '../engine/retrato-falado';
import * as quemNaoMataEngine from '../engine/quem-nao-mata';
import * as quemSouEuEngine from '../engine/quem-sou-eu';
import * as sonhosPesadelosEngine from '../engine/sonhos-pesadelos';
import * as superCampeonatoEngine from '../engine/super-campeonato';
import * as testemunhaOcularEngine from '../engine/testemunha-ocular';
import * as trevoDaSorteEngine from '../engine/trevo-da-sorte';
import * as ueSoIssoEngine from '../engine/ue-so-isso';
import * as vamosAoCinemaEngine from '../engine/vamos-ao-cinema';
import * as vendavalDePalpiteEngine from '../engine/vendaval-de-palpite';

/**
 *
 * @param gameName
 * @returns
 */
export const getEngine = (gameName: string): Engine => {
  switch (gameName) {
    case GAME_NAMES.ARTE_RUIM:
      return arteRuimEngine;
    case GAME_NAMES.COMUNICACAO_ALIENIGENA:
      return comunicacaoAlienigenaEngine;
    case GAME_NAMES.CONTADORES_HISTORIAS:
      return contadoresHistoriasEngine;
    case GAME_NAMES.CRIMES_HEDIONDOS:
      return crimesHediondosEngine;
    case GAME_NAMES.CRUZA_PALAVRAS:
      return cruzaPalavrasEngine;
    case GAME_NAMES.DETETIVES_IMAGINATIVOS:
      return detetivesImaginativosEngine;
    case GAME_NAMES.ESPIAO_ENTRE_NOS:
      return espiaoEntreNosEngine;
    case GAME_NAMES.GALERIA_DE_SONHOS:
      return galeriaDeSonhosEngine;
    case GAME_NAMES.PORTA_DOS_DESESPERADOS:
      return portadosDesesperadosEngine;
    case GAME_NAMES.LINHAS_CRUZADAS:
      return linhasCruzadasEngine;
    case GAME_NAMES.MEGAMIX:
      return megamixEngine;
    case GAME_NAMES.MENTE_COLETIVA:
      return menteColetivaEngine;
    case GAME_NAMES.NA_RUA_DO_MEDO:
      return naRuaDoMedoEngine;
    case GAME_NAMES.ONDA_TELEPATICA:
      return ondaTelepaticaEngine;
    case GAME_NAMES.POLEMICA_DA_VEZ:
      return polemicaDaVezEngine;
    case GAME_NAMES.QUEM_NAO_MATA:
      return quemNaoMataEngine;
    case GAME_NAMES.QUEM_SOU_EU:
      return quemSouEuEngine;
    case GAME_NAMES.RETRATO_FALADO:
      return retratoFaladoEngine;
    case GAME_NAMES.SONHOS_PESADELOS:
      return sonhosPesadelosEngine;
    case GAME_NAMES.SUPER_CAMPEONATO:
      return superCampeonatoEngine;
    case GAME_NAMES.TESTEMUNHA_OCULAR:
      return testemunhaOcularEngine;
    case GAME_NAMES.TREVO_DA_SORTE:
      return trevoDaSorteEngine;
    case GAME_NAMES.UE_SO_ISSO:
      return ueSoIssoEngine;
    case GAME_NAMES.VAMOS_AO_CINEMA:
      return vamosAoCinemaEngine;
    case GAME_NAMES.VENDAVAL_DE_PALPITE:
      return vendavalDePalpiteEngine;
    default:
      throw new Error(`Collection '${gameName}' initial state does not exist`);
  }
};
