// Types
import type { GameInfo } from 'types/game-info';

/**
 * Mapping of game names to their import functions
 * This allows individual game info files to be loaded on-demand
 */
const GAME_INFO_PATHS: Record<string, () => Promise<{ default: GameInfo }>> = {
  adedanhx: () => import('games/adedanhx/game-info.json'),
  'arte-ruim': () => import('games/arte-ruim/game-info.json'),
  'barrados-na-alfandega': () => import('games/barrados-na-alfandega/game-info.json'),
  'bomba-relogio': () => import('games/bomba-relogio/game-info.json'),
  'cinegrafistas-amadores': () => import('games/cinegrafistas-amadores/game-info.json'),
  'colegas-de-quarto': () => import('games/colegas-de-quarto/game-info.json'),
  'comunicacao-alienigena': () => import('games/comunicacao-alienigena/game-info.json'),
  'comunicacao-duo': () => import('games/comunicacao-duo/game-info.json'),
  'contadores-historias': () => import('games/contadores-historias/game-info.json'),
  'controle-de-estoque': () => import('games/controle-de-estoque/game-info.json'),
  'crimes-hediondos': () => import('games/crimes-hediondos/game-info.json'),
  'cruza-palavras': () => import('games/cruza-palavras/game-info.json'),
  'detetives-imaginativos': () => import('games/detetives-imaginativos/game-info.json'),
  duetos: () => import('games/duetos/game-info.json'),
  'escape-room': () => import('games/escape-room/game-info.json'),
  'espiao-entre-nos': () => import('games/espiao-entre-nos/game-info.json'),
  esquiadores: () => import('games/esquiadores/game-info.json'),
  'fileira-de-fatos': () => import('games/fileira-de-fatos/game-info.json'),
  'fofoca-quente': () => import('games/fofoca-quente/game-info.json'),
  'galeria-de-sonhos': () => import('games/galeria-de-sonhos/game-info.json'),
  'idade-da-preda': () => import('games/idade-da-preda/game-info.json'),
  'instrumentos-codificados': () => import('games/instrumentos-codificados/game-info.json'),
  'labirinto-secreto': () => import('games/labirinto-secreto/game-info.json'),
  'linhas-cruzadas': () => import('games/linhas-cruzadas/game-info.json'),
  'medidas-nao-exatas': () => import('games/medidas-nao-exatas/game-info.json'),
  megamix: () => import('games/megamix/game-info.json'),
  megarobos: () => import('games/megarobos/game-info.json'),
  'mente-coletiva': () => import('games/mente-coletiva/game-info.json'),
  mesmice: () => import('games/mesmice/game-info.json'),
  metalinguagem: () => import('games/metalinguagem/game-info.json'),
  'na-fila-do-banco': () => import('games/na-fila-do-banco/game-info.json'),
  'na-rua-do-medo': () => import('games/na-rua-do-medo/game-info.json'),
  'namoro-ou-amizade': () => import('games/namoro-ou-amizade/game-info.json'),
  'nao-sou-robo': () => import('games/nao-sou-robo/game-info.json'),
  naufragos: () => import('games/naufragos/game-info.json'),
  'onda-telepatica': () => import('games/onda-telepatica/game-info.json'),
  'palheta-de-cores': () => import('games/palheta-de-cores/game-info.json'),
  'pique-pega': () => import('games/pique-pega/game-info.json'),
  'planejamento-urbano': () => import('games/planejamento-urbano/game-info.json'),
  'polemica-da-vez': () => import('games/polemica-da-vez/game-info.json'),
  'porta-dos-desesperados': () => import('games/porta-dos-desesperados/game-info.json'),
  'qual-quesito': () => import('games/qual-quesito/game-info.json'),
  'quem-nao-mata': () => import('games/quem-nao-mata/game-info.json'),
  'quem-sou-eu': () => import('games/quem-sou-eu/game-info.json'),
  'retrato-falado': () => import('games/retrato-falado/game-info.json'),
  'senso-literario': () => import('games/senso-literario/game-info.json'),
  'sinais-de-alerta': () => import('games/sinais-de-alerta/game-info.json'),
  'sonhinho-bom': () => import('games/sonhinho-bom/game-info.json'),
  'super-campeonato': () => import('games/super-campeonato/game-info.json'),
  'ta-na-cara': () => import('games/ta-na-cara/game-info.json'),
  'teoria-de-conjuntos': () => import('games/teoria-de-conjuntos/game-info.json'),
  'teste-de-elenco': () => import('games/teste-de-elenco/game-info.json'),
  'testemunha-ocular': () => import('games/testemunha-ocular/game-info.json'),
  'ue-so-isso': () => import('games/ue-so-isso/game-info.json'),
  'vamos-ao-cinema': () => import('games/vamos-ao-cinema/game-info.json'),
  'vendaval-de-palpite': () => import('games/vendaval-de-palpite/game-info.json'),
  'vice-campeao': () => import('games/vice-campeao/game-info.json'),
  vingativos: () => import('games/vingativos/game-info.json'),
};

/**
 * Lazy loads all game info JSON files
 * Using dynamic imports to prevent loading all game-info.json files on the home page
 */
export const getGameList = async (): Promise<Record<string, GameInfo>> => {
  const importPromises = Object.entries(GAME_INFO_PATHS).map(async ([gameName, importFn]) => {
    const module = await importFn();
    return [gameName, module.default] as const;
  });

  const results = await Promise.all(importPromises);

  return Object.fromEntries(results);
};

/**
 * Loads a single game info by game name without loading all games
 */
export const getGameInfo = async (gameName: string): Promise<GameInfo> => {
  const importFn = GAME_INFO_PATHS[gameName];

  if (!importFn) {
    throw new Error(
      `Game info not found for game: "${gameName}". Available games: ${Object.keys(GAME_INFO_PATHS).join(', ')}`,
    );
  }

  const module = await importFn();
  return module.default;
};
