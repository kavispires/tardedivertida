// Constants
import { GAME_NAMES } from '../constants/games';
// Internal
import * as adedanhxEngine from './adedanhx';
import * as arteRuimEngine from './arte-ruim';
import * as bombaRelogioEngine from './bomba-relogio';
import * as colegasDeQuartoEngine from './colegas-de-quarto';
import * as comunicacaoAlienigenaEngine from './comunicacao-alienigena';
import * as comunicacaoDuoEngine from './comunicacao-duo';
import * as contadoresHistoriasEngine from './contadores-historias';
import * as controleDeEstoqueEngine from './controle-de-estoque';
import * as correioDoAmorEngine from './correio-do-amor';
import * as crimesHediondosEngine from './crimes-hediondos';
import * as cruzaPalavrasEngine from './cruza-palavras';
import * as detetivesImaginativosEngine from './detetives-imaginativos';
import * as duetosEngine from './duetos';
import * as espiaoEntreNosEngine from './espiao-entre-nos';
import * as esquiaresEngine from './esquiadores';
import * as fileiraDeFatosEngine from './fileira-de-fatos';
import * as fofocaQuenteEngine from './fofoca-quente';
import * as galeriaDeSonhosEngine from './galeria-de-sonhos';
import * as idadeDaPreda from './idade-da-preda';
import * as labirintoSecretoEngine from './labirinto-secreto';
import * as linhasCruzadasEngine from './linhas-cruzadas';
import * as medidasNaoExatasEngine from './medidas-nao-exatas';
import * as megamixEngine from './megamix';
import * as menteColetivaEngine from './mente-coletiva';
import * as mesmiceEngine from './mesmice';
import * as metalinguagemEngine from './metalinguagem';
import * as naFilaDoBancoEngine from './na-fila-do-banco';
import * as naRuaDoMedoEngine from './na-rua-do-medo';
import * as naoSouRoboEngine from './nao-sou-robo';
import * as ondaTelepaticaEngine from './onda-telepatica';
import * as planejamentoUrbanoEngine from './planejamento-urbano';
import * as polemicaDaVezEngine from './polemica-da-vez';
import * as portadosDesesperadosEngine from './porta-dos-desesperados';
import * as qualQuesitoEngine from './qual-quesito';
import * as quemSouEuEngine from './quem-sou-eu';
import * as retratoFaladoEngine from './retrato-falado';
import * as sensoLiterarioEngine from './senso-literario';
import * as sinaisDeAlertaEngine from './sinais-de-alerta';
import * as superCampeonatoEngine from './super-campeonato';
import * as taNaCaraEngine from './ta-na-cara';
import * as teoriaDeConjuntos from './teoria-de-conjuntos';
import * as testeDeElencoEngine from './teste-de-elenco';
import * as testemunhaOcularEngine from './testemunha-ocular';
import * as ueSoIssoEngine from './ue-so-isso';
import * as vamosAoCinemaEngine from './vamos-ao-cinema';
import * as viceCampeaoEngine from './vice-campeao';

