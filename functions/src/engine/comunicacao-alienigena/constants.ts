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

export const ATTRIBUTES = {
  alive: { id: 'alive', name: { en: 'Alive', pt: 'Vivo' } },
  beautiful: { id: 'beautiful', name: { en: 'Beautiful', pt: 'Bonito' } },
  big: { id: 'big', name: { en: 'Big', pt: 'Grande' } },
  bright: { id: 'bright', name: { en: 'Bright', pt: 'Brilho' } },
  clothes: { id: 'clothes', name: { en: 'Clothes', pt: 'Vestimenta' } },
  danger: { id: 'danger', name: { en: 'Danger', pt: 'Perigo' } },
  defense: { id: 'defense', name: { en: 'Defense', pt: 'Defesa' } },
  fast: { id: 'fast', name: { en: 'Fast', pt: 'Rápido' } },
  flat: { id: 'flat', name: { en: 'Flat', pt: 'Plano' } }, // New
  flight: { id: 'flight', name: { en: 'Flight', pt: 'Vôo' } },
  food: { id: 'food', name: { en: 'Food', pt: 'Comida' } },
  hard: { id: 'hard', name: { en: 'Hard', pt: 'Duro' } }, // New
  heavy: { id: 'heavy', name: { en: 'Heavy', pt: 'Pesado' } },
  human: { id: 'human', name: { en: 'Human', pt: 'Humano' } },
  knowledge: { id: 'knowledge', name: { en: 'Knowledge', pt: 'Conhecimento' } },
  liquid: { id: 'liquid', name: { en: 'Liquid', pt: 'Líquido' } },
  long: { id: 'long', name: { en: 'Long', pt: 'Longo' } },
  machine: { id: 'machine', name: { en: 'Machine', pt: 'Máquina' } }, // New
  metal: { id: 'metal', name: { en: 'Metal', pt: 'Metal' } },
  odor: { id: 'odor', name: { en: 'Odor', pt: 'Cheiro' } }, // New
  old: { id: 'old', name: { en: 'Old', pt: 'Velho' } }, // New
  plant: { id: 'plant', name: { en: 'Plant', pt: 'Planta' } },
  power: { id: 'power', name: { en: 'Power', pt: 'Força' } },
  round: { id: 'round', name: { en: 'Round', pt: 'Redondo' } },
  sharp: { id: 'sharp', name: { en: 'Sharp', pt: 'Afiado' } },
  sound: { id: 'sound', name: { en: 'Sound', pt: 'Som' } }, // New
  tool: { id: 'tool', name: { en: 'Tool', pt: 'Ferramenta' } },
  valuable: { id: 'valuable', name: { en: 'Valuable', pt: 'Valioso' } },
  warm: { id: 'warm', name: { en: 'Warm', pt: 'Quente' } },
  weapon: { id: 'weapon', name: { en: 'Weapon', pt: 'Arma' } },
};

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
};
