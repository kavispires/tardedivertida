import type { Position } from './types';

export const TREVO_DA_SORTE_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  WORD_SELECTION: 'WORD_SELECTION',
  CLOVER_WRITING: 'CLOVER_WRITING',
  CLOVER_GUESSING: 'CLOVER_GUESSING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
};

export const TREVO_DA_SORTE_ACTIONS = {
  SUBMIT_BAD_WORDS: 'SUBMIT_BAD_WORDS',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const CARDS_PER_PLAYER = 30;

export const LEAF_SIZE = 4;

export const LEAF_POSITIONS: Position[] = ['A', 'B', 'C', 'D'];

export const ROTATIONS = [0, 90, 180, 270];
