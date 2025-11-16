import ADEDANHX from 'games/adedanhx/game-info.json';
import ARTE_RUIM from 'games/arte-ruim/game-info.json';
import BARRADOS_NA_ALFANDEGA from 'games/barrados-na-alfandega/game-info.json';
import BOMBA_RELOGIO from 'games/bomba-relogio/game-info.json';
import CINEGRAFISTAS_AMADORES from 'games/cinegrafistas-amadores/game-info.json';
import COLEGAS_DE_QUARTO from 'games/colegas-de-quarto/game-info.json';
import COMUNICACAO_ALIENIGENA from 'games/comunicacao-alienigena/game-info.json';
import COMUNICACAO_DUO from 'games/comunicacao-duo/game-info.json';
import CONTADORES_HISTORIAS from 'games/contadores-historias/game-info.json';
import CONTROLE_DE_ESTOQUE from 'games/controle-de-estoque/game-info.json';
import CRIMES_HEDIONDOS from 'games/crimes-hediondos/game-info.json';
import CRUZA_PALAVRAS from 'games/cruza-palavras/game-info.json';
import DETETIVES_IMAGINATIVOS from 'games/detetives-imaginativos/game-info.json';
import DUETOS from 'games/duetos/game-info.json';
import ESCAPE_ROOM from 'games/escape-room/game-info.json';
import ESPIAO_ENTRE_NOS from 'games/espiao-entre-nos/game-info.json';
import ESQUIADORES from 'games/esquiadores/game-info.json';
import FILEIRA_DE_FATOS from 'games/fileira-de-fatos/game-info.json';
import FOFOCA_QUENTE from 'games/fofoca-quente/game-info.json';
import GALERIA_DE_SONHOS from 'games/galeria-de-sonhos/game-info.json';
import IDADE_DA_PREDA from 'games/idade-da-preda/game-info.json';
import INSTRUMENTOS_CODIFICADOS from 'games/instrumentos-codificados/game-info.json';
import LABIRINTO_SECRETO from 'games/labirinto-secreto/game-info.json';
import LINHAS_CRUZADAS from 'games/linhas-cruzadas/game-info.json';
import MEDIDAS_NAO_EXATAS from 'games/medidas-nao-exatas/game-info.json';
import MEGAMIX from 'games/megamix/game-info.json';
import MEGAROBOS from 'games/megarobos/game-info.json';
import MENTE_COLETIVA from 'games/mente-coletiva/game-info.json';
import MESMICE from 'games/mesmice/game-info.json';
import METALINGUAGEM from 'games/metalinguagem/game-info.json';
import NA_RUA_DO_MEDO from 'games/na-rua-do-medo/game-info.json';
import NAMORO_OU_AMIZADE from 'games/namoro-ou-amizade/game-info.json';
import NAO_SOU_ROBO from 'games/nao-sou-robo/game-info.json';
import NAUFRAGOS from 'games/naufragos/game-info.json';
import ONDA_TELEPATICA from 'games/onda-telepatica/game-info.json';
import PALHETA_DE_CORES from 'games/palheta-de-cores/game-info.json';
import PLANEJAMENTO_URBANO from 'games/planejamento-urbano/game-info.json';
import POLEMICA_DA_VEZ from 'games/polemica-da-vez/game-info.json';
import PORTA_DOS_DESESPERADOS from 'games/porta-dos-desesperados/game-info.json';
import QUAL_QUESITO from 'games/qual-quesito/game-info.json';
import QUEM_NAO_MATA from 'games/quem-nao-mata/game-info.json';
import QUEM_SOU_EU from 'games/quem-sou-eu/game-info.json';
import RETRATO_FALADO from 'games/retrato-falado/game-info.json';
import SINAIS_DE_ALERTA from 'games/sinais-de-alerta/game-info.json';
import SONHINHO_BOM from 'games/sonhinho-bom/game-info.json';
import SONHOS_PESADELOS from 'games/sonhos-pesadelos/game-info.json';
import SUPER_CAMPEONATO from 'games/super-campeonato/game-info.json';
import TA_NA_CARA from 'games/ta-na-cara/game-info.json';
import TEORIA_DE_CONJUNTOS from 'games/teoria-de-conjuntos/game-info.json';
import TESTE_DE_ELENCO from 'games/teste-de-elenco/game-info.json';
import TESTEMUNHA_OCULAR from 'games/testemunha-ocular/game-info.json';
import TREVO_DA_SORTE from 'games/trevo-da-sorte/game-info.json';
import UE_SO_ISSO from 'games/ue-so-isso/game-info.json';
import VAMOS_AO_CINEMA from 'games/vamos-ao-cinema/game-info.json';
import VENDAVAL_DE_PALPITE from 'games/vendaval-de-palpite/game-info.json';
import VICE_CAMPEAO from 'games/vice-campeao/game-info.json';
import VINGATIVOS from 'games/vingativos/game-info.json';
// Types
import type { GameInfo } from 'types/game-info';

