import type { DeckEntry } from './types';

export const COMUNICACAO_DUO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  ASKING_FOR_SOMETHING: 'ASKING_FOR_SOMETHING',
  DELIVER_SOMETHING: 'DELIVER_SOMETHING',
  VERIFICATION: 'VERIFICATION',
  GAME_OVER: 'GAME_OVER',
};

export const COMUNICACAO_DUO_ACTIONS = {
  SUBMIT_REQUEST: 'SUBMIT_REQUEST',
  SUBMIT_DELIVERY: 'SUBMIT_DELIVERY',
  STOP_DELIVERY: 'STOP_DELIVERY',
};

export const COMUNICACAO_DUO_ACHIEVEMENTS = {
  DELIVERED_TABOO: 'DELIVERED_TABOO',
  MOST_REQUESTED_AT_ONCE: 'MOST_REQUESTED_AT_ONCE',
  FEWEST_REQUESTED_AT_ONCE: 'FEWEST_REQUESTED_AT_ONCE',
  MOST_DELIVERED_ITEMS: 'MOST_DELIVERED_ITEMS',
  FEWEST_DELIVERED_ITEMS: 'FEWEST_DELIVERED_ITEMS',
  MOST_DELIVERED_AT_ONCE: 'MOST_DELIVERED_AT_ONCE',
  FEWEST_DELIVERED_AT_ONCE: 'FEWEST_DELIVERED_AT_ONCE',
  MOST_NEUTRAL_DELIVERIES: 'MOST_NEUTRAL_DELIVERIES',
  FEWEST_NEUTRAL_DELIVERIES: 'FEWEST_NEUTRAL_DELIVERIES',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 2,
};

export const MAX_ROUNDS = 6;

export const TOTAL_ITEMS = 16;

export const AFFILIATIONS = {
  A: 'A',
  B: 'B',
  TABOO: 'TABOO',
  NONE: 'NONE',
};

export const SIDES = [AFFILIATIONS.A, AFFILIATIONS.B];

export const STATUS = {
  IDLE: 'IDLE',
  WIN: 'WIN',
  LOSE: 'LOSE',
  CONTINUE: 'CONTINUE',
};

export const DECK_ENTRY_STATUS = {
  IDLE: 'IDLE',
  A: AFFILIATIONS.A,
  B: AFFILIATIONS.B,
  NONE: AFFILIATIONS.NONE,
  TABOO: AFFILIATIONS.TABOO,
};

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
