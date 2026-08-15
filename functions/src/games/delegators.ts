// Constants
import { GAME_NAMES } from '../constants/games';

type Engine = {
  getInitialState: (
    gameId: string,
    uid: string,
    language: Language,
    version: string,
    options: AnyOrUnknownPlaceholder,
  ) => AnyOrUnknownPlaceholder;
  getNextPhase: (
    gameName: string,
    gameId: string,
    currentState?: (FirebaseFirestore.DocumentData & AnyOrUnknownPlaceholder) | undefined,
  ) => Promise<boolean>;
  getPlayerCounts: () => PlayerCounts;
  submitAction: (data: AnyOrUnknownPlaceholder) => Promise<AnyOrUnknownPlaceholder>;
};

/**
 * Registry of dynamic import loaders for each game.
 * Instead of loading everything at startup, these closures
 * will only execute when explicitly called.
 */
const engineRegistry: Record<string, () => Promise<Engine>> = {
  [GAME_NAMES.ADEDANHX]: () => import('./adedanhx'),
  [GAME_NAMES.ARTE_RUIM]: () => import('./arte-ruim'),
  [GAME_NAMES.BOMBA_RELOGIO]: () => import('./bomba-relogio'),
  [GAME_NAMES.COLEGAS_DE_QUARTO]: () => import('./colegas-de-quarto'),
  [GAME_NAMES.COMUNICACAO_ALIENIGENA]: () => import('./comunicacao-alienigena'),
  [GAME_NAMES.COMUNICACAO_DUO]: () => import('./comunicacao-duo'),
  [GAME_NAMES.CONTADORES_HISTORIAS]: () => import('./contadores-historias'),
  [GAME_NAMES.CONTROLE_DE_ESTOQUE]: () => import('./controle-de-estoque'),
  [GAME_NAMES.CORREIO_DO_AMOR]: () => import('./correio-do-amor'),
  [GAME_NAMES.CRIMES_HEDIONDOS]: () => import('./crimes-hediondos'),
  [GAME_NAMES.CRUZA_PALAVRAS]: () => import('./cruza-palavras'),
  [GAME_NAMES.DETETIVES_IMAGINATIVOS]: () => import('./detetives-imaginativos'),
  [GAME_NAMES.DUETOS]: () => import('./duetos'),
  [GAME_NAMES.ESPIAO_ENTRE_NOS]: () => import('./espiao-entre-nos'),
  [GAME_NAMES.ESQUIADORES]: () => import('./esquiadores'),
  [GAME_NAMES.FOFOCA_QUENTE]: () => import('./fofoca-quente'),
  [GAME_NAMES.FILEIRA_DE_FATOS]: () => import('./fileira-de-fatos'),
  [GAME_NAMES.GALERIA_DE_SONHOS]: () => import('./galeria-de-sonhos'),
  [GAME_NAMES.IDADE_DA_PREDA]: () => import('./idade-da-preda'),
  [GAME_NAMES.LABIRINTO_SECRETO]: () => import('./labirinto-secreto'),
  [GAME_NAMES.LINHAS_CRUZADAS]: () => import('./linhas-cruzadas'),
  [GAME_NAMES.MEDIDAS_NAO_EXATAS]: () => import('./medidas-nao-exatas'),
  [GAME_NAMES.MEGAMIX]: () => import('./megamix'),
  [GAME_NAMES.MENTE_COLETIVA]: () => import('./mente-coletiva'),
  [GAME_NAMES.MESMICE]: () => import('./mesmice'),
  [GAME_NAMES.METALINGUAGEM]: () => import('./metalinguagem'),
  [GAME_NAMES.NA_RUA_DO_MEDO]: () => import('./na-rua-do-medo'),
  [GAME_NAMES.NAO_SOU_ROBO]: () => import('./nao-sou-robo'),
  [GAME_NAMES.NA_FILA_DO_BANCO]: () => import('./na-fila-do-banco'),
  [GAME_NAMES.ONDA_TELEPATICA]: () => import('./onda-telepatica'),
  [GAME_NAMES.PLANEJAMENTO_URBANO]: () => import('./planejamento-urbano'),
  [GAME_NAMES.PORTA_DOS_DESESPERADOS]: () => import('./porta-dos-desesperados'),
  [GAME_NAMES.POLEMICA_DA_VEZ]: () => import('./polemica-da-vez'),
  [GAME_NAMES.QUAL_QUESITO]: () => import('./qual-quesito'),
  [GAME_NAMES.QUEM_SOU_EU]: () => import('./quem-sou-eu'),
  [GAME_NAMES.RETRATO_FALADO]: () => import('./retrato-falado'),
  [GAME_NAMES.SENSO_LITERARIO]: () => import('./senso-literario'),
  [GAME_NAMES.SINAIS_DE_ALERTA]: () => import('./sinais-de-alerta'),
  [GAME_NAMES.SUPER_CAMPEONATO]: () => import('./super-campeonato'),
  [GAME_NAMES.TA_NA_CARA]: () => import('./ta-na-cara'),
  [GAME_NAMES.TEORIA_DE_CONJUNTOS]: () => import('./teoria-de-conjuntos'),
  [GAME_NAMES.TESTEMUNHA_OCULAR]: () => import('./testemunha-ocular'),
  [GAME_NAMES.TESTE_DE_ELENCO]: () => import('./teste-de-elenco'),
  [GAME_NAMES.UE_SO_ISSO]: () => import('./ue-so-isso'),
  [GAME_NAMES.VAMOS_AO_CINEMA]: () => import('./vamos-ao-cinema'),
  [GAME_NAMES.VICE_CAMPEAO]: () => import('./vice-campeao'),
};

// In-memory cache to prevent re-importing the same engine multiple times
// during the lifecycle of a warm Cloud Function instance.
const engineCache = new Map<string, Engine>();

/**
 * Retrieves the engine for a given game name.
 *
 * @param gameName - The name of the game.
 * @returns A promise resolving to the engine associated with the game name.
 * @throws Error if the collection for the game name does not exist.
 */
export const getEngine = async (gameName: string): Promise<Engine> => {
  // 1. Return immediately if it's already cached
  if (engineCache.has(gameName)) {
    return engineCache.get(gameName) as Engine;
  }

  // 2. Fetch the dynamic loader function
  const loader = engineRegistry[gameName];
  if (!loader) {
    throw new Error(`Engine for '${gameName}' does not exist`);
  }

  // 3. Await the import, cache it, and return
  try {
    const engine = await loader();
    engineCache.set(gameName, engine);
    return engine;
  } catch (error) {
    throw new Error(`Failed to load engine for '${gameName}': ${error}`);
  }
};
