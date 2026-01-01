// Types
import type { GamePlayer } from 'types/player';

/**
 * CSS unit size
 */
export const UNIT_SIZE = 3;
export const DEFAULT_PADDING = UNIT_SIZE * 2;

/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL = {
  BANNERS: 'images/banners/',
  CARDS: 'images/cards/',
  CLOUDS: 'images/clouds/',
  EXAMPLES: 'images/examples/',
  IN_GAME: 'images/in-game/',
  RULES: 'images/rules/',
  ROOT: 'images/',
  RESOURCES: 'resources/',
  LOGOS: 'images/logos/',
  STRIPS: 'images/strips/',
  VIDEOS: 'videos/',
};

/**
 * List of tags translation and color
 */
export const TAG_DICT: Record<
  string,
  {
    label: DualLanguageValue;
    color: string;
    index: number;
    group: 'dynamics' | 'turns' | 'skills' | 'actions' | 'emotions' | 'features' | 'other';
  }
> = {
  // About Dynamics
  competitive: {
    label: {
      en: 'competitive',
      pt: 'competitivo',
    },
    color: 'red',
    index: 0,
    group: 'dynamics',
  },
  cooperative: {
    label: {
      en: 'cooperative',
      pt: 'cooperativo',
    },
    color: 'green',
    index: 0,
    group: 'dynamics',
  },
  // About Turns
  'same-time': {
    label: {
      en: 'same time',
      pt: 'todos juntos',
    },
    color: 'volcano',
    index: 1,
    group: 'turns',
  },
  'turn-based': {
    label: {
      en: 'turn based',
      pt: 'um por vez',
    },
    color: 'volcano',
    index: 1,
    group: 'turns',
  },
  // About Skilled Mechanics
  drawing: {
    label: {
      en: 'drawing',
      pt: 'desenhar',
    },
    color: 'cyan',
    index: 2,
    group: 'skills',
  },
  writing: {
    label: {
      en: 'writing',
      pt: 'escrever',
    },
    color: 'cyan',
    index: 3,
    group: 'skills',
  },
  // About Actions
  guessing: {
    label: {
      en: 'guessing',
      pt: 'adivinhar',
    },
    color: 'geekblue',
    index: 4,
    group: 'actions',
  },
  voting: {
    label: {
      en: 'voting',
      pt: 'votação',
    },
    color: 'geekblue',
    index: 5,
    group: 'actions',
  },
  pairing: {
    label: {
      en: 'pairing',
      pt: 'parear',
    },
    color: 'geekblue',
    index: 6,
    group: 'actions',
  },
  betting: {
    label: {
      en: 'betting',
      pt: 'apostas',
    },
    color: 'geekblue',
    index: 7,
    group: 'actions',
  },
  puzzle: {
    label: {
      en: 'puzzle',
      pt: 'quebra-cabeça',
    },
    color: 'geekblue',
    index: 8,
    group: 'actions',
  },
  // About Feeling inducing
  'push-your-luck': {
    label: {
      en: 'push your luck',
      pt: 'sorte',
    },
    color: 'lime',
    index: 8,
    group: 'emotions',
  },
  'brain-burner': {
    label: {
      en: 'brain burner',
      pt: 'sofrimento',
    },
    color: 'lime',
    index: 9,
    group: 'emotions',
  },
  discussion: {
    label: {
      en: 'discussion',
      pt: 'discussão',
    },
    color: 'lime',
    index: 10,
    group: 'emotions',
  },
  // About Features
  timed: {
    label: {
      en: 'timed',
      pt: 'cronometrado',
    },
    color: 'yellow',
    index: 11,
    group: 'features',
  },
  traitor: {
    label: {
      en: 'traitor',
      pt: 'traidor',
    },
    color: 'volcano',
    index: 12,
    group: 'features',
  },
  images: {
    label: {
      en: 'images',
      pt: 'imagens',
    },
    color: 'purple',
    index: 13,
    group: 'features',
  },
  achievements: {
    label: {
      en: 'achievements',
      pt: 'medalhas',
    },
    color: 'gold',
    index: 14,
    group: 'features',
  },
  // Technical
  bots: {
    label: {
      en: 'bots',
      pt: 'bots',
    },
    color: '',
    index: 15,
    group: 'other',
  },
  'mobile-friendly': {
    label: {
      en: 'mobile-friendly',
      pt: 'aparelho móvel',
    },
    color: '',
    index: 16,
    group: 'other',
  },
  'audience-mode': {
    label: {
      en: 'audience mode',
      pt: 'modo audiência',
    },
    color: '',
    index: 17,
    group: 'other',
  },
};

