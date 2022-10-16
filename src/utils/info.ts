import ARTE_RUIM from 'games/arte-ruim/game-info.json';
import BOMBA_RELOGIO from 'games/bomba-relogio/game-info.json';
import CONTADORES_HISTORIAS from 'games/contadores-historias/game-info.json';
import DETETIVES_IMAGINATIVOS from 'games/detetives-imaginativos/game-info.json';
import ESPIAO_ENTRE_NOS from 'games/espiao-entre-nos/game-info.json';
import GALERIA_DE_SONHOS from 'games/galeria-de-sonhos/game-info.json';
import CRIMES_HEDIONDOS from 'games/crimes-hediondos/game-info.json';
import PORTA_DOS_DESESPERADOS from 'games/porta-dos-desesperados/game-info.json';
import INSTRUMENTOS_CODIFICADOS from 'games/instrumentos-codificados/game-info.json';
import PALHETA_DE_CORES from 'games/palheta-de-cores/game-info.json';
import LINHAS_CRUZADAS from 'games/linhas-cruzadas/game-info.json';
import MENTE_COLETIVA from 'games/mente-coletiva/game-info.json';
import NA_RUA_DO_MEDO from 'games/na-rua-do-medo/game-info.json';
import ONDA_TELEPATICA from 'games/onda-telepatica/game-info.json';
import POLEMICA_DA_VEZ from 'games/polemica-da-vez/game-info.json';
import QUEM_NAO_MATA from 'games/quem-nao-mata/game-info.json';
import RETRATO_FALADO from 'games/retrato-falado/game-info.json';
import SONHOS_PESADELOS from 'games/sonhos-pesadelos/game-info.json';
import TESTEMUNHA_OCULAR from 'games/testemunha-ocular/game-info.json';
import UE_SO_ISSO from 'games/ue-so-isso/game-info.json';
import VENDAVAL_DE_PALPITE from 'games/vendaval-de-palpite/game-info.json';
import SUPER_CAMPEONATO from 'games/super-campeonato/game-info.json';
import CRUZA_PALAVRAS from 'games/cruza-palavras/game-info.json';
import TREVO_DA_SORTE from 'games/trevo-da-sorte/game-info.json';

import comingSoonGames from 'assets/data/coming-soon-games.json';

const others = comingSoonGames as Record<GameName, GameInfo>;

export const GAME_LIST: Record<GameCode, GameInfo> = {
  ...others,
  'arte-ruim': ARTE_RUIM,
  'bomba-relogio': BOMBA_RELOGIO,
  'contadores-historias': CONTADORES_HISTORIAS,
  'crimes-hediondos': CRIMES_HEDIONDOS,
  'cruza-palavras': CRUZA_PALAVRAS,
  'detetives-imaginativos': DETETIVES_IMAGINATIVOS,
  'espiao-entre-nos': ESPIAO_ENTRE_NOS,
  'galeria-de-sonhos': GALERIA_DE_SONHOS,
  'instrumentos-codificados': INSTRUMENTOS_CODIFICADOS,
  'linhas-cruzadas': LINHAS_CRUZADAS,
  'mente-coletiva': MENTE_COLETIVA,
  'na-rua-do-medo': NA_RUA_DO_MEDO,
  'onda-telepatica': ONDA_TELEPATICA,
  'palheta-de-cores': PALHETA_DE_CORES,
  'polemica-da-vez': POLEMICA_DA_VEZ,
  'porta-dos-desesperados': PORTA_DOS_DESESPERADOS,
  'quem-nao-mata': QUEM_NAO_MATA,
  'retrato-falado': RETRATO_FALADO,
  'sonhos-pesadelos': SONHOS_PESADELOS,
  'super-campeonato': SUPER_CAMPEONATO,
  'testemunha-ocular': TESTEMUNHA_OCULAR,
  'trevo-da-sorte': TREVO_DA_SORTE,
  'ue-so-isso': UE_SO_ISSO,
  'vendaval-de-palpite': VENDAVAL_DE_PALPITE,
};

export default GAME_LIST;
