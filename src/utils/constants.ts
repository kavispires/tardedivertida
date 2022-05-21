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

type AvatarDict = {
  [key: string]: {
    id: string;
    description: {
      pt: string;
      en: string;
    };
    color: string;
  };
};

/**
 * List of avatar ids
 */
export const AVATARS: AvatarDict = {
  0: {
    id: '0',
    description: { pt: 'o sabiá', en: 'the cardinal' },
    color: '#b22222',
  },
  1: {
    id: '1',
    description: { pt: 'o esquilo', en: 'the squirrel' },
    color: '#eb5b41',
  },
  2: {
    id: '2',
    description: { pt: 'a formiga', en: 'the ant' },
    color: '#6b3626',
  },
  3: {
    id: '3',
    description: { pt: 'o cachorro', en: 'the puppy' },
    color: '#874f31',
  },
  4: {
    id: '4',
    description: { pt: 'o escorpião', en: 'the scorpion' },
    color: '#f07f3a',
  },
  5: {
    id: '5',
    description: { pt: 'a raposa', en: 'the fox' },
    color: '#d25d1e',
  },
  6: {
    id: '6',
    description: { pt: 'o macaco', en: 'the monkey' },
    color: '#a67653',
  },
  7: {
    id: '7',
    description: { pt: 'o gato', en: 'the cat' },
    color: '#DB8A34',
  },
  8: {
    id: '8',
    description: { pt: 'a lontra', en: 'the otter' },
    color: '#D2A467',
  },
  9: {
    id: '9',
    description: { pt: 'o gambá', en: 'the skunk' },
    color: '#544a39',
  },
  10: {
    id: '10',
    description: { pt: 'a abelha', en: 'the bee' },
    color: '#dfb231',
  },
  11: {
    id: '11',
    description: { pt: 'a galinha', en: 'the chicken' },
    color: '#e3c642',
  },
  12: {
    id: '12',
    description: { pt: 'o arminho', en: 'the stoat' },
    color: '#BDB74C',
  },
  13: {
    id: '13',
    description: { pt: 'o dinossauro', en: 'the dinosaur' },
    color: '#808536',
  },
  14: {
    id: '14',
    description: { pt: 'a minhoca', en: 'the worm' },
    color: '#a7bf4e',
  },
  15: {
    id: '15',
    description: { pt: 'o cavalo marinho', en: 'the seahorse' },
    color: '#81b029',
  },
  16: {
    id: '16',
    description: { pt: 'o sapo', en: 'the toad' },
    color: '#556b2f',
  },
  17: {
    id: '17',
    description: { pt: 'a rã', en: 'the frog' },
    color: '#35402c',
  },
  18: {
    id: '18',
    description: { pt: 'a salamandra', en: 'the lizard' },
    color: '#7cc44f',
  },
  19: {
    id: '19',
    description: { pt: 'o rato', en: 'the rat' },
    color: '#646964',
  },
  20: {
    id: '20',
    description: { pt: 'o tucano', en: 'the toucan' },
    color: '#3a874b',
  },
  21: {
    id: '21',
    description: { pt: 'a planta carnívora', en: 'the venus flytrap' },
    color: '#58cc80',
  },
  22: {
    id: '22',
    description: { pt: 'o quiuí', en: 'the kiwi' },
    color: '#0e4a33',
  },
  23: {
    id: '23',
    description: { pt: 'a tartaruga', en: 'the turtle' },
    color: '#008077',
  },
  24: {
    id: '24',
    description: { pt: 'a toupeira', en: 'the mole' },
    color: '#2f4d4f',
  },
  25: {
    id: '25',
    description: { pt: 'o pinguim', en: 'the penguin' },
    color: '#11788c',
  },
  26: {
    id: '26',
    description: { pt: 'o camundongo', en: 'the mouse' },
    color: '#7fb5c7',
  },
  27: {
    id: '27',
    description: { pt: 'o corvo', en: 'the starling' },
    color: '#4682b4',
  },
  28: {
    id: '28',
    description: { pt: 'o porco-espinho', en: 'the hedgehog' },
    color: '#778899',
  },
  29: {
    id: '29',
    description: { pt: 'o peixe', en: 'the fish' },
    color: '#4085d4',
  },
  30: {
    id: '30',
    description: { pt: 'a lula', en: 'the squid' },
    color: '#495f8a',
  },
  31: {
    id: '31',
    description: { pt: 'a borboleta', en: 'the butterfly' },
    color: '#3c58ac',
  },
  32: {
    id: '32',
    description: { pt: 'a arraia', en: 'the manta ray' },
    color: '#707fcc',
  },
  33: {
    id: '33',
    description: { pt: 'a água-viva', en: 'the jellyfish' },
    color: '#3d407a',
  },
  34: {
    id: '34',
    description: { pt: 'a coruja', en: 'the owl' },
    color: '#857bdb',
  },
  35: {
    id: '35',
    description: { pt: 'a aranha', en: 'the spider' },
    color: '#2e1d66',
  },
  36: {
    id: '36',
    description: { pt: 'o caramujo', en: 'the snail' },
    color: '#9584b4',
  },
  37: {
    id: '37',
    description: { pt: 'o ornitorrinco', en: 'the platypus' },
    color: '#663399',
  },
  38: {
    id: '38',
    description: { pt: 'o morcego', en: 'the bat' },
    color: '#5a2b5e',
  },
  39: {
    id: '39',
    description: { pt: 'o axolote', en: 'the axolotl' },
    color: '#da70d6',
  },
  40: {
    id: '40',
    description: { pt: 'o libélula', en: 'the dragonfly' },
    color: '#e08dcc',
  },
  41: {
    id: '41',
    description: { pt: 'o porco', en: 'the pig' },
    color: '#dd9fbd',
  },
  42: {
    id: '42',
    description: { pt: 'o beija-flor', en: 'the humming bird' },
    color: '#ab225b',
  },
  43: {
    id: '43',
    description: { pt: 'o coelho', en: 'the rabbit' },
    color: '#eb4773',
  },
  44: {
    id: '44',
    description: { pt: 'o caranguejo', en: 'the crab' },
    color: '#e03a45',
  },
  A: {
    id: 'A',
    description: { pt: 'o robô A', en: 'the bot A' },
    color: '#826f67',
  },
  B: {
    id: 'B',
    description: { pt: 'o robô B', en: 'the bot B' },
    color: '#6b8267',
  },
  '-C': {
    id: 'C',
    description: { pt: 'o robô C', en: 'the bot C' },
    color: '#677182',
  },
  D: {
    id: 'D',
    description: { pt: 'o robô D', en: 'the bot D' },
    color: '#6b6782',
  },
  E: {
    id: 'E',
    description: { pt: 'o robô E', en: 'the bot E' },
    color: '#826773',
  },
  N: {
    id: 'N',
    description: { pt: 'desconhecido', en: 'unknown' },
    color: '#cccccc',
  },
};

export const AVAILABLE_AVATAR_IDS: string[] = Object.keys(AVATARS).filter((key) => key.match(/^\d+$/));

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
  CRUZA_PALAVRAS: 'cruza-palavras',
  TE_CONHECO: 'te-conheco',
};
