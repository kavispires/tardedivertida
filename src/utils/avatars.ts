import { orderBy } from 'lodash';

type AvatarDict = {
  [key: string]: {
    id: string;
    description: {
      pt: string;
      en: string;
    };
    color: string;
    hue?: number; // Only present in players avatars
  };
};

/**
 * List of avatar ids
 */
export const AVATARS: AvatarDict = {
  '0': {
    id: '0',
    description: {
      pt: 'o sabiá',
      en: 'the cardinal',
    },
    color: '#b22222',
    hue: 0,
  },
  '1': {
    id: '1',
    description: {
      pt: 'o porquinho-da-índia',
      en: 'the guinea pig',
    },
    color: '#661613',
    hue: 2,
  },
  '2': {
    id: '2',
    description: {
      pt: 'o esquilo',
      en: 'the squirrel',
    },
    color: '#eb5b41',
    hue: 9,
  },
  '3': {
    id: '3',
    description: {
      pt: 'a formiga',
      en: 'the ant',
    },
    color: '#6b3626',
    hue: 14,
  },
  '4': {
    id: '4',
    description: {
      pt: 'o cachorro',
      en: 'the dog',
    },
    color: '#874f31',
    hue: 21,
  },
  '5': {
    id: '5',
    description: {
      pt: 'o tucano',
      en: 'the toucan',
    },
    color: '#f07f3a',
    hue: 23,
  },
  '6': {
    id: '6',
    description: {
      pt: 'a raposa',
      en: 'the fox',
    },
    color: '#d25d1e',
    hue: 21,
  },
  '7': {
    id: '7',
    description: {
      pt: 'o macaco',
      en: 'the monkey',
    },
    color: '#a67653',
    hue: 25,
  },
  '8': {
    id: '8',
    description: {
      pt: 'o gato',
      en: 'the cat',
    },
    color: '#DB8A34',
    hue: 31,
  },
  '9': {
    id: '9',
    description: {
      pt: 'a lontra',
      en: 'the otter',
    },
    color: '#D2A467',
    hue: 34,
  },
  '10': {
    id: '10',
    description: {
      pt: 'o gambá',
      en: 'the skunk',
    },
    color: '#544a39',
    hue: 38,
  },
  '11': {
    id: '11',
    description: {
      pt: 'a abelha',
      en: 'the bee',
    },
    color: '#dfb231',
    hue: 44,
  },
  '12': {
    id: '12',
    description: {
      pt: 'o galo',
      en: 'the rooster',
    },
    color: '#c49f19',
    hue: 47,
  },
  '13': {
    id: '13',
    description: {
      pt: 'a rolinha',
      en: 'the pigeon',
    },
    color: '#e3c642',
    hue: 49,
  },
  '14': {
    id: '14',
    description: {
      pt: 'o timbu',
      en: 'the possum',
    },
    color: '#757468',
    hue: 55,
  },
  '15': {
    id: '15',
    description: {
      pt: 'o arminho',
      en: 'the stoat',
    },
    color: '#BDB74C',
    hue: 57,
  },
  '16': {
    id: '16',
    description: {
      pt: 'o dinossauro',
      en: 'the dinosaur',
    },
    color: '#808536',
    hue: 64,
  },
  '17': {
    id: '17',
    description: {
      pt: 'a minhoca',
      en: 'the worm',
    },
    color: '#a7bf4e',
    hue: 73,
  },
  '18': {
    id: '18',
    description: {
      pt: 'o cavalo marinho',
      en: 'the seahorse',
    },
    color: '#81b029',
    hue: 81,
  },
  '19': {
    id: '19',
    description: {
      pt: 'o sapo',
      en: 'the toad',
    },
    color: '#556b2f',
    hue: 82,
  },
  '20': {
    id: '20',
    description: {
      pt: 'a rã',
      en: 'the frog',
    },
    color: '#35402c',
    hue: 93,
  },
  '21': {
    id: '21',
    description: {
      pt: 'a salamandra',
      en: 'the lizard',
    },
    color: '#7cc44f',
    hue: 97,
  },
  '22': {
    id: '22',
    description: {
      pt: 'o rato',
      en: 'the rat',
    },
    color: '#646964',
    hue: 120,
  },
  '23': {
    id: '23',
    description: {
      pt: 'o pato',
      en: 'the duck',
    },
    color: '#3a874b',
    hue: 133,
  },
  '24': {
    id: '24',
    description: {
      pt: 'a planta carnívora',
      en: 'the venus flytrap',
    },
    color: '#58cc80',
    hue: 141,
  },
  '25': {
    id: '25',
    description: {
      pt: 'o quiuí',
      en: 'the kiwi',
    },
    color: '#0e4a33',
    hue: 157,
  },
  '26': {
    id: '26',
    description: {
      pt: 'a tartaruga',
      en: 'the turtle',
    },
    color: '#008077',
    hue: 176,
  },
  '27': {
    id: '27',
    description: {
      pt: 'a toupeira',
      en: 'the mole',
    },
    color: '#2f4d4f',
    hue: 184,
  },
  '28': {
    id: '28',
    description: {
      pt: 'o pinguim',
      en: 'the penguin',
    },
    color: '#11788c',
    hue: 190,
  },
  '29': {
    id: '29',
    description: {
      pt: 'o camundongo',
      en: 'the mouse',
    },
    color: '#7fb5c7',
    hue: 195,
  },
  '30': {
    id: '30',
    description: {
      pt: 'o corvo',
      en: 'the starling',
    },
    color: '#4682b4',
    hue: 207,
  },
  '31': {
    id: '31',
    description: {
      pt: 'o porco-espinho',
      en: 'the hedgehog',
    },
    color: '#778899',
    hue: 210,
  },
  '32': {
    id: '32',
    description: {
      pt: 'o peixe',
      en: 'the fish',
    },
    color: '#4085d4',
    hue: 212,
  },
  '33': {
    id: '33',
    description: {
      pt: 'a lula',
      en: 'the squid',
    },
    color: '#495f8a',
    hue: 220,
  },
  '34': {
    id: '34',
    description: {
      pt: 'o guaxinim',
      en: 'the racoon',
    },
    color: '#1b284a',
    hue: 223,
  },
  '35': {
    id: '35',
    description: {
      pt: 'a borboleta',
      en: 'the butterfly',
    },
    color: '#3c58ac',
    hue: 225,
  },
  '36': {
    id: '36',
    description: {
      pt: 'a arraia',
      en: 'the manta ray',
    },
    color: '#707fcc',
    hue: 230,
  },
  '37': {
    id: '37',
    description: {
      pt: 'a água-viva',
      en: 'the jellyfish',
    },
    color: '#3d407a',
    hue: 237,
  },
  '38': {
    id: '38',
    description: {
      pt: 'a coruja',
      en: 'the owl',
    },
    color: '#857bdb',
    hue: 246,
  },
  '39': {
    id: '39',
    description: {
      pt: 'a aranha',
      en: 'the spider',
    },
    color: '#2e1d66',
    hue: 254,
  },
  '40': {
    id: '40',
    description: {
      pt: 'o caramujo',
      en: 'the snail',
    },
    color: '#9584b4',
    hue: 261,
  },
  '41': {
    id: '41',
    description: {
      pt: 'o ornitorrinco',
      en: 'the platypus',
    },
    color: '#663399',
    hue: 270,
  },
  '42': {
    id: '42',
    description: {
      pt: 'o morcego',
      en: 'the bat',
    },
    color: '#5a2b5e',
    hue: 295,
  },
  '43': {
    id: '43',
    description: {
      pt: 'o axolote',
      en: 'the axolotl',
    },
    color: '#da70d6',
    hue: 302,
  },
  '44': {
    id: '44',
    description: {
      pt: 'a libélula',
      en: 'the dragonfly',
    },
    color: '#e08dcc',
    hue: 314,
  },
  '45': {
    id: '45',
    description: {
      pt: 'o porco',
      en: 'the pig',
    },
    color: '#dd9fbd',
    hue: 331,
  },
  '46': {
    id: '46',
    description: {
      pt: 'o beija-flor',
      en: 'the humming bird',
    },
    color: '#ab225b',
    hue: 335,
  },
  '47': {
    id: '47',
    description: {
      pt: 'o coelho',
      en: 'the rabbit',
    },
    color: '#eb4773',
    hue: 344,
  },
  '48': {
    id: '48',
    description: {
      pt: 'o caranguejo',
      en: 'the crab',
    },
    color: '#d13640',
    hue: 356,
  },
  '49': {
    id: '49',
    description: {
      pt: 'o escorpião',
      en: 'the scorpion',
    },
    color: '#ff4346',
    hue: 359,
  },
  A: {
    id: 'A',
    description: {
      pt: 'o robô A',
      en: 'the bot A',
    },
    color: '#826f67',
    hue: 18,
  },
  B: {
    id: 'B',
    description: {
      pt: 'o robô B',
      en: 'the bot B',
    },
    color: '#6b8267',
    hue: 111,
  },
  C: {
    id: 'C',
    description: {
      pt: 'o robô C',
      en: 'the bot C',
    },
    color: '#677182',
    hue: 218,
  },
  D: {
    id: 'D',
    description: {
      pt: 'o robô D',
      en: 'the bot D',
    },
    color: '#6b6782',
    hue: 249,
  },
  E: {
    id: 'E',
    description: {
      pt: 'o robô E',
      en: 'the bot E',
    },
    color: '#826773',
    hue: 333,
  },
  T: {
    id: 'T',
    description: {
      pt: 'o alienígena robô',
      en: 'the alien bot',
    },
    color: '#797e5c',
    hue: 69,
  },
  N: {
    id: 'N',
    description: {
      pt: 'desconhecido',
      en: 'unknown',
    },
    color: '#cccccc',
    hue: 0,
  },
};

export const BOTS = {
  A: {
    id: 'A',
    name: 'A-bot',
    avatarId: 'A',
  },
  B: {
    id: 'B',
    name: 'B-bop',
    avatarId: 'B',
  },
  C: {
    id: 'C',
    name: 'C-am',
    avatarId: 'C',
  },
  D: {
    id: 'D',
    name: 'D-Doo',
    avatarId: 'D',
  },
  E: {
    id: 'E',
    name: 'E-max',
    avatarId: 'E',
  },
  T: {
    id: 'T',
    name: 'ET',
    avatarId: 'T',
  },
};

export const BOTS_LIST = Object.values(BOTS);

export const AVAILABLE_AVATAR_IDS: string[] = orderBy(Object.values(AVATARS), ['hue', 'id'])
  .map((a) => a.id)
  .filter((key) => key.match(/^\d+$/));
