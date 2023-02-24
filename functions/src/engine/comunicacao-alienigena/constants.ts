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
  MIN: 1,
  MAX: 4,
};

export const MAX_ROUNDS = 12;

export const TOTAL_ITEMS = 25;

export const AVAILABLE_ITEMS_COUNT = 230;

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
  { id: 'alive', name: { en: 'Alive', pt: 'Vivo' } },
  { id: 'beautiful', name: { en: 'Beautiful', pt: 'Bonito' } },
  { id: 'big', name: { en: 'Big', pt: 'Grande' } },
  { id: 'bright', name: { en: 'Bright', pt: 'Brilho' } },
  { id: 'clothes', name: { en: 'Clothes', pt: 'Vestimenta' } },
  { id: 'danger', name: { en: 'Danger', pt: 'Perigo' } },
  { id: 'defense', name: { en: 'Defense', pt: 'Defesa' } },
  { id: 'fast', name: { en: 'Fast', pt: 'Rápido' } },
  { id: 'flight', name: { en: 'Flight', pt: 'Vôo' } },
  { id: 'food', name: { en: 'Food', pt: 'Comida' } },
  { id: 'heavy', name: { en: 'Heavy', pt: 'Pesado' } },
  { id: 'human', name: { en: 'Human', pt: 'Humano' } },
  { id: 'knowledge', name: { en: 'Knowledge', pt: 'Conhecimento' } },
  { id: 'liquid', name: { en: 'Liquid', pt: 'Líquido' } },
  { id: 'long', name: { en: 'Long', pt: 'Longo' } },
  { id: 'metal', name: { en: 'Metal', pt: 'Metal' } },
  { id: 'plant', name: { en: 'Plant', pt: 'Planta' } },
  { id: 'power', name: { en: 'Power', pt: 'Força' } },
  { id: 'round', name: { en: 'Round', pt: 'Redondo' } },
  { id: 'sharp', name: { en: 'Sharp', pt: 'Afiado' } },
  { id: 'solid', name: { en: 'Solid', pt: 'Sólido' } },
  { id: 'tool', name: { en: 'Tool', pt: 'Ferramenta' } },
  { id: 'valuable', name: { en: 'Valuable', pt: 'Valioso' } },
  { id: 'warm', name: { en: 'Warm', pt: 'Quente' } },
  { id: 'weapon', name: { en: 'Weapon', pt: 'Arma' } },
];

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
};
