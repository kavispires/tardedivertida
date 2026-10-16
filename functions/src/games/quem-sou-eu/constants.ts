/**
 * Phase identifiers used by the `quem-sou-eu` engine.
 */
export const QUEM_SOU_EU_PHASES = {
  SETUP: 'SETUP',
  CHARACTER_FILTERING: 'CHARACTER_FILTERING',
  CHARACTER_DESCRIPTION: 'CHARACTER_DESCRIPTION',
  GUESSING: 'GUESSING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `quem-sou-eu` engine.
 */
export const QUEM_SOU_EU_ACTIONS = {
  SUBMIT_CHARACTERS: 'SUBMIT_CHARACTERS',
  SUBMIT_GLYPHS: 'SUBMIT_GLYPHS',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 5;
/**
 * The number of character resources allocated per player.
 */
export const CHARACTERS_PER_PLAYER = 12;
/**
 * The number of glyph resources allocated per player.
 */
export const GLYPHS_PER_PLAYER = 40;
/**
 * The number of glyph sprites available in the resource library.
 */
export const TOTAL_GLYPHS = 365;
/**
 * The minimum number of characters placed on the table.
 */
export const MINIMUM_CHARACTERS = 6;
/**
 * Additional characters included when the expanded-character option is enabled.
 */
export const EXTRA_CHARACTERS = 2;

/**
 * Glyph counts used for successive rounds.
 */
export const GLYPHS_PER_ROUND = [40, 30, 20, 40, 20];
/**
 * Whether character identities are visible in each round.
 */
export const CHARACTERS_VISIBILITY_PER_ROUND = [true, true, true, false, false];
