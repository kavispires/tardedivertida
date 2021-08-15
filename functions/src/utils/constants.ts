export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GAME_CODES = {
  A: 'A', // arte-ruim
  D: 'D', // detetives-imaginativos
  E: 'E', // espiao-entre-nos
  O: 'O', // onda-telepatica
  T: 'T', // testemunha-ocular
  U: 'U', // ue-so-isso
};

export const GAME_KEYS = {
  ARTE_RUIM: 'ARTE_RUIM',
  DETETIVES_IMAGINATIVOS: 'DETETIVES_IMAGINATIVOS',
  ESPIAO_ENTRE_NOS: 'ESPIAO_ENTRE_NOS',
  ONDA_TELEPATICA: 'ONDA_TELEPATICA',
  TESTEMUNHA_OCULAR: 'TESTEMUNHA_OCULAR',
  UE_SO_ISSO: 'UE_SO_ISSO',
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  ONDA_TELEPATICA: 'onda-telepatica',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
};

export const GAME_PLAYERS_LIMIT = {
  ARTE_RUIM: {
    min: 3,
    max: 8,
  },
  DETETIVES_IMAGINATIVOS: {
    min: 4,
    max: 8,
  },
  ESPIAO_ENTRE_NOS: {
    min: 4,
    max: 8,
  },
  ONDA_TELEPATICA: {
    min: 4,
    max: 8,
  },
  TESTEMUNHA_OCULAR: {
    min: 2,
    max: 8,
  },
  UE_SO_ISSO: {
    min: 3,
    max: 8,
  },
};

/**
 * Enum of Game Phases
 */
export const PHASES = {
  ESPIAO_ENTRE_NOS: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    ASSIGNMENT: 'ASSIGNMENT',
    INVESTIGATION: 'INVESTIGATION',
    ASSESSMENT: 'ASSESSMENT',
    FINAL_ASSESSMENT: 'FINAL_ASSESSMENT',
    RESOLUTION: 'RESOLUTION',
    GAME_OVER: 'GAME_OVER',
  },
  ONDA_TELEPATICA: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    DIAL_SIDES: 'DIAL_SIDES',
    DIAL_CLUE: 'DIAL_CLUE',
    GUESS: 'GUESS',
    RIVAL_GUESS: 'RIVAL_GUESS',
    REVEAL: 'REVEAL',
    GAME_OVER: 'GAME_OVER',
  },
  UE_SO_ISSO: {
    LOBBY: 'LOBBY',
    RULES: 'RULES',
    WORD_SELECTION: 'WORD_SELECTION',
    SUGGEST: 'SUGGEST',
    COMPARE: 'COMPARE',
    GUESS: 'GUESS',
    GAME_OVER: 'GAME_OVER',
  },
};

export const SEPARATOR = ';;';

// ESPIAO_ENTRE_NOS

export const ESPIAO_ENTRE_NOS_CONSTANTS = {
  SPY: 'SPY',
  GAME_TIME: 10 * 60 * 1000,
  TIMER_STATUS: {
    RUNNING: 'RUNNING',
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
  },
  OUTCOME: {
    VOTE_SUCCESS: 'VOTE_SUCCESS',
    VOTE_FAIL: 'VOTE_FAIL',
    CONTINUE: 'CONTINUE',
  },
  RESOLUTION: {
    SPY_GUESS: 'SPY_GUESS',
    SPY_FOUND: 'SPY_FOUND',
  },
};

// ONDA_TELEPATICA

export const ONDA_TELEPATICA_GOAL = 10;

// UE_SO_ISSO

export const UE_SO_ISSO_WORDS = new Array(600).fill(1).map((i, index) => `${i + index}`);
