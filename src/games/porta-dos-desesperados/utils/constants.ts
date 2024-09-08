export const PORTA_DOS_DESESPERADOS_ACTIONS = {
  SUBMIT_PAGES: 'SUBMIT_PAGES',
  SUBMIT_DOOR: 'SUBMIT_DOOR',
} as const;

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
  // Guess Phase: Players don't see what others are choosing ✓
  SECRET_CHOICE: 'SECRET_CHOICE',
  // Guess Phase: A random card is added to the clues (backend) ✓
  RANDOM_INTERJECTION: 'RANDOM_INTERJECTION',
  // Guess Phase: The time is cut in half (frontend) ✓
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
