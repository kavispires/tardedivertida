// Types
import type { DataCounts } from './types';

/**
 * Phase identifiers used by the `bomba-relogio` engine.
 */
export const BOMBA_RELOGIO_PHASES = {
  SETUP: 'SETUP',
  DECLARATION: 'DECLARATION',
  EXAMINATION: 'EXAMINATION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `bomba-relogio` engine.
 */
export const BOMBA_RELOGIO_ACTIONS = {
  SUBMIT_DECLARATION: 'SUBMIT_DECLARATION',
  UPDATE_TARGET_PLAYER: 'UPDATE_TARGET_PLAYER',
  SUBMIT_TARGET: 'SUBMIT_TARGET',
} as const;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 4,
  MAX: 10,
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 4;

/**
 * Role and card counts indexed by the number of players.
 */
export const DATA_COUNTS: Dictionary<DataCounts> = {
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

/**
 * Role identifiers used to assign and resolve player roles.
 */
export const ROLES = {
  AGENT: 'agent',
  TERRORIST: 'terrorist',
} as const;

/**
 * Identifiers distinguishing bomb, wire, and blank cards.
 */
export const CARD_TYPES = {
  BOMB: 'bomb',
  WIRE: 'wire',
  BLANK: 'blank',
} as const;

/**
 * Outcome identifiers used to resolve game steps and phase progression.
 */
export const OUTCOME = {
  START: 'START',
  RESTART: 'RESTART',
  CONTINUE: 'CONTINUE',
  END: 'END',
  BOMB: 'BOMB',
  TERRORISTS_WIN: 'TERRORISTS_WIN',
  AGENTS_WIN: 'AGENTS_WIN',
} as const;
