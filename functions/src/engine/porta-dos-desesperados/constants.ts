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
  2: 21,
  3: 21,
  4: 25,
  5: 25,
  6: 25,
  7: 28,
  8: 28,
  9: 30,
  10: 30,
};

export const DOOR_OPTIONS_PER_ROUND = 6;

export const DOOR_LEVELS = 7;

export const PAGES_PER_ROUND = 8;

export const OUTCOME = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

export const WIN_CONDITION = {
  LOSE: 'LOSE',
  WIN: 'WIN',
  CONTINUE: 'CONTINUE',
};

export const TRAPS = {
  // No traps ✓
  NONE: 'NONE',
  // Clue Phase: 3 book clues are used (frontend) ✓
  MORE_CLUES: 'MORE_CLUES',
  // Clue Phase: Possessed player can only see 4 cards (backend) ✓
  FEWER_PAGES: 'FEWER_PAGES',
  // Guess Phase: Pages are tinted (frontend) ✓
  SEPIA: 'SEPIA',
  // Guess Phase: Cards can't be enlarged (frontend) ✓
  NO_PREVIEW: 'NO_PREVIEW',
  // Guess Phase: Players can't communicate (frontend) ✓
  NO_COMMUNICATION: 'NO_COMMUNICATION',
  // Guess Phase: Players can't see door #4 but can still choose it (frontend) ✓
  CONCEALED_DOOR: 'CONCEALED_DOOR',
  // Guess Phase: Players have 7 doors to choose from (backend) ✓
  EXTRA_DOOR: 'EXTRA_DOOR',
  // Guess Phase: This turn all magic use is doubled (backend) ✓
  DOUBLE_MAGIC: 'DOUBLE_MAGIC',
  // Guess Phase: Doors are revealed one at a time and players must choose in order (frontend & backend)
  // ORDERED_DOORS: 'ORDERED_DOORS',
  // Guess Phase: Players don't see what others are choosing ✓
  SECRET_CHOICE: 'SECRET_CHOICE',
  // Guess Phase: A random card is added to the clues (backend) ✓
  RANDOM_INTERJECTION: 'RANDOM_INTERJECTION',
  // Guess Phase: The time is cut in half (front-end) ✓
  HALF_TIME: 'HALF_TIME',
};
