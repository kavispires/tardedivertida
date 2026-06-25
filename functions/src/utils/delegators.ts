// Constants
import { GAME_NAMES } from './constants';
// Internal
import * as adedanhxEngine from '../games/adedanhx';
import * as arteRuimEngine from '../games/arte-ruim';
import * as bombaRelogioEngine from '../games/bomba-relogio';
import * as colegasDeQuartoEngine from '../games/colegas-de-quarto';
import * as comunicacaoAlienigenaEngine from '../games/comunicacao-alienigena';
import * as comunicacaoDuoEngine from '../games/comunicacao-duo';
import * as contadoresHistoriasEngine from '../games/contadores-historias';
import * as controleDeEstoqueEngine from '../games/controle-de-estoque';
import * as correioDoAmorEngine from '../games/correio-do-amor';
import * as crimesHediondosEngine from '../games/crimes-hediondos';
import * as cruzaPalavrasEngine from '../games/cruza-palavras';
import * as detetivesImaginativosEngine from '../games/detetives-imaginativos';
import * as duetosEngine from '../games/duetos';

// import * as escapeRoomEngine from '../engine/escape-room';
import * as espiaoEntreNosEngine from '../games/espiao-entre-nos';
import * as esquiaresEngine from '../games/esquiadores';
import * as fileiraDeFatosEngine from '../games/fileira-de-fatos';
import * as fofocaQuenteEngine from '../games/fofoca-quente';
import * as galeriaDeSonhosEngine from '../games/galeria-de-sonhos';
import * as idadeDaPreda from '../games/idade-da-preda';
import * as labirintoSecretoEngine from '../games/labirinto-secreto';
import * as linhasCruzadasEngine from '../games/linhas-cruzadas';
import * as medidasNaoExatasEngine from '../games/medidas-nao-exatas';
import * as megamixEngine from '../games/megamix';
import * as menteColetivaEngine from '../games/mente-coletiva';
import * as mesmiceEngine from '../games/mesmice';
import * as metalinguagemEngine from '../games/metalinguagem';
import * as naFilaDoBancoEngine from '../games/na-fila-do-banco';
import * as naRuaDoMedoEngine from '../games/na-rua-do-medo';
import * as naoSouRoboEngine from '../games/nao-sou-robo';
import * as ondaTelepaticaEngine from '../games/onda-telepatica';
import * as planejamentoUrbanoEngine from '../games/planejamento-urbano';
import * as polemicaDaVezEngine from '../games/polemica-da-vez';
import * as portadosDesesperadosEngine from '../games/porta-dos-desesperados';
import * as retratoFaladoEngine from '../games/retrato-falado';
import * as qualQuesitoEngine from '../games/qual-quesito';
import * as quemNaoMataEngine from '../games/quem-nao-mata';
import * as quemSouEuEngine from '../games/quem-sou-eu';
import * as sensoLiterarioEngine from '../games/senso-literario';
import * as sinaisDeAlertaEngine from '../games/sinais-de-alerta';
import * as superCampeonatoEngine from '../games/super-campeonato';
import * as taNaCaraEngine from '../games/ta-na-cara';
import * as teoriaDeConjuntos from '../games/teoria-de-conjuntos';
import * as testemunhaOcularEngine from '../games/testemunha-ocular';
import * as testeDeElencoEngine from '../games/teste-de-elenco';
import * as ueSoIssoEngine from '../games/ue-so-isso';
import * as vamosAoCinemaEngine from '../games/vamos-ao-cinema';
import * as vendavalDePalpiteEngine from '../games/vendaval-de-palpite';
import * as viceCampeaoEngine from '../games/vice-campeao';

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
  // [GAME_NAMES.ESCAPE_ROOM]: escapeRoomEngine,
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
  [GAME_NAMES.QUEM_NAO_MATA]: quemNaoMataEngine,
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
  [GAME_NAMES.VENDAVAL_DE_PALPITE]: vendavalDePalpiteEngine,
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
