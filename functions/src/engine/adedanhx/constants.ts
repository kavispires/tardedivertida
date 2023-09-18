export const ADEDANHX_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  ANSWERING: 'ANSWERING',
  EVALUATION: 'EVALUATION',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
};

export const ADEDANHX_ACTIONS = {
  SUBMIT_ANSWERS: 'SUBMIT_ANSWERS',
  NEXT_EVALUATION_GROUP: 'NEXT_EVALUATION_GROUP',
  SUBMIT_REJECTED_ANSWERS: 'SUBMIT_REJECTED_ANSWERS',
};

export const ADEDANHX_ACHIEVEMENTS = {
  TBD: 'TBD',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const TOTAL_ROUNDS = 5;
export const TOPICS_PER_ROUND = 5;
export const LETTERS_PER_ROUND = 4;

export const LETTERS_ENTRIES_BY_LANGUAGE = {
  en: [
    {
      type: 'starts-with',
      letters: 'A',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'B',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'C',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'D',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'E',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'F',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'G',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'H',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'I',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'J',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'K',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'L',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'M',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'N',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'O',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'P',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'R',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'S',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'T',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'U',
      level: 3,
    },
    {
      type: 'starts-with',
      letters: 'V',
      level: 3,
    },
    {
      type: 'starts-with',
      letters: 'W',
      level: 3,
    },
    {
      type: 'starts-with',
      letters: 'Y',
      level: 3,
    },
    {
      type: 'starts-with',
      letters: 'Z',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'an',
      level: 2,
    },
    {
      type: 'includes',
      letters: 'in',
      level: 2,
    },
    {
      type: 'includes',
      letters: 'qu',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'th',
      level: 2,
    },
    {
      type: 'includes',
      letters: 'x',
      level: 3,
    },
    {
      type: 'ends-with',
      letters: '-e',
      level: 2,
    },
    {
      type: 'ends-with',
      letters: '-s',
      level: 3,
    },
    {
      type: 'ends-with',
      letters: '-y',
      level: 3,
    },
  ],
  pt: [
    {
      type: 'starts-with',
      letters: 'A',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'B',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'C',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'D',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'E',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'F',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'G',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'H',
      level: 3,
    },
    {
      type: 'starts-with',
      letters: 'I',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'J',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'L',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'M',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'N',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'O',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'P',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'R',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'S',
      level: 1,
    },
    {
      type: 'starts-with',
      letters: 'T',
      level: 2,
    },
    {
      type: 'starts-with',
      letters: 'V',
      level: 2,
    },
    {
      type: 'includes',
      letters: 'qu',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'nh',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'lh',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'rr',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'ç',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'gu',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'x',
      level: 3,
    },
    {
      type: 'includes',
      letters: '~',
      level: 3,
    },
    {
      type: 'includes',
      letters: '^',
      level: 3,
    },
    {
      type: 'includes',
      letters: '´',
      level: 3,
    },
    {
      type: 'includes',
      letters: 'ss',
      level: 3,
    },
    {
      type: 'ends-with',
      letters: 's',
      level: 1,
    },
    {
      type: 'ends-with',
      letters: 'r',
      level: 2,
    },
  ],
};
