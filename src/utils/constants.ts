/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL = {
  BANNERS: `${process.env.PUBLIC_URL}/images/banners/`,
  CARDS: `${process.env.PUBLIC_URL}/images/cards/`,
  CLOUDS: `${process.env.PUBLIC_URL}/images/clouds/`,
  EXAMPLES: `${process.env.PUBLIC_URL}/images/examples/`,
  IN_GAME: `${process.env.PUBLIC_URL}/images/in-game/`,
  RULES: `${process.env.PUBLIC_URL}/images/rules/`,
  ROOT: `${process.env.PUBLIC_URL}/images/`,
  RESOURCES: `${process.env.PUBLIC_URL}/resources/`,
};

/**
 * List of tags translation and color
 */
export const TAG_DICT: Record<string, GameTag> = {
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
  'mobile-friendly': {
    label: {
      en: 'mobile-friendly',
      pt: 'aparelho móvel',
    },
    color: '',
    index: 16,
    group: 'other',
  },
  bots: {
    label: {
      en: 'bots',
      pt: 'bots',
    },
    color: '',
    index: 15,
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

export const ADMIN_ACTIONS = {
  GO_TO_NEXT_PHASE: 'GO_TO_NEXT_PHASE',
  FORCE_STATE_PROPERTY: 'FORCE_STATE_PROPERTY',
  PLAY_AGAIN: 'PLAY_AGAIN',
  FORCE_END_GAME: 'FORCE_END_GAME',
};

/**
 * Enum of available games
 */
export const GAME_COLLECTION = {
  ARTE_RUIM: 'arte-ruim',
  BOMBA_RELOGIO: 'bomba-relogio',
  CAMINHOS_MAGICOS: 'caminhos-magicos',
  CONTADORES_HISTORIAS: 'contadores-historias',
  CINEGRAFISTAS_AMADORES: 'cinegrafistas-amadores',
  CRIMES_HEDIONDOS: 'crimes-hediondos',
  CRUZA_PALAVRAS: 'cruza-palavras',
  DESENHO_RAPIDAO: 'desenho-rapidao',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  DILEMAS_DOS_ESQUIADORES: 'dilemas-dos-esquiadores',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  FILEIRA_DE_FATOS: 'fileira-de-fatos',
  GALERIA_DE_SONHOS: 'galeria-de-sonhos',
  INSTRUMENTOS_CODIFICADOS: 'instrumentos-codificados',
  LINHAS_CRUZADAS: 'linhas-cruzadas',
  MENTE_COLETIVA: 'mente-coletiva',
  NA_RUA_DO_MEDO: 'na-rua-do-medo',
  NAUFRAGOS: 'naufragos',
  ONDA_TELEPATICA: 'onda-telepatica',
  PALHETA_DE_CORES: 'palheta-de-cores',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  PORTA_DOS_DESESPERADOS: 'porta-dos-desesperados',
  QUEM_NAO_MATA: 'quem-nao-mata',
  QUEM_SOU_EU: 'quem-sou-eu',
  RETRATO_FALADO: 'retrato-falado',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  SUPER_CAMPEONATO: 'super-campeonato',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  TREVO_DA_SORTE: 'trevo-da-sorte',
  UE_SO_ISSO: 'ue-so-isso',
  VENDAVAL_DE_PALPITE: 'vendaval-de-palpite',
};

export const THEME_COLORS = {
  BLOOD: '#ab0d17', // dark red
  DEFAULT: '#1890ff',
  GRASS: '#007A5A',
  FOREST: '#227168',
  HOT_PINK: '#FF47DA',
  LIME: '#1CC41C',
  MIDNIGHT: '#4B2142', // dark teal
  ORANGE: '#ea7702',
  PLUMP_PURPLE: '#6052a8',
  RUSSIAN_VIOLET: '#301A4B', // dark purple
  SLATE: '#7d8388', // gray
  WINE: '#4B2142',
  WOOD: '#8C4103', // brown,
  MOSS: '#9ea63b', //green ish
};
