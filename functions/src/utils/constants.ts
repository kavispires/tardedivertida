export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GAME_CODES = {
  A: 'A', // arte-ruim
  C: 'C', // contadores-historias
  D: 'D', // detetives-imaginativos
  E: 'E', // espiao-entre-nos
  M: 'M', // mente-coletiva
  O: 'O', // onda-telepatica
  P: 'P', // polemica-da-vez
  S: 'S', // sonhos-pesadelos
  T: 'T', // testemunha-ocular
  U: 'U', // ue-so-isso
};

export const GAME_KEYS = {
  ARTE_RUIM: 'ARTE_RUIM',
  CONTADORES_HISTORIAS: 'CONTADORES_HISTORIAS',
  DETETIVES_IMAGINATIVOS: 'DETETIVES_IMAGINATIVOS',
  ESPIAO_ENTRE_NOS: 'ESPIAO_ENTRE_NOS',
  MENTE_COLETIVA: 'MENTE_COLETIVA',
  ONDA_TELEPATICA: 'ONDA_TELEPATICA',
  POLEMICA_DA_VEZ: 'POLEMICA_DA_VEZ',
  SONHOS_PESADELOS: 'SONHOS_PESADELOS',
  TESTEMUNHA_OCULAR: 'TESTEMUNHA_OCULAR',
  UE_SO_ISSO: 'UE_SO_ISSO',
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
  CONTADORES_HISTORIAS: 'contadores-historias',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  MENTE_COLETIVA: 'mente-coletiva',
  ONDA_TELEPATICA: 'onda-telepatica',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
};

export const GAME_PLAYERS_LIMIT = {
  ARTE_RUIM: {
    min: 3,
    max: 8,
  },
  CONTADORES_HISTORIAS: {
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
  MENTE_COLETIVA: {
    min: 3,
    max: 8,
  },
  ONDA_TELEPATICA: {
    min: 4,
    max: 8,
  },
  POLEMICA_DA_VEZ: {
    min: 3,
    max: 8,
  },
  SONHOS_PESADELOS: {
    min: 2,
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