export const TAG_RULES: Record<string, 'concurrent' | 'exclusive'> = {
  dynamics: 'exclusive',
  turns: 'exclusive',
  skills: 'concurrent',
  actions: 'concurrent',
  emotions: 'concurrent',
  features: 'concurrent',
  other: 'concurrent',
};

export const LETTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const SEPARATOR: string = ';;';

export const LATEST_GAME_IDS: string = 'latestGameIds';

export const NOOP = () => {};

/**
 * Enum of available games
 */
export const GAME_COLLECTION = {
  _TEMPLATE: 'template',
  ADEDANHX: 'adedanhx',
  ARTE_RUIM: 'arte-ruim',
  BARRADOS_NA_ALFANDEGA: 'barrados-na-alfandega', // upcoming
  BOMBA_RELOGIO: 'bomba-relogio', // upcoming
  COMUNICACAO_ALIENIGENA: 'comunicacao-alienigena',
  COMUNICACAO_DUO: 'comunicacao-duo',
  CONTADORES_HISTORIAS: 'contadores-historias',
  CONTROLE_DE_ESTOQUE: 'controle-de-estoque',
  CINEGRAFISTAS_AMADORES: 'cinegrafistas-amadores', // upcoming
  CRIMES_HEDIONDOS: 'crimes-hediondos',
  CRUZA_PALAVRAS: 'cruza-palavras',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  DUETOS: 'duetos',
  ESCAPE_ROOM: 'escape-room',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  ESQUIADORES: 'esquiadores',
  FILEIRA_DE_FATOS: 'fileira-de-fatos',
  FOFOCA_QUENTE: 'fofoca-quente',
  GALERIA_DE_SONHOS: 'galeria-de-sonhos',
  IDADE_DA_PREDA: 'idade-da-preda',
  INSTRUMENTOS_CODIFICADOS: 'instrumentos-codificados', // upcoming
  LABIRINTO_SECRETO: 'labirinto-secreto',
  LINHAS_CRUZADAS: 'linhas-cruzadas',
  MEDIDAS_NAO_EXATAS: 'medidas-nao-exatas',
  MEGAMIX: 'megamix',
  MENTE_COLETIVA: 'mente-coletiva',
  MESMICE: 'mesmice',
  METALINGUAGEM: 'metalinguagem',
  NA_RUA_DO_MEDO: 'na-rua-do-medo',
  NAO_SOU_ROBO: 'nao-sou-robo',
  NAUFRAGOS: 'naufragos', // upcoming
  ONDA_TELEPATICA: 'onda-telepatica',
  PALHETA_DE_CORES: 'palheta-de-cores', // upcoming
  PLANEJAMENTO_URBANO: 'planejamento-urbano',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  PORTA_DOS_DESESPERADOS: 'porta-dos-desesperados',
  QUAL_QUESITO: 'qual-quesito',
  QUEM_NAO_MATA: 'quem-nao-mata',
  QUEM_SOU_EU: 'quem-sou-eu',
  RETRATO_FALADO: 'retrato-falado',
  SINAIS_DE_ALERTA: 'sinais-de-alerta',
  SONHINHO_BOM: 'sonhinho-bom', // upcoming
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  SUPER_CAMPEONATO: 'super-campeonato',
  TA_NA_CARA: 'ta-na-cara',
  TEORIA_DE_CONJUNTOS: 'teoria-de-conjuntos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  TESTE_DE_ELENCO: 'teste-de-elenco',
  TREVO_DA_SORTE: 'trevo-da-sorte', // upcoming
  UE_SO_ISSO: 'ue-so-isso',
  VAMOS_AO_CINEMA: 'vamos-ao-cinema',
  VENDAVAL_DE_PALPITE: 'vendaval-de-palpite',
  VICE_CAMPEAO: 'vice-campeao',
  VINGATIVOS: 'vingativos', // upcoming
};

export const PLACEHOLDER_PLAYER: GamePlayer = {
  id: '',
  name: '',
  avatarId: 'unknown',
  updatedAt: 0,
  ready: false,
};

export const VIEWER_ID = '$viewer$';
