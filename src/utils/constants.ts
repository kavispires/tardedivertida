/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL: StringDictionary = {
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
    label: string;
    color: string;
  };
};

/**
 * List of tags translation and color
 */
export const TAG_DICT: TagDict = {
  competitive: {
    label: 'competitivo',
    color: 'red',
  },
  cooperative: {
    label: 'cooperativo',
    color: 'green',
  },
  'same-time': {
    label: 'todos juntos',
    color: 'volcano',
  },
  'turn-based': {
    label: 'um por vez',
    color: 'volcano',
  },
  traitor: {
    label: 'inimigo',
    color: 'volcano',
  },
  timed: {
    label: 'cronometrado',
    color: 'orange',
  },
  drawing: {
    label: 'desenhar',
    color: 'gold',
  },
  guessing: {
    label: 'adivinhar',
    color: 'cyan',
  },
  voting: {
    label: 'votação ',
    color: 'cyan',
  },
  pairing: {
    label: 'parear',
    color: 'cyan',
  },
  writing: {
    label: 'escrever',
    color: 'blue',
  },
  images: {
    label: 'imagens',
    color: 'purple',
  },
  discussion: {
    label: 'discussão/fala',
    color: 'geekblue',
  },
  'push-your-luck': {
    label: 'sorte',
    color: 'pink',
  },
  'mobile-friendly': {
    label: 'aparelho móvel',
    color: 'gray',
  },
};

export const LETTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const SEPARATOR: string = ';;';

export const LATEST_GAME_IDS: string = 'latestGameIds';

export const ADMIN_ACTIONS: StringDictionary = {
  GO_TO_NEXT_PHASE: 'GO_TO_NEXT_PHASE',
  FORCE_STATE_PROPERTY: 'FORCE_STATE_PROPERTY',
  PLAY_AGAIN: 'PLAY_AGAIN',
  FORCE_END_GAME: 'FORCE_END_GAME',
};

/**
 * Random names used during Dev
 */
export const RANDOM_NAMES: string[] =
  'Abe,Bob,Cam,Dan,Eva,Fin,Gus,Hal,Ian,Jan,Kim,Leo,Max,Nic,Ole,Pat,Quinn,Roy,Tim'.split(',');

/**
 * Enum of available games
 */
export const GAME_COLLECTION: StringDictionary = {
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
  QUEM_SOU_EU: 'quem-sou-eu',
  RETRATO_FALADO: 'retrato-falado',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
  VENDAVAL_DE_PALPITE: 'vendaval-de-palpite',
  CRUZA_PALAVRAS: 'cruza-palavras',
  TE_CONHECO: 'te-conheco',
};
