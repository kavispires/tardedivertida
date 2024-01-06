export const COMUNICACAO_ALIENIGENA_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  ALIEN_SEEDING: 'ALIEN_SEEDING',
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
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_HUMAN_INQUIRY: 'SUBMIT_HUMAN_INQUIRY',
  SUBMIT_ALIEN_RESPONSE: 'SUBMIT_ALIEN_RESPONSE',
  SUBMIT_ALIEN_REQUEST: 'SUBMIT_ALIEN_REQUEST',
  SUBMIT_OFFERING: 'SUBMIT_OFFERING',
};

export const COMUNICACAO_ALIENIGENA_ACHIEVEMENTS = {
  MOST_QUESTIONED_OBJECTS: 'MOST_QUESTIONED_OBJECTS',
  FEWEST_QUESTIONED_OBJECTS: 'FEWEST_QUESTIONED_OBJECTS',
  SINGLE_OBJECT_INQUIRY: 'SINGLE_OBJECT_INQUIRY',
  MOST_CORRECT_OBJECTS: 'MOST_CORRECT_OBJECTS',
  MOST_BLANK_OBJECTS: 'MOST_BLANK_OBJECTS',
  MOST_CURSED_OBJECTS: 'MOST_CURSED_OBJECTS',
  PLAYED_AS_ALIEN: 'PLAYED_AS_ALIEN',
};

export const PLAYER_COUNTS = {
  MIN: 1,
  MAX: 4,
};

export const MAX_ROUNDS = 12;

export const TOTAL_ITEMS = 25;

export const AVAILABLE_SIGNS = 36;

export const TOTAL_SIGNS = 25;

/**
 * The number of items to be selected for each player count
 * answers is the number of items are available to be offered
 * required is the number of items that must be offered
 * curses is the number of items that are cursed and will remove 1 time unit (round)
 * rounds is the number of rounds in the game
 */
export const ITEMS_COUNT = {
  2: {
    answers: 8,
    required: 6,
    curses: 6,
    rounds: 12,
  },
  3: {
    answers: 8,
    required: 8,
    curses: 6,
    rounds: 10,
  },
  4: {
    answers: 8,
    required: 8,
    curses: 8,
    rounds: 10,
  },
  5: {
    answers: 10,
    required: 8,
    curses: 10,
    rounds: 10,
  },
  6: {
    answers: 10,
    required: 8,
    curses: 12,
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
  // singular: { id: 'singular', name: { en: 'Singular', pt: 'Singular' } }, // deprecated
  soft: { id: 'soft', name: { en: 'Soft', pt: 'Mole' } }, // Newer
  solid: { id: 'solid', name: { en: 'Solid', pt: 'Sólido' } }, // Newer
  sound: { id: 'sound', name: { en: 'Sound', pt: 'Som' } }, // New
  tool: { id: 'tool', name: { en: 'Tool', pt: 'Ferramenta' } },
  valuable: { id: 'valuable', name: { en: 'Valuable', pt: 'Valioso' } },
  warm: { id: 'warm', name: { en: 'Warm', pt: 'Quente' } },
  weapon: { id: 'weapon', name: { en: 'Weapon', pt: 'Arma' } },
  // hard: { id: 'hard', name: { en: 'Hard', pt: 'Duro' } }, // deprecated
  holdable: { id: 'holdable', name: { en: 'Holdable', pt: 'Segurável' } }, // Newest
  personal: { id: 'personal', name: { en: 'Personal', pt: 'Pessoal' } }, // Newest
  multiple: { id: 'multiple', name: { en: 'Multiple', pt: 'Múltiplo' } }, // Newest
  fragile: { id: 'fragile', name: { en: 'Fragile', pt: 'Frágil' } }, // Newest
  toy: { id: 'toy', name: { en: 'Toy', pt: 'Brinquedo' } }, // Newest
  construction: { id: 'construction', name: { en: 'Construction', pt: 'Construção' } }, // Newest
};

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
};
