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

type TagDict = {
  [key: string]: {
    label: DualLanguageValue;
    color: string;
  };
};

/**
 * List of tags translation and color
 */
export const TAG_DICT: TagDict = {
  // About Dynamics
  competitive: {
    label: {
      en: 'competitive',
      pt: 'competitivo',
    },
    color: 'red',
  },
  cooperative: {
    label: {
      en: 'cooperative',
      pt: 'cooperativo',
    },
    color: 'green',
  },
  'same-time': {
    label: {
      en: 'same time',
      pt: 'todos juntos',
    },
    color: 'volcano',
  },
  'turn-based': {
    label: {
      en: 'turn based',
      pt: 'um por vez',
    },
    color: 'volcano',
  },
  // About Skilled Mechanics
  drawing: {
    label: {
      en: 'drawing',
      pt: 'desenhar',
    },
    color: 'cyan',
  },
  writing: {
    label: {
      en: 'writing',
      pt: 'escrever',
    },
    color: 'cyan',
  },
  // About General Mechanics
  guessing: {
    label: {
      en: 'guessing',
      pt: 'adivinhar',
    },
    color: 'geekblue',
  },
  voting: {
    label: {
      en: 'voting',
      pt: 'votação',
    },
    color: 'geekblue',
  },
  pairing: {
    label: {
      en: 'pairing',
      pt: 'parear',
    },
    color: 'geekblue',
  },
  // About Feeling inducing
  'push-your-luck': {
    label: {
      en: 'push your luck',
      pt: 'sorte',
    },
    color: 'lime',
  },
  'brain-burner': {
    label: {
      en: 'brain burner',
      pt: 'sofrimento',
    },
    color: 'lime',
  },
  discussion: {
    label: {
      en: 'discussion',
      pt: 'discussão',
    },
    color: 'lime',
  },
  // About Features
  timed: {
    label: {
      en: 'timed',
      pt: 'cronometrado',
    },
    color: 'yellow',
  },
  traitor: {
    label: {
      en: 'traitor',
      pt: 'traidor',
    },
    color: 'volcano',
  },
  images: {
    label: {
      en: 'images',
      pt: 'imagens',
    },
    color: 'purple',
  },
  achievements: {
    label: {
      en: 'achievements',
      pt: 'medalhas',
    },
    color: 'gold',
  },
  // Technical
  'mobile-friendly': {
    label: {
      en: 'mobile-friendly',
      pt: 'aparelho móvel',
    },
    color: '',
  },
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
  CONTADORES_HISTORIAS: 'contadores-historias',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  DESENHO_RAPIDAO: 'desenho-rapidao',
  GALERIA_DE_SONHOS: 'galeria-de-sonhos',
  CRIMES_HEDIONDOS: 'crimes-hediondos',
  INSTRUMENTOS_CODIFICADOS: 'instrumentos-codificados',
  PALHETA_DE_CORES: 'palheta-de-cores',
  LINHAS_CRUZADAS: 'linhas-cruzadas',
  MENTE_COLETIVA: 'mente-coletiva',
  NA_RUA_DO_MEDO: 'na-rua-do-medo',
  ONDA_TELEPATICA: 'onda-telepatica',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  QUEM_NAO_MATA: 'quem-nao-mata',
  RETRATO_FALADO: 'retrato-falado',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
  VENDAVAL_DE_PALPITE: 'vendaval-de-palpite',
  SUPER_CAMPEONATO: 'super-campeonato',
  CRUZA_PALAVRAS: 'cruza-palavras',
  TREVO_DA_SORTE: 'trevo-da-sorte',
};

export const THEME_COLORS = {
  BLOOD: '#ab0d17', // dark red
  DEFAULT: '#1890ff',
  GRASS: '#007A5A',
  FOREST: '#227168',
  HOT_PINK: '#FF47DA',
  LIME: '#1CC41C',
  MIDNIGHT: '#4B2142', // dark teal
  ORANGE: '#F55E00',
  PLUMP_PURPLE: '#6052a8',
  RUSSIAN_VIOLET: '#301A4B', // dark purple
  WINE: '#4B2142',
  WOOD: '#8C4103', // brown
};
