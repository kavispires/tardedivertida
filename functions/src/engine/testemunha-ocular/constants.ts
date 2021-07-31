export const TESTEMUNHA_OCULAR_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  WITNESS_SELECTION: 'WITNESS_SELECTION',
  QUESTION_SELECTION: 'QUESTION_SELECTION',
  QUESTIONING: 'QUESTIONING',
  TRIAL: 'TRIAL',
  GAME_OVER: 'GAME_OVER',
};

export const MAX_NUMBER_OF_ROUNDS = 11;

export const SUSPECT_COUNT = 12;

export const QUESTION_COUNT = 22;

export const SUSPECTS_IDS = Array(70)
  .fill(1)
  .map((e, i) => {
    const id = e + i;
    const stringId = id < 10 ? `0${id}` : `${id}`;
    return `us-${stringId}`;
  });
