// Types
import type { GameInfo } from 'types/game-info';
// Games
import ADEDANHX from 'games/adedanhx/game-info.json';
import ARTE_RUIM from 'games/arte-ruim/game-info.json';
import BOMBA_RELOGIO from 'games/bomba-relogio/game-info.json';
import CINEGRAFISTAS_AMADORES from 'games/cinegrafistas-amadores/game-info.json';
import COMUNICACAO_ALIENIGENA from 'games/comunicacao-alienigena/game-info.json';
import CONTADORES_HISTORIAS from 'games/contadores-historias/game-info.json';
import CRIMES_HEDIONDOS from 'games/crimes-hediondos/game-info.json';
import CRUZA_PALAVRAS from 'games/cruza-palavras/game-info.json';
import DETETIVES_IMAGINATIVOS from 'games/detetives-imaginativos/game-info.json';
import DILEMA_DOS_ESQUIADORES from 'games/dilema-dos-esquiadores/game-info.json';
import DUETOS from 'games/duetos/game-info.json';
import ESPIAO_ENTRE_NOS from 'games/espiao-entre-nos/game-info.json';
import FILEIRA_DE_FATOS from 'games/fileira-de-fatos/game-info.json';
import GALERIA_DE_SONHOS from 'games/galeria-de-sonhos/game-info.json';
import INSTRUMENTOS_CODIFICADOS from 'games/instrumentos-codificados/game-info.json';
import LABIRINTO_SECRETO from 'games/labirinto-secreto/game-info.json';
import LINHAS_CRUZADAS from 'games/linhas-cruzadas/game-info.json';
import MEGAMIX from 'games/megamix/game-info.json';
import MENTE_COLETIVA from 'games/mente-coletiva/game-info.json';
import MESMICE from 'games/mesmice/game-info.json';
import NA_RUA_DO_MEDO from 'games/na-rua-do-medo/game-info.json';
import NAO_SOU_ROBO from 'games/nao-sou-robo/game-info.json';
import NAUFRAGOS from 'games/naufragos/game-info.json';
import ONDA_TELEPATICA from 'games/onda-telepatica/game-info.json';
import PALHETA_DE_CORES from 'games/palheta-de-cores/game-info.json';
import POLEMICA_DA_VEZ from 'games/polemica-da-vez/game-info.json';
import PORTA_DOS_DESESPERADOS from 'games/porta-dos-desesperados/game-info.json';
import QUEM_NAO_MATA from 'games/quem-nao-mata/game-info.json';
import QUEM_SOU_EU from 'games/quem-sou-eu/game-info.json';
import RETRATO_FALADO from 'games/retrato-falado/game-info.json';
import SONHOS_PESADELOS from 'games/sonhos-pesadelos/game-info.json';
import SUPER_CAMPEONATO from 'games/super-campeonato/game-info.json';
import TA_NA_CARA from 'games/ta-na-cara/game-info.json';
import TEORIA_DE_CONJUNTOS from 'games/teoria-de-conjuntos/game-info.json';
import TESTEMUNHA_OCULAR from 'games/testemunha-ocular/game-info.json';
import TESTE_DE_ELENCO from 'games/teste-de-elenco/game-info.json';
import TREVO_DA_SORTE from 'games/trevo-da-sorte/game-info.json';
import UE_SO_ISSO from 'games/ue-so-isso/game-info.json';
import VAMOS_AO_CINEMA from 'games/vamos-ao-cinema/game-info.json';
import VENDAVAL_DE_PALPITE from 'games/vendaval-de-palpite/game-info.json';
import VINGATIVOS from 'games/vingativos/game-info.json';
import comingSoonGames from 'assets/data/coming-soon-games.json';

const others = comingSoonGames as Record<GameName, GameInfo>;

export const GAME_LIST: Record<GameName, GameInfo> = {
  ...others,
  adedanhx: ADEDANHX,
  'arte-ruim': ARTE_RUIM,
  'bomba-relogio': BOMBA_RELOGIO,
  'cinegrafistas-amadores': CINEGRAFISTAS_AMADORES,
  'comunicacao-alienigena': COMUNICACAO_ALIENIGENA,
  'contadores-historias': CONTADORES_HISTORIAS,
  'crimes-hediondos': CRIMES_HEDIONDOS,
  'cruza-palavras': CRUZA_PALAVRAS,
  'detetives-imaginativos': DETETIVES_IMAGINATIVOS,
  'dilema-dos-esquiadores': DILEMA_DOS_ESQUIADORES,
  duetos: DUETOS,
  'espiao-entre-nos': ESPIAO_ENTRE_NOS,
  'fileira-de-fatos': FILEIRA_DE_FATOS,
  'galeria-de-sonhos': GALERIA_DE_SONHOS,
  'instrumentos-codificados': INSTRUMENTOS_CODIFICADOS,
  'labirinto-secreto': LABIRINTO_SECRETO,
  'linhas-cruzadas': LINHAS_CRUZADAS,
  megamix: MEGAMIX,
  'mente-coletiva': MENTE_COLETIVA,
  mesmice: MESMICE,
  'na-rua-do-medo': NA_RUA_DO_MEDO,
  'nao-sou-robo': NAO_SOU_ROBO,
  naufragos: NAUFRAGOS,
  'onda-telepatica': ONDA_TELEPATICA,
  'palheta-de-cores': PALHETA_DE_CORES,
  'polemica-da-vez': POLEMICA_DA_VEZ,
  'porta-dos-desesperados': PORTA_DOS_DESESPERADOS,
  'quem-nao-mata': QUEM_NAO_MATA,
  'quem-sou-eu': QUEM_SOU_EU,
  'retrato-falado': RETRATO_FALADO,
  'sonhos-pesadelos': SONHOS_PESADELOS,
  'super-campeonato': SUPER_CAMPEONATO,
  'ta-na-cara': TA_NA_CARA,
  'teoria-de-conjuntos': TEORIA_DE_CONJUNTOS,
  'testemunha-ocular': TESTEMUNHA_OCULAR,
  'teste-de-elenco': TESTE_DE_ELENCO,
  'trevo-da-sorte': TREVO_DA_SORTE,
  'ue-so-isso': UE_SO_ISSO,
  'vamos-ao-cinema': VAMOS_AO_CINEMA,
  'vendaval-de-palpite': VENDAVAL_DE_PALPITE,
  vingativos: VINGATIVOS,
};

export default GAME_LIST;