export const GAME_LIST: Record<GameName, GameInfo> = {
  adedanhx: ADEDANHX,
  'arte-ruim': ARTE_RUIM,
  'barrados-na-alfandega': BARRADOS_NA_ALFANDEGA,
  'bomba-relogio': BOMBA_RELOGIO,
  'cinegrafistas-amadores': CINEGRAFISTAS_AMADORES,
  'colegas-de-quarto': COLEGAS_DE_QUARTO,
  'comunicacao-alienigena': COMUNICACAO_ALIENIGENA,
  'comunicacao-duo': COMUNICACAO_DUO,
  'contadores-historias': CONTADORES_HISTORIAS,
  'controle-de-estoque': CONTROLE_DE_ESTOQUE,
  'crimes-hediondos': CRIMES_HEDIONDOS,
  'cruza-palavras': CRUZA_PALAVRAS,
  'detetives-imaginativos': DETETIVES_IMAGINATIVOS,
  esquiadores: ESQUIADORES,
  duetos: DUETOS,
  'escape-room': ESCAPE_ROOM,
  'espiao-entre-nos': ESPIAO_ENTRE_NOS,
  'fileira-de-fatos': FILEIRA_DE_FATOS,
  'fofoca-quente': FOFOCA_QUENTE,
  'galeria-de-sonhos': GALERIA_DE_SONHOS,
  'idade-da-preda': IDADE_DA_PREDA,
  'instrumentos-codificados': INSTRUMENTOS_CODIFICADOS,
  'labirinto-secreto': LABIRINTO_SECRETO,
  'linhas-cruzadas': LINHAS_CRUZADAS,
  'medidas-nao-exatas': MEDIDAS_NAO_EXATAS,
  megamix: MEGAMIX,
  megarobos: MEGAROBOS,
  'mente-coletiva': MENTE_COLETIVA,
  mesmice: MESMICE,
  metalinguagem: METALINGUAGEM,
  'na-rua-do-medo': NA_RUA_DO_MEDO,
  'namoro-ou-amizade': NAMORO_OU_AMIZADE,
  'nao-sou-robo': NAO_SOU_ROBO,
  naufragos: NAUFRAGOS,
  'onda-telepatica': ONDA_TELEPATICA,
  'palheta-de-cores': PALHETA_DE_CORES,
  'planejamento-urbano': PLANEJAMENTO_URBANO,
  'polemica-da-vez': POLEMICA_DA_VEZ,
  'porta-dos-desesperados': PORTA_DOS_DESESPERADOS,
  'qual-quesito': QUAL_QUESITO,
  'quem-nao-mata': QUEM_NAO_MATA,
  'quem-sou-eu': QUEM_SOU_EU,
  'retrato-falado': RETRATO_FALADO,
  'sinais-de-alerta': SINAIS_DE_ALERTA,
  'sonhinho-bom': SONHINHO_BOM,
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
  'vice-campeao': VICE_CAMPEAO,
  vingativos: VINGATIVOS,
};

export default GAME_LIST;
