/**
 * Avatar and bot color configuration constants
 *
 * Color palettes with hue values for avatar selection and distance calculations
 */
export const AVATARS_COLORS = {
  '0': {
    color: '#b22222',
    hue: 0,
  },
  '1': {
    color: '#661613',
    hue: 2,
  },
  '2': {
    color: '#eb5b41',
    hue: 9,
  },
  '3': {
    color: '#6b3626',
    hue: 14,
  },
  '4': {
    color: '#874f31',
    hue: 21,
  },
  '5': {
    color: '#f07f3a',
    hue: 23,
  },
  '6': {
    color: '#d25d1e',
    hue: 21,
  },
  '7': {
    color: '#a67653',
    hue: 25,
  },
  '8': {
    color: '#DB8A34',
    hue: 31,
  },
  '9': {
    color: '#D2A467',
    hue: 34,
  },
  '10': {
    color: '#544a39',
    hue: 38,
  },
  '11': {
    color: '#dfb231',
    hue: 44,
  },
  '12': {
    color: '#c49f19',
    hue: 47,
  },
  '13': {
    color: '#e3c642',
    hue: 49,
  },
  '14': {
    color: '#757468',
    hue: 55,
  },
  '15': {
    color: '#BDB74C',
    hue: 57,
  },
  '16': {
    color: '#808536',
    hue: 64,
  },
  '17': {
    color: '#a7bf4e',
    hue: 73,
  },
  '18': {
    color: '#81b029',
    hue: 81,
  },
  '19': {
    color: '#556b2f',
    hue: 82,
  },
  '20': {
    color: '#35402c',
    hue: 93,
  },
  '21': {
    color: '#7cc44f',
    hue: 97,
  },
  '22': {
    color: '#646964',
    hue: 120,
  },
  '23': {
    color: '#3a874b',
    hue: 133,
  },
  '24': {
    color: '#58cc80',
    hue: 141,
  },
  '25': {
    color: '#0e4a33',
    hue: 157,
  },
  '26': {
    color: '#008077',
    hue: 176,
  },
  '27': {
    color: '#2f4d4f',
    hue: 184,
  },
  '28': {
    color: '#11788c',
    hue: 190,
  },
  '29': {
    color: '#7fb5c7',
    hue: 195,
  },
  '30': {
    color: '#4682b4',
    hue: 207,
  },
  '31': {
    color: '#778899',
    hue: 210,
  },
  '32': {
    color: '#4085d4',
    hue: 212,
  },
  '33': {
    color: '#495f8a',
    hue: 220,
  },
  '34': {
    color: '#1b284a',
    hue: 223,
  },
  '35': {
    color: '#3c58ac',
    hue: 225,
  },
  '36': {
    color: '#707fcc',
    hue: 230,
  },
  '37': {
    color: '#3d407a',
    hue: 237,
  },
  '38': {
    color: '#857bdb',
    hue: 246,
  },
  '39': {
    color: '#2e1d66',
    hue: 254,
  },
  '40': {
    color: '#9584b4',
    hue: 261,
  },
  '41': {
    color: '#663399',
    hue: 270,
  },
  '42': {
    color: '#5a2b5e',
    hue: 295,
  },
  '43': {
    color: '#da70d6',
    hue: 302,
  },
  '44': {
    color: '#e08dcc',
    hue: 314,
  },
  '45': {
    color: '#dd9fbd',
    hue: 331,
  },
  '46': {
    color: '#ab225b',
    hue: 335,
  },
  '47': {
    color: '#eb4773',
    hue: 344,
  },
  '48': {
    color: '#d13640',
    hue: 356,
  },
  '49': {
    color: '#ff4346',
    hue: 359,
  },
  '50': {
    color: '#d47b66',
    hue: 12,
  },
  '51': {
    color: '#598252',
    hue: 111,
  },
  '52': {
    color: '#3d7191',
    hue: 202,
  },
  '53': {
    color: '#954aba',
    hue: 280,
  },
  '54': {
    color: '#a33127',
    hue: 5,
  },
  '55': {
    color: '#ab7240',
    hue: 28,
  },
} as const;

/**
 * Bot colors that are distant from player colors and from each other, with their hue for distance calculations. These colors are only used for bots and neutral decks, they are not available for players.
 */
export const BOT_COLORS = {
  A: {
    color: '#826f67',
    hue: 18,
    botOnly: true,
  },
  B: {
    color: '#6b8267',
    hue: 111,
    botOnly: true,
  },
  C: {
    color: '#677182',
    hue: 218,
    botOnly: true,
  },
  D: {
    color: '#6b6782',
    hue: 249,
    botOnly: true,
  },
  E: {
    color: '#826773',
    hue: 333,
    botOnly: true,
  },
  T: {
    color: '#797e5c',
    hue: 69,
    botOnly: true,
  },
  N: {
    color: '#cccccc',
    hue: 0,
    botOnly: true,
  },
} as const;
