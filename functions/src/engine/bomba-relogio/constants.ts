import type { DataCount } from './types';

export const BOMBA_RELOGIO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  DECLARATION: 'DECLARATION',
  EXAMINATION: 'EXAMINATION',
  GAME_OVER: 'GAME_OVER',
};

export const BOMBA_RELOGIO_ACTIONS = {
  SUBMIT_DECLARATION: 'SUBMIT_DECLARATION',
  UPDATE_TARGET_PLAYER: 'UPDATE_TARGET_PLAYER',
  SUBMIT_TARGET: 'SUBMIT_TARGET',
};

export const BOMBA_RELOGIO_ACHIEVEMENTS = {
  TERRORIST: 'TERRORIST',
  MOST_WIRES: 'MOST_WIRES',
  FEWEST_WIRES: 'FEWEST_WIRES',
  MOST_BLANKS: 'MOST_BLANKS',
  FEWEST_BLANKS: 'FEWEST_BLANKS',
  STUPID_BOMBER: 'STUPID_BOMBER',
  BEST_TERRORIST: 'BEST_TERRORIST',
};

export const PLAYER_COUNTS = {
  MIN: 4,
  MAX: 10,
};

export const TOTAL_ROUNDS = 4;

export const DATA_COUNTS: Dictionary<DataCount> = {
  4: {
    agents: 3,
    terrorists: 2,
    bomb: 1,
    wires: 4,
    blank: 15,
  },
  5: {
    agents: 4,
    terrorists: 2,
    bomb: 1,
    wires: 5,
    blank: 19,
  },
  6: {
    agents: 5,
    terrorists: 2,
    bomb: 1,
    wires: 6,
    blank: 23,
  },
  7: {
    agents: 6,
    terrorists: 2,
    bomb: 1,
    wires: 7,
    blank: 27,
  },
  8: {
    agents: 7,
    terrorists: 3,
    bomb: 1,
    wires: 8,
    blank: 31,
  },
  9: {
    agents: 9,
    terrorists: 3,
    bomb: 1,
    wires: 9,
    blank: 35,
  },
  10: {
    agents: 10,
    terrorists: 3,
    bomb: 1,
    wires: 10,
    blank: 39,
  },
};

export const ROLES = {
  AGENT: 'agent',
  TERRORIST: 'terrorist',
} as const;

export const CARD_TYPES = {
  BOMB: 'bomb',
  WIRE: 'wire',
  BLANK: 'blank',
} as const;

export const OUTCOME = {
  START: 'START',
  CONTINUE: 'CONTINUE',
  END: 'END',
  BOMB: 'BOMB',
  TERRORISTS_WIN: 'TERRORISTS_WIN',
  AGENTS_WIN: 'AGENTS_WIN',
} as const;
