import { GAME_NAMES } from './constants';
import * as adedanhxEngine from '../engine/adedanhx';
import * as arteRuimEngine from '../engine/arte-ruim';
import * as comunicacaoAlienigenaEngine from '../engine/comunicacao-alienigena';
import * as comunicacaoDuoEngine from '../engine/comunicacao-duo';
import * as contadoresHistoriasEngine from '../engine/contadores-historias';
import * as controleDeEstoqueEngine from '../engine/controle-de-estoque';
import * as crimesHediondosEngine from '../engine/crimes-hediondos';
import * as cruzaPalavrasEngine from '../engine/cruza-palavras';
import * as detetivesImaginativosEngine from '../engine/detetives-imaginativos';
import * as duetosEngine from '../engine/duetos';
import * as espiaoEntreNosEngine from '../engine/espiao-entre-nos';
import * as esquiaresEngine from '../engine/esquiadores';
import * as fileiraDeFatosEngine from '../engine/fileira-de-fatos';
import * as fofocaQuenteEngine from '../engine/fofoca-quente';
import * as galeriaDeSonhosEngine from '../engine/galeria-de-sonhos';
import * as idadeDaPreda from '../engine/idade-da-preda';
import * as labirintoSecretoEngine from '../engine/labirinto-secreto';
import * as linhasCruzadasEngine from '../engine/linhas-cruzadas';
import * as medidasNaoExatasEngine from '../engine/medidas-nao-exatas';
import * as megamixEngine from '../engine/megamix';
import * as menteColetivaEngine from '../engine/mente-coletiva';
import * as mesmiceEngine from '../engine/mesmice';
import * as metalinguagemEngine from '../engine/metalinguagem';
import * as naRuaDoMedoEngine from '../engine/na-rua-do-medo';
import * as naoSouRoboEngine from '../engine/nao-sou-robo';
import * as ondaTelepaticaEngine from '../engine/onda-telepatica';
import * as planejamentoUrbanoEngine from '../engine/planejamento-urbano';
import * as polemicaDaVezEngine from '../engine/polemica-da-vez';
import * as portadosDesesperadosEngine from '../engine/porta-dos-desesperados';
import * as retratoFaladoEngine from '../engine/retrato-falado';
import * as quemNaoMataEngine from '../engine/quem-nao-mata';
import * as quemSouEuEngine from '../engine/quem-sou-eu';
import * as sinaisDeAlertaEngine from '../engine/sinais-de-alerta';
import * as sonhosPesadelosEngine from '../engine/sonhos-pesadelos';
import * as superCampeonatoEngine from '../engine/super-campeonato';
import * as taNaCaraEngine from '../engine/ta-na-cara';
import * as teoriaDeConjuntos from '../engine/teoria-de-conjuntos';
import * as testemunhaOcularEngine from '../engine/testemunha-ocular';
import * as testeDeElencoEngine from '../engine/teste-de-elenco';
import * as trevoDaSorteEngine from '../engine/trevo-da-sorte';
import * as ueSoIssoEngine from '../engine/ue-so-isso';
import * as vamosAoCinemaEngine from '../engine/vamos-ao-cinema';
import * as vendavalDePalpiteEngine from '../engine/vendaval-de-palpite';
import * as viceCampeaoEngine from '../engine/vice-campeao';

const engines = {
  [GAME_NAMES.ADEDANHX]: adedanhxEngine,
  [GAME_NAMES.ARTE_RUIM]: arteRuimEngine,
  [GAME_NAMES.COMUNICACAO_ALIENIGENA]: comunicacaoAlienigenaEngine,
  [GAME_NAMES.COMUNICACAO_DUO]: comunicacaoDuoEngine,
  [GAME_NAMES.CONTADORES_HISTORIAS]: contadoresHistoriasEngine,
  [GAME_NAMES.CONTROLE_DE_ESTOQUE]: controleDeEstoqueEngine,
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
  [GAME_NAMES.ONDA_TELEPATICA]: ondaTelepaticaEngine,
  [GAME_NAMES.PLANEJAMENTO_URBANO]: planejamentoUrbanoEngine,
  [GAME_NAMES.PORTA_DOS_DESESPERADOS]: portadosDesesperadosEngine,
  [GAME_NAMES.POLEMICA_DA_VEZ]: polemicaDaVezEngine,
  [GAME_NAMES.QUEM_NAO_MATA]: quemNaoMataEngine,
  [GAME_NAMES.QUEM_SOU_EU]: quemSouEuEngine,
  [GAME_NAMES.RETRATO_FALADO]: retratoFaladoEngine,
  [GAME_NAMES.SINAIS_DE_ALERTA]: sinaisDeAlertaEngine,
  [GAME_NAMES.SONHOS_PESADELOS]: sonhosPesadelosEngine,
  [GAME_NAMES.SUPER_CAMPEONATO]: superCampeonatoEngine,
  [GAME_NAMES.TA_NA_CARA]: taNaCaraEngine,
  [GAME_NAMES.TEORIA_DE_CONJUNTOS]: teoriaDeConjuntos,
  [GAME_NAMES.TESTEMUNHA_OCULAR]: testemunhaOcularEngine,
  [GAME_NAMES.TESTE_DE_ELENCO]: testeDeElencoEngine,
  [GAME_NAMES.TREVO_DA_SORTE]: trevoDaSorteEngine,
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
