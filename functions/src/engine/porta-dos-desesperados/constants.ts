export const PORTA_DOS_DESESPERADOS_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  BOOK_POSSESSION: 'BOOK_POSSESSION',
  DOOR_CHOICE: 'DOOR_CHOICE',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
};

export const PORTA_DOS_DESESPERADOS_ACTIONS = {
  SUBMIT_PAGES: 'SUBMIT_PAGES',
  SUBMIT_DOOR: 'SUBMIT_DOOR',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const MAX_ROUNDS = 15;

export const MAGIC_UNITS_PER_PLAYER_COUNT = {
  2: 12,
  3: 12,
  4: 12,
  5: 20,
  6: 20,
  7: 28,
  8: 28,
  9: 30,
  10: 30,
};

export const DOOR_OPTIONS_PER_ROUND = 6;

export const DOOR_LEVELS = 7;

export const PAGES_PER_ROUND = 8;

export const TRAPS = {
  // No traps
  NONE: 'NONE',
  // Clue Phase: 3 book clues are used
  MORE_CLUES: 'MORE_CLUES',
  // Clue Phase: Possessed player can only see 4 cards
  FEWER_PAGES: 'FEWER_PAGES',
  // Guess Phase: Pages are tinted
  SEPIA: 'SEPIA',
  // Guess Phase: Pages have pattern on top of it
  PATTERN: 'PATTERN',
  // Guess Phase: Cards can't be enlarged
  NO_PREVIEW: 'NO_PREVIEW',
  // Guess Phase: Players can't communicate
  SILENCE: 'SILENCE',
  // Guess Phase: Players can't see door #4 but can still choose it
  LOCKED_DOOR: 'LOCKED_DOOR',
  // Guess Phase: PLayers have 7 doors to choose from
  EXTRA_DOOR: 'EXTRA_DOOR',
  // Guess Phase: This turn all magic use is doubled
  DOUBLE_MAGIC: 'DOUBLE_MAGIC',
  // Guess Phase: Doors are revealed one at a time and players must choose in order
  ORDERED_DOORS: 'ORDERED_DOORS',
  // Guess Phase: PLayers don't see what others are choosing
  SECRET_CHOICE: 'SECRET_CHOICE',
};
