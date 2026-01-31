export const SENSO_LITERARIO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  PATTERN_CREATION: 'PATTERN_CREATION',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
} as const;

export const SENSO_LITERARIO_ACTIONS = {
  SUBMIT_PATTERN: 'SUBMIT_PATTERN',
} as const;

export const GENRES = [
  { key: 'childrens', pt: 'Infantil', en: 'Children' },
  { key: 'romance', pt: 'Romance', en: 'Romance' },
  { key: 'technical', pt: 'Técnico', en: 'Technical' },
] as const;

export const COLORS = [
  { key: 'red', pt: 'Vermelho', en: 'Red' },
  { key: 'blue', pt: 'Azul', en: 'Blue' },
  { key: 'yellow', pt: 'Amarelo', en: 'Yellow' },
] as const;

export const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 6,
} as const;
