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
  SUBMIT_OFFERINGS: 'SUBMIT_OFFERINGS',
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
    required: 5,
    curses: 8,
    rounds: 10,
  },
  3: {
    answers: 8,
    required: 6,
    curses: 7,
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

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
};
