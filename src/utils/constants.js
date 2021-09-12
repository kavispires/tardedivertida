/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL = {
  BANNERS: `${process.env.PUBLIC_URL}/images/banners/`,
  RULES: `${process.env.PUBLIC_URL}/images/rules/`,
  CARDS: `${process.env.PUBLIC_URL}/images/cards/`,
  ROOT: `${process.env.PUBLIC_URL}/images/`,
  RESOURCES: `${process.env.PUBLIC_URL}/resources/`,
};

/**
 * List of tags translation and color
 */
export const TAG_DICT = {
  competitive: {
    label: 'competitivo',
    color: 'red',
  },
  cooperative: {
    label: 'cooperativo',
    color: 'green',
  },
  traitor: {
    label: 'inimigo',
    color: 'volcano',
  },
  'real-time': {
    label: 'juntos',
    color: 'volcano',
  },
  'turn-based': {
    label: 'vez',
    color: 'volcano',
  },
  timed: {
    label: 'tempo',
    color: 'orange',
  },
  drawing: {
    label: 'desenho',
    color: 'gold',
  },
  guessing: {
    label: 'adivinhar',
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
};

/**
 * List of avatar ids
 */
export const AVATARS = {
  0: {
    id: '0',
    description: { pt: 'o axolote', en: 'the axolotl' },
    color: '#da70d6',
  },
  1: {
    id: '1',
    description: { pt: 'a tartaruga', en: 'the turtle' },
    color: '#008080',
  },
  2: {
    id: '2',
    description: { pt: 'a raposa', en: 'the fox' },
    color: '#d2691e',
  },
  3: {
    id: '3',
    description: { pt: 'o sapo', en: 'the toad' },
    color: '#556b2f',
  },
  4: {
    id: '4',
    description: { pt: 'a salamandra', en: 'the lizard' },
    color: '#7cc44f',
  },
  5: {
    id: '5',
    description: { pt: 'a toupeira', en: 'the mole' },
    color: '#2f4f4f',
  },
  6: {
    id: '6',
    description: { pt: 'o esquilo', en: 'the squirrel' },
    color: '#ff6347',
  },
  7: {
    id: '7',
    description: { pt: 'o corvo', en: 'the starling' },
    color: '#4682b4',
  },
  8: {
    id: '8',
    description: { pt: 'a lontra', en: 'the otter' },
    color: '#d2a467',
  },
  9: {
    id: '9',
    description: { pt: 'o camundongo', en: 'the mouse' },
    color: '#7fb5c7',
  },
  10: {
    id: '10',
    description: { pt: 'o sabiá', en: 'the cardinal' },
    color: '#b22222',
  },
  11: {
    id: '11',
    description: { pt: 'a coruja', en: 'the owl' },
    color: '#9370db',
  },
  12: {
    id: '12',
    description: { pt: 'o porco-espinho', en: 'the hedgehog' },
    color: '#778899',
  },
  13: {
    id: '13',
    description: { pt: 'o ornitorrinco', en: 'the platypus' },
    color: '#663399',
  },
  14: {
    id: '14',
    description: { pt: 'o rato', en: 'the rat' },
    color: '#696969',
  },
  15: {
    id: '15',
    description: { pt: 'a rã', en: 'the frog' },
    color: '#20212e',
  },
  16: {
    id: '16',
    description: { pt: 'o caramujo', en: 'the snail' },
    color: '#9884b4',
  },
  17: {
    id: '17',
    description: { pt: 'a abelha', en: 'the bee' },
    color: '#dfb231',
  },
  18: {
    id: '18',
    description: { pt: 'o morcego', en: 'the bat' },
    color: '#875131',
  },
  19: {
    id: '19',
    description: { pt: 'o gato', en: 'the cat' },
    color: '#db8a34',
  },
  20: {
    id: '20',
    description: { pt: 'o coelho', en: 'the rabbit' },
    color: '#eb3465',
  },
  21: {
    id: '21',
    description: { pt: 'a aranha', en: 'the spider' },
    color: '#2b1752',
  },
  22: {
    id: '22',
    description: { pt: 'a borboleta', en: 'the butterfly' },
    color: '#3c58ac',
  },
  23: {
    id: '23',
    description: { pt: 'o arminho', en: 'the stoat' },
    color: '#bdb74c',
  },
  24: {
    id: '24',
    description: { pt: 'o porco', en: 'the pig' },
    color: '#dd9fbd',
  },
};

export const AVAILABLE_AVATAR_IDS = Object.keys(AVATARS);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const SEPARATOR = '::';

/**
 * Random names used during Dev
 */
export const RANDOM_NAMES = 'Abe,Bob,Cam,Dan,Eva,Fin,Gus,Hal,Ian,Jan,Kim,Leo,Max,Nic,Ole,Pat,Quinn,Roy,Tim'.split(
  ','
);

/**
 * Enum of available games
 */
export const GAME_COLLECTION = {
  ARTE_RUIM: 'arte-ruim',
  CONTADORES_HISTORIAS: 'contadores-historias',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  MENTE_COLETIVA: 'mente-coletiva',
  ONDA_TELEPATICA: 'onda-telepatica',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
};

/**
 * Enum of Game Phases
 */
export const PHASES = {
  ARTE_RUIM: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    DRAW: 'DRAW',
    EVALUATION: 'EVALUATION',
    GALLERY: 'GALLERY',
    GAME_OVER: 'GAME_OVER',
  },
  CONTADORES_HISTORIAS: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    STORY: 'STORY',
    CARD_PLAY: 'CARD_PLAY',
    VOTING: 'VOTING',
    RESOLUTION: 'RESOLUTION',
    GAME_OVER: 'GAME_OVER',
  },
  DETETIVES_IMAGINATIVOS: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    SECRET_CLUE: 'SECRET_CLUE',
    CARD_PLAY: 'CARD_PLAY',
    DEFENSE: 'DEFENSE',
    VOTING: 'VOTING',
    REVEAL: 'REVEAL',
    GAME_OVER: 'GAME_OVER',
  },
  ESPIAO_ENTRE_NOS: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    ASSIGNMENT: 'ASSIGNMENT',
    INVESTIGATION: 'INVESTIGATION',
    ASSESSMENT: 'ASSESSMENT',
    FINAL_ASSESSMENT: 'FINAL_ASSESSMENT',
    RESOLUTION: 'RESOLUTION',
    GAME_OVER: 'GAME_OVER',
  },
  MENTE_COLETIVA: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    QUESTION_SELECTION: 'QUESTION_SELECTION',
    EVERYBODY_WRITES: 'EVERYBODY_WRITES',
    COMPARE: 'COMPARE',
    RESOLUTION: 'RESOLUTION',
    GAME_OVER: 'GAME_OVER',
  },
  ONDA_TELEPATICA: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    DIAL_SIDES: 'DIAL_SIDES',
    DIAL_CLUE: 'DIAL_CLUE',
    GUESS: 'GUESS',
    RIVAL_GUESS: 'RIVAL_GUESS',
    REVEAL: 'REVEAL',
    GAME_OVER: 'GAME_OVER',
  },
  POLEMICA_DA_VEZ: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    TOPIC_SELECTION: 'TOPIC_SELECTION',
    REACT: 'REACT',
    RESOLUTION: 'RESOLUTION',
    GAME_OVER: 'GAME_OVER',
  },
  SONHOS_PESADELOS: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    TELL_DREAM: 'TELL_DREAM',
    MATCH: 'MATCH',
    RESOLUTION: 'RESOLUTION',
    LAST_CHANCE: 'LAST_CHANCE',
    GAME_OVER: 'GAME_OVER',
  },
  TESTEMUNHA_OCULAR: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    WITNESS_SELECTION: 'WITNESS_SELECTION',
    QUESTION_SELECTION: 'QUESTION_SELECTION',
    QUESTIONING: 'QUESTIONING',
    TRIAL: 'TRIAL',
    GAME_OVER: 'GAME_OVER',
  },
  UE_SO_ISSO: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    SETUP: 'SETUP',
    WORD_SELECTION: 'WORD_SELECTION',
    SUGGEST: 'SUGGEST',
    COMPARE: 'COMPARE',
    GUESS: 'GUESS',
    GAME_OVER: 'GAME_OVER',
  },
};
