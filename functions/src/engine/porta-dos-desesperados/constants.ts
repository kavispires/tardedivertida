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

export const PORTA_DOS_DESESPERADOS_ACHIEVEMENTS = {
  MOST_POSSESSED: 'MOST_POSSESSED',
  LEAST_POSSESSED: 'LEAST_POSSESSED',
  BEST_GUIDE: 'BEST_GUIDE',
  BEGINNER_GUIDE: 'BEGINNER_GUIDE',
  SLOW_READER: 'SLOW_READER',
  FAST_LEARNER: 'FAST_LEARNER',
  MOST_PAGES: 'MOST_PAGES',
  FEWEST_PAGES: 'FEWEST_PAGES',
  MOST_CORRECT_DOORS: 'MOST_CORRECT_DOORS',
  MOST_WRONG_DOORS: 'MOST_WRONG_DOORS',
  MOST_SOLO_CORRECT_DOORS: 'MOST_SOLO_CORRECT_DOORS',
  MOST_SOLO_WRONG_DOORS: 'MOST_SOLO_WRONG_DOORS',
  SLOW_DECISIONS: 'SLOW_DECISIONS',
  QUICK_DECISIONS: 'QUICK_DECISIONS',
  MAGIC_WASTER: 'MAGIC_WASTER',
  MAGIC_SAVER: 'MAGIC_SAVER',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const MAX_ROUNDS = 15;

export const MAGIC_UNITS_PER_PLAYER_COUNT = {
  2: 15,
  3: 22,
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

export const TOTAL_IMAGE_CARDS = 252;

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
  // NONE: 'NONE',
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
  ORDERED_DOORS: 'ORDERED_DOORS',
  // Guess Phase: Players don't see what others are choosing ✓
  SECRET_CHOICE: 'SECRET_CHOICE',
  // Guess Phase: A random card is added to the clues (backend) ✓
  RANDOM_INTERJECTION: 'RANDOM_INTERJECTION',
  // Guess Phase: The time is cut in half (front-end) ✓
  HALF_TIME: 'HALF_TIME',
  // Guess Phase: Doors keep moving around (frontend)
  DANCING_DOORS: 'DANCING_DOORS',
  // Guess Phase: Doors randomly fade in and fade out, on expand, they are 50% opacity (frontend)
  FADED_DOORS: 'FADED_DOORS',
  // Guess Phase: Each player cannot see one random door (frontend)
  BLIND_DOOR: 'BLIND_DOOR',
  // Guess Phase: Every 30 seconds a door is removed from A to F (frontend)
  VANISHING_DOORS: 'VANISHING_DOORS',
  // Guess Phase: Every 30 seconds a door is revealed (frontend)
  DELAYING_DOORS: 'DELAYING_DOORS',
  // Guess Phase: Players can't chance their choice after selecting a door (frontend)
  LOCKED_CHOICE: 'LOCKED_CHOICE',
};

export const NEW_TRAPS = {
  // Guess Phase: Doors keep moving around (frontend)
  DANCING_DOORS: 'DANCING_DOORS',
  // Guess Phase: Doors randomly fade in and fade out, on expand, they are 50% opacity (frontend)
  FADED_DOORS: 'FADED_DOORS',
  // Guess Phase: Each player cannot see one random door (frontend)
  BLIND_DOOR: 'BLIND_DOOR',
  // Guess Phase: Every 30 seconds a door is removed from A to F (frontend)
  VANISHING_DOORS: 'VANISHING_DOORS',
  // Guess Phase: Every 30 seconds a door is revealed (frontend)
  DELAYING_DOORS: 'DELAYING_DOORS',
  // Guess Phase: Players can't chance their choice after selecting a door (frontend)
  LOCKED_CHOICE: 'LOCKED_CHOICE',
};