const engines = {
  [GAME_NAMES.ADEDANHX]: adedanhxEngine,
  [GAME_NAMES.ARTE_RUIM]: arteRuimEngine,
  [GAME_NAMES.BOMBA_RELOGIO]: bombaRelogioEngine,
  [GAME_NAMES.COLEGAS_DE_QUARTO]: colegasDeQuartoEngine,
  [GAME_NAMES.COMUNICACAO_ALIENIGENA]: comunicacaoAlienigenaEngine,
  [GAME_NAMES.COMUNICACAO_DUO]: comunicacaoDuoEngine,
  [GAME_NAMES.CONTADORES_HISTORIAS]: contadoresHistoriasEngine,
  [GAME_NAMES.CONTROLE_DE_ESTOQUE]: controleDeEstoqueEngine,
  [GAME_NAMES.CORREIO_DO_AMOR]: correioDoAmorEngine,
  [GAME_NAMES.CRIMES_HEDIONDOS]: crimesHediondosEngine,
  [GAME_NAMES.CRUZA_PALAVRAS]: cruzaPalavrasEngine,
  [GAME_NAMES.DETETIVES_IMAGINATIVOS]: detetivesImaginativosEngine,
  [GAME_NAMES.DUETOS]: duetosEngine,
  [GAME_NAMES.ESPIAO_ENTRE_NOS]: espiaoEntreNosEngine,
  [GAME_NAMES.ESQUIADORES]: esquiaresEngine,
  [GAME_NAMES.FOFOCA_QUENTE]: fofocaQuenteEngine,
  [GAME_NAMES.FILEIRA_DE_FATOS]: fileiraDeFatosEngine,
  [GAME_NAMES.GALERIA_DE_SONHOS]: galeriaDeSonhosEngine,
  [GAME_NAMES.IDADE_DA_PREDA]: idadeDaPreda,
  [GAME_NAMES.LABIRINTO_SECRETO]: labirintoSecretoEngine,
  [GAME_NAMES.LINHAS_CRUZADAS]: linhasCruzadasEngine,
  [GAME_NAMES.MEDIDAS_NAO_EXATAS]: medidasNaoExatasEngine,
  [GAME_NAMES.MEGAMIX]: megamixEngine,
  [GAME_NAMES.MENTE_COLETIVA]: menteColetivaEngine,
  [GAME_NAMES.MESMICE]: mesmiceEngine,
  [GAME_NAMES.METALINGUAGEM]: metalinguagemEngine,
  [GAME_NAMES.NA_RUA_DO_MEDO]: naRuaDoMedoEngine,
  [GAME_NAMES.NAO_SOU_ROBO]: naoSouRoboEngine,
  [GAME_NAMES.NA_FILA_DO_BANCO]: naFilaDoBancoEngine,
  [GAME_NAMES.ONDA_TELEPATICA]: ondaTelepaticaEngine,
  [GAME_NAMES.PLANEJAMENTO_URBANO]: planejamentoUrbanoEngine,
  [GAME_NAMES.PORTA_DOS_DESESPERADOS]: portadosDesesperadosEngine,
  [GAME_NAMES.POLEMICA_DA_VEZ]: polemicaDaVezEngine,
  [GAME_NAMES.QUAL_QUESITO]: qualQuesitoEngine,
  [GAME_NAMES.QUEM_SOU_EU]: quemSouEuEngine,
  [GAME_NAMES.RETRATO_FALADO]: retratoFaladoEngine,
  [GAME_NAMES.SENSO_LITERARIO]: sensoLiterarioEngine,
  [GAME_NAMES.SINAIS_DE_ALERTA]: sinaisDeAlertaEngine,
  [GAME_NAMES.SUPER_CAMPEONATO]: superCampeonatoEngine,
  [GAME_NAMES.TA_NA_CARA]: taNaCaraEngine,
  [GAME_NAMES.TEORIA_DE_CONJUNTOS]: teoriaDeConjuntos,
  [GAME_NAMES.TESTEMUNHA_OCULAR]: testemunhaOcularEngine,
  [GAME_NAMES.TESTE_DE_ELENCO]: testeDeElencoEngine,
  [GAME_NAMES.UE_SO_ISSO]: ueSoIssoEngine,
  [GAME_NAMES.VAMOS_AO_CINEMA]: vamosAoCinemaEngine,
  [GAME_NAMES.VICE_CAMPEAO]: viceCampeaoEngine,
};

/**
 * Retrieves the engine for a given game name.
 *
 * @param gameName - The name of the game.
 * @returns The engine associated with the game name.
 * @throws Error if the collection for the game name does not exist.
 */
export const getEngine = (gameName: string): Engine => {
  const engine = engines?.[gameName];
  if (engine) {
    return engine;
  }

  throw new Error(`Engine for '${gameName}' does not exist`);
};
