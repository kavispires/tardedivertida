export const AVATAR_IDS = new Array(25).fill(0).map((i, index) => `${i + index}`);

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GAME_CODES = {
  A: 'A', // arte-ruim
  C: 'C', // contadores-historias
  D: 'D', // detetives-imaginativos
  E: 'E', // espiao-entre-nos
  I: 'I', // instrumentos-codificados
  M: 'M', // mente-coletiva
  O: 'O', // onda-telepatica
  P: 'P', // polemica-da-vez
  R: 'R', // retrato-falado
  S: 'S', // sonhos-pesadelos
  T: 'T', // testemunha-ocular
  U: 'U', // ue-so-isso
  X: 'X', // cruza-palavras
};

export const GAME_KEYS = {
  ARTE_RUIM: 'ARTE_RUIM',
  CONTADORES_HISTORIAS: 'CONTADORES_HISTORIAS',
  DETETIVES_IMAGINATIVOS: 'DETETIVES_IMAGINATIVOS',
  ESPIAO_ENTRE_NOS: 'ESPIAO_ENTRE_NOS',
  INSTRUMENTOS_CODIFICADOS: 'INSTRUMENTOS_CODIFICADOS',
  MENTE_COLETIVA: 'MENTE_COLETIVA',
  ONDA_TELEPATICA: 'ONDA_TELEPATICA',
  POLEMICA_DA_VEZ: 'POLEMICA_DA_VEZ',
  RETRATO_FALADO: 'RETRATO_FALADO',
  SONHOS_PESADELOS: 'SONHOS_PESADELOS',
  TESTEMUNHA_OCULAR: 'TESTEMUNHA_OCULAR',
  UE_SO_ISSO: 'UE_SO_ISSO',
  CRUZA_PALAVRAS: 'CRUZA_PALAVRAS',
};

export const GAME_COLLECTIONS = {
  ARTE_RUIM: 'arte-ruim',
  CONTADORES_HISTORIAS: 'contadores-historias',
  DETETIVES_IMAGINATIVOS: 'detetives-imaginativos',
  ESPIAO_ENTRE_NOS: 'espiao-entre-nos',
  INSTRUMENTOS_CODIFICADOS: 'instrumentos-codificados',
  MENTE_COLETIVA: 'mente-coletiva',
  ONDA_TELEPATICA: 'onda-telepatica',
  POLEMICA_DA_VEZ: 'polemica-da-vez',
  RETRATO_FALADO: 'retrato-falado',
  SONHOS_PESADELOS: 'sonhos-pesadelos',
  TESTEMUNHA_OCULAR: 'testemunha-ocular',
  UE_SO_ISSO: 'ue-so-isso',
  CRUZA_PALAVRAS: 'cruza-palavras',
};

export const SEPARATOR = ';;';

export const GLOBAL_USED_DOCUMENTS = {
  ARTE_RUIM: 'usedArteRuimCards',
  MENTE_COLETIVA: 'usedMenteColetivaQuestions',
  ONDA_TELEPATICA: 'usedOndaTelepaticaCategories',
  RETRATO_FALADO: 'usedRetratoFaladoCards',
  TESTEMUNHA_OCULAR: 'usedTestemunhaOcularCards',
};

export const GAME_PLAYERS_LIMIT = {
  ESPIAO_ENTRE_NOS: {
    min: 4,
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
