import { lazy } from 'react';
// Utils
import { GAME_COLLECTION } from 'utils/constants';

type GameSessionComponent = React.LazyExoticComponent<React.ComponentType<any>>;

type GameSessionMap = {
  [key: string]: GameSessionComponent;
};

// Map game IDs to their lazy-loaded components
export const gameSessions: GameSessionMap = {
  [GAME_COLLECTION.ADEDANHX]: lazy(() => import('games/adedanhx/SessionAdedanhx')),
  [GAME_COLLECTION.ARTE_RUIM]: lazy(() => import('games/arte-ruim/SessionArteRuim')),
  [GAME_COLLECTION.COMUNICACAO_ALIENIGENA]: lazy(
    () => import('games/comunicacao-alienigena/SessionComunicacaoAlienigena'),
  ),
  [GAME_COLLECTION.COMUNICACAO_DUO]: lazy(() => import('games/comunicacao-duo/SessionComunicacaoDuo')),
  [GAME_COLLECTION.CONTADORES_HISTORIAS]: lazy(
    () => import('games/contadores-historias/SessionContadoresHistorias'),
  ),
  [GAME_COLLECTION.CONTROLE_DE_ESTOQUE]: lazy(
    () => import('games/controle-de-estoque/SessionControleDeEstoque'),
  ),
  [GAME_COLLECTION.CRIMES_HEDIONDOS]: lazy(() => import('games/crimes-hediondos/SessionCrimesHediondos')),
  [GAME_COLLECTION.CRUZA_PALAVRAS]: lazy(() => import('games/cruza-palavras/SessionCruzaPalavras')),
  [GAME_COLLECTION.DETETIVES_IMAGINATIVOS]: lazy(
    () => import('games/detetives-imaginativos/SessionDetetivesImaginativos'),
  ),
  [GAME_COLLECTION.DUETOS]: lazy(() => import('games/duetos/SessionDuetos')),
  [GAME_COLLECTION.ESCAPE_ROOM]: lazy(() => import('games/escape-room/SessionEscapeRoom')),
  [GAME_COLLECTION.ESQUIADORES]: lazy(() => import('games/esquiadores/SessionEsquiadores')),
  [GAME_COLLECTION.FILEIRA_DE_FATOS]: lazy(() => import('games/fileira-de-fatos/SessionFileiraDeFatos')),
  [GAME_COLLECTION.GALERIA_DE_SONHOS]: lazy(() => import('games/galeria-de-sonhos/SessionGaleriaDeSonhos')),
  [GAME_COLLECTION.IDADE_DA_PREDA]: lazy(() => import('games/idade-da-preda/SessionIdadeDaPreda')),
  [GAME_COLLECTION.LABIRINTO_SECRETO]: lazy(() => import('games/labirinto-secreto/SessionLabirintoSecreto')),
  [GAME_COLLECTION.LINHAS_CRUZADAS]: lazy(() => import('games/linhas-cruzadas/SessionLinhasCruzadas')),
  [GAME_COLLECTION.MEDIDAS_NAO_EXATAS]: lazy(
    () => import('games/medidas-nao-exatas/SessionMedidasNaoExatas'),
  ),
  [GAME_COLLECTION.MEGAMIX]: lazy(() => import('games/megamix/SessionMegamix')),
  [GAME_COLLECTION.MENTE_COLETIVA]: lazy(() => import('games/mente-coletiva/SessionMenteColetiva')),
  [GAME_COLLECTION.MESMICE]: lazy(() => import('games/mesmice/SessionMesmice')),
  [GAME_COLLECTION.METALINGUAGEM]: lazy(() => import('games/metalinguagem/SessionMetalinguagem')),
  [GAME_COLLECTION.NA_RUA_DO_MEDO]: lazy(() => import('games/na-rua-do-medo/SessionNaRuaDoMedo')),
  [GAME_COLLECTION.NAO_SOU_ROBO]: lazy(() => import('games/nao-sou-robo/SessionNaoSouRobo')),
  [GAME_COLLECTION.ONDA_TELEPATICA]: lazy(() => import('games/onda-telepatica/SessionOndaTelepatica')),
  [GAME_COLLECTION.PLANEJAMENTO_URBANO]: lazy(
    () => import('games/planejamento-urbano/SessionPlanejamentoUrbano'),
  ),
  [GAME_COLLECTION.POLEMICA_DA_VEZ]: lazy(() => import('games/polemica-da-vez/SessionPolemicaDaVez')),
  [GAME_COLLECTION.PORTA_DOS_DESESPERADOS]: lazy(
    () => import('games/porta-dos-desesperados/SessionPortaDosDesesperados'),
  ),
  [GAME_COLLECTION.QUEM_NAO_MATA]: lazy(() => import('games/quem-nao-mata/SessionQuemNaoMata')),
  [GAME_COLLECTION.QUEM_SOU_EU]: lazy(() => import('games/quem-sou-eu/SessionQuemSouEu')),
  [GAME_COLLECTION.RETRATO_FALADO]: lazy(() => import('games/retrato-falado/SessionRetratoFalado')),
  [GAME_COLLECTION.SINAIS_DE_ALERTA]: lazy(() => import('games/sinais-de-alerta/SessionSinaisDeAlerta')),
  [GAME_COLLECTION.SONHOS_PESADELOS]: lazy(() => import('games/sonhos-pesadelos/SessionSonhosPesadelos')),
  [GAME_COLLECTION.SUPER_CAMPEONATO]: lazy(() => import('games/super-campeonato/SessionSuperCampeonato')),
  [GAME_COLLECTION.TA_NA_CARA]: lazy(() => import('games/ta-na-cara/SessionTaNaCara')),
  [GAME_COLLECTION.TEORIA_DE_CONJUNTOS]: lazy(
    () => import('games/teoria-de-conjuntos/SessionTeoriaDeConjuntos'),
  ),
  [GAME_COLLECTION.TESTE_DE_ELENCO]: lazy(() => import('games/teste-de-elenco/SessionTesteDeElenco')),
  [GAME_COLLECTION.TESTEMUNHA_OCULAR]: lazy(() => import('games/testemunha-ocular/SessionTestemunhaOcular')),
  [GAME_COLLECTION.TREVO_DA_SORTE]: lazy(() => import('games/trevo-da-sorte/SessionTrevoDaSorte')),
  [GAME_COLLECTION.UE_SO_ISSO]: lazy(() => import('games/ue-so-isso/SessionUeSoIsso')),
  [GAME_COLLECTION.VAMOS_AO_CINEMA]: lazy(() => import('games/vamos-ao-cinema/SessionVamosAoCinema')),
  [GAME_COLLECTION.VENDAVAL_DE_PALPITE]: lazy(
    () => import('games/vendaval-de-palpite/SessionVendavalDePalpite'),
  ),
};

/**
 * Helper function to get the game session component
 * @param gameName - The name of the game to load
 * @returns The lazy-loaded game session component or null if not found
 */
export const getGameSession = (gameName: string): GameSessionComponent | null => {
  const gameSession = gameSessions[gameName];

  if (!gameSession) {
    // Game session not found - this should be handled by the calling component
    return null;
  }

  return gameSession;
};
