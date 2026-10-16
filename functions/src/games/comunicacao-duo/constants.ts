// Types
import type { DeckEntry } from './types';

/**
 * Phase identifiers used by the `comunicacao-duo` engine.
 */
export const COMUNICACAO_DUO_PHASES = {
  SETUP: 'SETUP',
  ASKING_FOR_SOMETHING: 'ASKING_FOR_SOMETHING',
  DELIVER_SOMETHING: 'DELIVER_SOMETHING',
  VERIFICATION: 'VERIFICATION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `comunicacao-duo` engine.
 */
export const COMUNICACAO_DUO_ACTIONS = {
  SUBMIT_REQUEST: 'SUBMIT_REQUEST',
  SUBMIT_DELIVERY: 'SUBMIT_DELIVERY',
  STOP_DELIVERY: 'STOP_DELIVERY',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 2,
} as const;

/**
 * The maximum number of rounds before the game ends.
 */
export const MAX_ROUNDS = 6;

/**
 * The number of item entries used to initialize the game board.
 */
export const TOTAL_ITEMS = 16;

/**
 * Hidden affiliations used by the two delivery sides and special entries.
 */
export const AFFILIATIONS = {
  A: 'A',
  B: 'B',
  TABOO: 'TABOO',
  NONE: 'NONE',
};

/**
 * Identifiers of the teams used by this game.
 */
export const SIDES = [AFFILIATIONS.A, AFFILIATIONS.B];

/**
 * Status identifiers used to track delivery-game progress.
 */
export const STATUS = {
  IDLE: 'IDLE',
  WIN: 'WIN',
  LOSE: 'LOSE',
  CONTINUE: 'CONTINUE',
};

/**
 * Reveal-status identifiers for entries on the delivery board.
 */
export const DECK_ENTRY_STATUS = {
  IDLE: 'IDLE',
  A: AFFILIATIONS.A,
  B: AFFILIATIONS.B,
  NONE: AFFILIATIONS.NONE,
  TABOO: AFFILIATIONS.TABOO,
};

/**
 * The initial delivery-board entries with their hidden side affiliations.
 */
export const DECK: DeckEntry[] = [
  {
    id: 'entry-1',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-2',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-3',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-4',
    affiliation: [AFFILIATIONS.TABOO, AFFILIATIONS.TABOO],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-5',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.TABOO],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-6',
    affiliation: [AFFILIATIONS.TABOO, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-7',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-8',
    affiliation: [AFFILIATIONS.A, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-9',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-10',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.B],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-11',
    affiliation: [AFFILIATIONS.TABOO, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-12',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.TABOO],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-13',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-14',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-15',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
  {
    id: 'entry-16',
    affiliation: [AFFILIATIONS.NONE, AFFILIATIONS.NONE],
    status: DECK_ENTRY_STATUS.IDLE,
    data: null,
  },
];
