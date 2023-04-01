export const TOTAL_DOORS = 7;

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
  ORDERED_DOORS: 'ORDERED_DOORS',
  // Guess Phase: Players don't see what others are choosing ✓
  SECRET_CHOICE: 'SECRET_CHOICE',
  // Guess Phase: A random card is added to the clues (backend) ✓
  RANDOM_INTERJECTION: 'RANDOM_INTERJECTION',
  // Guess Phase: The time is cut in half (front-end) ✓
  HALF_TIME: 'HALF_TIME',
};

export const OUTCOME = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  LOSE: 'LOSE',
  WIN: 'WIN',
};

/**
 * In minutes
 */
export const ROUND_DURATION = 3;

/**
 * In seconds
 */
export const TIMER_LEAD = 10;
