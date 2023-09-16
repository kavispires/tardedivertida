import ARTE_RUIM from 'games/arte-ruim/utils/achievements';
// import BOMBA_RELOGIO from 'games/bomba-relogio/utils/achievements';
// import CINEGRAFISTAS_AMADORES from 'games/cinegrafistas-amadores/utils/achievements';
import COMUNICACAO_ALIENIGENA from 'games/comunicacao-alienigena/utils/achievements';
import CONTADORES_HISTORIAS from 'games/contadores-historias/utils/achievements';
import CRIMES_HEDIONDOS from 'games/crimes-hediondos/utils/achievements';
import CRUZA_PALAVRAS from 'games/cruza-palavras/utils/achievements';
// import DETETIVES_IMAGINATIVOS from 'games/detetives-imaginativos/utils/achievements';
// import DILEMA_DOS_ESQUIADORES from 'games/dilema-dos-esquiadores/utils/achievements';
// import ESPIAO_ENTRE_NOS from 'games/espiao-entre-nos/utils/achievements';
import FILEIRA_DE_FATOS from 'games/fileira-de-fatos/utils/achievements';
import GALERIA_DE_SONHOS from 'games/galeria-de-sonhos/utils/achievements';
// import INSTRUMENTOS_CODIFICADOS from 'games/instrumentos-codificados/utils/achievements';
// import LABIRINTO_SECRETO from 'games/labirinto-secreto/utils/achievements';
import LINHAS_CRUZADAS from 'games/linhas-cruzadas/utils/achievements';
import MEGAMIX from 'games/megamix/utils/achievements';
import MENTE_COLETIVA from 'games/mente-coletiva/utils/achievements';
import NA_RUA_DO_MEDO from 'games/na-rua-do-medo/utils/achievements';
// import NAUFRAGOS from 'games/naufragos/utils/achievements';
import ONDA_TELEPATICA from 'games/onda-telepatica/utils/achievements';
// import PALHETA_DE_CORES from 'games/palheta-de-cores/utils/achievements';
// import POLEMICA_DA_VEZ from 'games/polemica-da-vez/utils/achievements';
import PORTA_DOS_DESESPERADOS from 'games/porta-dos-desesperados/utils/achievements';
// import QUEM_NAO_MATA from 'games/quem-nao-mata/utils/achievements';
import QUEM_SOU_EU from 'games/quem-sou-eu/utils/achievements';
import RETRATO_FALADO from 'games/retrato-falado/utils/achievements';
// import SONHOS_PESADELOS from 'games/sonhos-pesadelos/utils/achievements';
import SUPER_CAMPEONATO from 'games/super-campeonato/utils/achievements';
// import TA_NA_CARA from 'games/ta-na-cara/utils/achievements';
// import TESTEMUNHA_OCULAR from 'games/testemunha-ocular/utils/achievements';
// import TREVO_DA_SORTE from 'games/trevo-da-sorte/utils/achievements';
import UE_SO_ISSO from 'games/ue-so-isso/utils/achievements';
// import VAMOS_AO_CINEMA from 'games/vamos-ao-cinema/utils/achievements';
// import VENDAVAL_DE_PALPITE from 'games/vendaval-de-palpite/utils/achievements';

export const ACHIEVEMENTS_DICT: Record<GameName, AchievementReference | null> = {
  'arte-ruim': ARTE_RUIM,
  'bomba-relogio': null,
  'cinegrafistas-amadores': null,
  'comunicacao-alienigena': COMUNICACAO_ALIENIGENA,
  'contadores-historias': CONTADORES_HISTORIAS,
  'crimes-hediondos': CRIMES_HEDIONDOS,
  'cruza-palavras': CRUZA_PALAVRAS,
  'detetives-imaginativos': null,
  'dilema-dos-esquiadores': null,
  'espiao-entre-nos': null,
  'fileira-de-fatos': FILEIRA_DE_FATOS,
  'galeria-de-sonhos': GALERIA_DE_SONHOS,
  'instrumentos-codificados': null,
  'labirinto-secreto': null,
  'linhas-cruzadas': LINHAS_CRUZADAS,
  megamix: MEGAMIX,
  'mente-coletiva': MENTE_COLETIVA,
  'na-rua-do-medo': NA_RUA_DO_MEDO,
  naufragos: null,
  'onda-telepatica': ONDA_TELEPATICA,
  'palheta-de-cores': null,
  'polemica-da-vez': null,
  'porta-dos-desesperados': PORTA_DOS_DESESPERADOS,
  'quem-nao-mata': null,
  'quem-sou-eu': QUEM_SOU_EU,
  'retrato-falado': RETRATO_FALADO,
  'sonhos-pesadelos': null,
  'super-campeonato': SUPER_CAMPEONATO,
  'ta-na-cara': null,
  'testemunha-ocular': null,
  'trevo-da-sorte': null,
  'ue-so-isso': UE_SO_ISSO,
  'vamos-ao-cinema': null,
  'vendaval-de-palpite': null,
};

export default ACHIEVEMENTS_DICT;
