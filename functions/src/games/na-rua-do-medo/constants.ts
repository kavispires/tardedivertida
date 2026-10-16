/**
 * Phase identifiers used by the `na-rua-do-medo` engine.
 */
export const NA_RUA_DO_MEDO_PHASES = {
  SETUP: 'SETUP',
  TRICK_OR_TREAT: 'TRICK_OR_TREAT',
  RESULT: 'RESULT',
  STREET_END: 'STREET_END',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `na-rua-do-medo` engine.
 */
export const NA_RUA_DO_MEDO_ACTIONS = {
  SUBMIT_DECISION: 'SUBMIT_DECISION',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 5;

/**
 * The number of rounds used by the shorter-game option.
 */
export const SHORT_GAME_ROUNDS = 3;

/**
 * Candy-card values, including repeated values that determine deck frequency.
 */
export const CANDY_VALUES = [1, 2, 3, 4, 5, 5, 5, 7, 7, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15, 17, 19];

/**
 * Jackpot values unlocked as street rounds progress.
 */
export const JACKPOT_VALUES = [5, 8, 10, 12, 15];

/**
 * The prefix used to namespace trick-or-treat card keys.
 */
export const CARD_KEY_PREFIX = 'nrdm';

/**
 * Localized horror alternatives used to select one horror from each set.
 */
export const HORROR_SETS = [
  [
    { en: 'Alien', pt: 'Alienígena' },
    { en: 'Monster', pt: 'Monstro' },
    { en: 'Zombie', pt: 'Zumbi' },
  ],
  [
    { en: 'Werewolf', pt: 'Lobisomem' },
    { en: 'Skeleton', pt: 'Esqueleto' },
    { en: 'Nun', pt: 'Freira' },
  ],
  [
    { en: 'Jack', pt: 'Homem-abóbora' },
    { en: 'Witch', pt: 'Bruxa' },
    { en: 'Scarecrow', pt: 'Espantalho' },
  ],
  [
    { en: 'Vampire', pt: 'Vampiro' },
    { en: 'Mummy', pt: 'Múmia' },
    { en: 'Ghost', pt: 'Fantasma' },
  ],
  [
    { en: 'Clown', pt: 'Palhaço' },
    { en: 'Cyclops', pt: 'Ciclope' },
    { en: 'Devil', pt: 'Diabo' },
  ],
];

/**
 * Identifiers for continuing, starting, or ending a street.
 */
export const OUTCOME_STATUS = {
  CONTINUE: 'CONTINUE',
  NEW_STREET: 'NEW_STREET',
  END_STREET: 'END_STREET',
};

/**
 * Player decision identifiers for continuing, returning home, or remaining home.
 */
export const DECISIONS = {
  CONTINUE: 'CONTINUE',
  GO_HOME: 'GO_HOME',
  HOME: 'HOME',
};
