export const COMUNICACAO_ALIENIGENA_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  ALIEN_SELECTION: 'ALIEN_SELECTION',
  HUMAN_ASK: 'HUMAN_ASK',
  ALIEN_ANSWER: 'ALIEN_ANSWER',
  ALIEN_REQUEST: 'ALIEN_REQUEST',
  OFFERINGS: 'OFFERINGS',
  REVEAL: 'REVEAL',
  GAME_OVER: 'GAME_OVER',
};

export const COMUNICACAO_ALIENIGENA_ACTIONS = {
  SUBMIT_ALIEN: 'SUBMIT_ALIEN',
  SUBMIT_HUMAN_INQUIRY: 'SUBMIT_HUMAN_INQUIRY',
  SUBMIT_ALIEN_RESPONSE: 'SUBMIT_ALIEN_RESPONSE',
  SUBMIT_ALIEN_REQUEST: 'SUBMIT_ALIEN_REQUEST',
  SUBMIT_OFFERING: 'SUBMIT_OFFERING',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 4,
};

export const MAX_ROUNDS = 12;

export const TOTAL_ITEMS = 25;

export const AVAILABLE_ITEMS_COUNT = 100;
// export const UNAVAILABLE_GLYPHS = [
//   // 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 68, 69, 70, 71, 72, 73, 83, 86, 87, 89, 90, 91, 92, 93, 97, 98, 99,
//   // 101, 111, 112, 113, 116, 118, 119, 120, 121, 123, 124, 125, 132, 136, 137, 138, 139, 141, 142, 143, 144,
//   // 145, 146, 147, 150, 151, 153, 154, 155, 157, 158, 159, 161, 162, 163, 168, 177, 181, 183, 186, 187, 188,
//   // 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 208, 209, 210,
//   // 212, 213, 214, 217, 218, 220, 222, 223, 229, 230, 231, 232, 233, 237, 256, 259, 260, 261, 262, 263, 264,
//   // 265, 268, 269, 270, 272, 306, 339, 340, 341, 342, 343, 347, 349, 354, 355, 356, 357, 358, 360, 361, 362,
//   // 363, 364, 365,
// ];

export const ITEMS_COUNT = {
  2: {
    answers: 8,
    required: 6,
    curses: 4,
    rounds: 12,
  },
  3: {
    answers: 8,
    required: 8,
    curses: 4,
    rounds: 10,
  },
  4: {
    answers: 8,
    required: 8,
    curses: 6,
    rounds: 10,
  },
};

export const ATTRIBUTES = [
  {
    en: 'Alive',
    pt: 'Vivo',
  },
  {
    en: 'Big',
    pt: 'Grande',
  },
  {
    en: 'Food',
    pt: 'Comida',
  },
  {
    en: 'Danger',
    pt: 'Perigo',
  },
  {
    en: 'Round',
    pt: 'Redondo',
  },
  {
    en: 'Solid',
    pt: 'Sólido',
  },
  {
    en: 'Liquid',
    pt: 'Líquido',
  },
  {
    en: 'Sharp',
    pt: 'Afiado',
  },
  {
    en: 'Human',
    pt: 'Humano',
  },
  {
    en: 'Plant',
    pt: 'Planta',
  },
  {
    en: 'Tool',
    pt: 'Ferramenta',
  },
  {
    en: 'Weapon',
    pt: 'Arma',
  },
  {
    en: 'Metal',
    pt: 'Metal',
  },
  {
    en: 'Beautiful',
    pt: 'Bonito',
  },
  {
    en: 'Clothes',
    pt: 'Vestimenta',
  },
  {
    en: 'Long',
    pt: 'Longo',
  },
  {
    en: 'Heavy',
    pt: 'Pesado',
  },
  {
    en: 'Bright',
    pt: 'Brilho',
  },
  {
    en: 'Flight',
    pt: 'Vôo',
  },
  {
    en: 'Valuable',
    pt: 'Valioso',
  },
  {
    en: 'Warm',
    pt: 'Quente',
  },
  {
    en: 'Defense',
    pt: 'Defesa',
  },
  {
    en: 'Knowledge',
    pt: 'Sabedoria',
  },
  {
    en: 'Fast',
    pt: 'Rápido',
  },
  {
    en: 'Power',
    pt: 'Força',
  },
];

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
};
