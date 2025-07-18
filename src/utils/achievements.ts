import ADEDANHX from 'games/adedanhx/utils/achievements';
import ARTE_RUIM from 'games/arte-ruim/utils/achievements';
import COMUNICACAO_ALIENIGENA from 'games/comunicacao-alienigena/utils/achievements';
import COMUNICACAO_DUO from 'games/comunicacao-duo/utils/achievements';
import CONTADORES_HISTORIAS from 'games/contadores-historias/utils/achievements';
import CRIMES_HEDIONDOS from 'games/crimes-hediondos/utils/achievements';
import CRUZA_PALAVRAS from 'games/cruza-palavras/utils/achievements';
import DETETIVES_IMAGINATIVOS from 'games/detetives-imaginativos/utils/achievements';
import DUETOS from 'games/duetos/utils/achievements';
import ESQUIADORES from 'games/esquiadores/utils/achievements';
import FILEIRA_DE_FATOS from 'games/fileira-de-fatos/utils/achievements';
import GALERIA_DE_SONHOS from 'games/galeria-de-sonhos/utils/achievements';
import LABIRINTO_SECRETO from 'games/labirinto-secreto/utils/achievements';
import LINHAS_CRUZADAS from 'games/linhas-cruzadas/utils/achievements';
import MEDIDAS_NAO_EXATAS from 'games/medidas-nao-exatas/utils/achievements';
import MEGAMIX from 'games/megamix/utils/achievements';
import MENTE_COLETIVA from 'games/mente-coletiva/utils/achievements';
import METALINGUAGEM from 'games/metalinguagem/utils/achievements';
import NA_RUA_DO_MEDO from 'games/na-rua-do-medo/utils/achievements';
import NAO_SOU_ROBO from 'games/nao-sou-robo/utils/achievements';
import ONDA_TELEPATICA from 'games/onda-telepatica/utils/achievements';
import POLEMICA_DA_VEZ from 'games/polemica-da-vez/utils/achievements';
import PORTA_DOS_DESESPERADOS from 'games/porta-dos-desesperados/utils/achievements';
import QUEM_SOU_EU from 'games/quem-sou-eu/utils/achievements';
import RETRATO_FALADO from 'games/retrato-falado/utils/achievements';
import SINAIS_DE_ALERTA from 'games/sinais-de-alerta/utils/achievements';
import SUPER_CAMPEONATO from 'games/super-campeonato/utils/achievements';
import TESTE_DE_ELENCO from 'games/teste-de-elenco/utils/achievements';
import TESTEMUNHA_OCULAR from 'games/testemunha-ocular/utils/achievements';
import UE_SO_ISSO from 'games/ue-so-isso/utils/achievements';
import VAMOS_AO_CINEMA from 'games/vamos-ao-cinema/utils/achievements';
import VICE_CAMPEAO from 'games/vice-campeao/utils/achievements';
// Types
import type { AchievementReference } from 'types/achievements';
// import BOMBA_RELOGIO from 'games/bomba-relogio/utils/achievements';
// import CINEGRAFISTAS_AMADORES from 'games/cinegrafistas-amadores/utils/achievements';
// import ESPIAO_ENTRE_NOS from 'games/espiao-entre-nos/utils/achievements';
// import INSTRUMENTOS_CODIFICADOS from 'games/instrumentos-codificados/utils/achievements';
// import NAUFRAGOS from 'games/naufragos/utils/achievements';
// import PALHETA_DE_CORES from 'games/palheta-de-cores/utils/achievements';
// import QUEM_NAO_MATA from 'games/quem-nao-mata/utils/achievements';
// import SONHOS_PESADELOS from 'games/sonhos-pesadelos/utils/achievements';
// import TA_NA_CARA from 'games/ta-na-cara/utils/achievements';
// import TREVO_DA_SORTE from 'games/trevo-da-sorte/utils/achievements';
// import VENDAVAL_DE_PALPITE from 'games/vendaval-de-palpite/utils/achievements';

export const ACHIEVEMENTS_DICT: Record<GameName, AchievementReference | null> = {
  adedanhx: ADEDANHX,
  'arte-ruim': ARTE_RUIM,
  'bomba-relogio': null,
  'cinegrafistas-amadores': null,
  'comunicacao-alienigena': COMUNICACAO_ALIENIGENA,
  'comunicacao-duo': COMUNICACAO_DUO,
  'contadores-historias': CONTADORES_HISTORIAS,
  'crimes-hediondos': CRIMES_HEDIONDOS,
  'cruza-palavras': CRUZA_PALAVRAS,
  'detetives-imaginativos': DETETIVES_IMAGINATIVOS,
  esquiadores: ESQUIADORES,
  duetos: DUETOS,
  'espiao-entre-nos': null,
  'fileira-de-fatos': FILEIRA_DE_FATOS,
  'galeria-de-sonhos': GALERIA_DE_SONHOS,
  'instrumentos-codificados': null,
  'labirinto-secreto': LABIRINTO_SECRETO,
  'linhas-cruzadas': LINHAS_CRUZADAS,
  'medidas-nao-exatas': MEDIDAS_NAO_EXATAS,
  megamix: MEGAMIX,
  'mente-coletiva': MENTE_COLETIVA,
  metalinguagem: METALINGUAGEM,
  'na-rua-do-medo': NA_RUA_DO_MEDO,
  'nao-sou-robo': NAO_SOU_ROBO,
  naufragos: null,
  'onda-telepatica': ONDA_TELEPATICA,
  'palheta-de-cores': null,
  'polemica-da-vez': POLEMICA_DA_VEZ,
  'porta-dos-desesperados': PORTA_DOS_DESESPERADOS,
  'quem-nao-mata': null,
  'quem-sou-eu': QUEM_SOU_EU,
  'retrato-falado': RETRATO_FALADO,
  'sinais-de-alerta': SINAIS_DE_ALERTA,
  'sonhos-pesadelos': null,
  'super-campeonato': SUPER_CAMPEONATO,
  'ta-na-cara': null,
  'testemunha-ocular': TESTEMUNHA_OCULAR,
  'teste-de-elenco': TESTE_DE_ELENCO,
  'trevo-da-sorte': null,
  'ue-so-isso': UE_SO_ISSO,
  'vamos-ao-cinema': VAMOS_AO_CINEMA,
  'vendaval-de-palpite': null,
  'vice-campeao': VICE_CAMPEAO,
};

export default ACHIEVEMENTS_DICT;
