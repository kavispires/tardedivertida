export const POLEMICA_DA_VEZ_PHASES = {
  SETUP: 'SETUP',
  TOPIC_SELECTION: 'TOPIC_SELECTION',
  REACT: 'REACT',
  RESOLUTION: 'RESOLUTION',
  GAME_OVER: 'GAME_OVER',
} as const;

export const POLEMICA_DA_VEZ_ACTIONS = {
  SUBMIT_TOPIC: 'SUBMIT_TOPIC',
  SUBMIT_REACTION: 'SUBMIT_REACTION',
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10,
} as const;

export const SCORE_GOAL = 10;

export const MAX_ROUNDS = 15;

export const TOPICS_PER_ROUND = 4;

export const CUSTOM_TOPICS_PER_ROUND = 1;
