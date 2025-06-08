import type { Concept } from './types';

export const IDADE_DA_PREDA_PHASES = {
  SETUP: 'SETUP',
  LOBBY: 'LOBBY',
  CREATING_CONCEPTS: 'CREATING_CONCEPTS',
  CONCEPTS_REVEAL: 'CONCEPTS_REVEAL',
  COMMUNICATING_THINGS: 'COMMUNICATING_THINGS',
  GUESSING: 'GUESSING',
  RESULTS: 'RESULTS',
  GAME_OVER: 'GAME_OVER',
} as const;

export const IDADE_DA_PREDA_ACHIEVEMENTS = {
  // Add achievements here
} as const;

export const IDADE_DA_PREDA_ACTIONS = {
  SUBMIT_CONCEPTS: 'SUBMIT_CONCEPTS',
  DOWNVOTE_CONCEPTS: 'DOWNVOTE_CONCEPTS',
  SUBMIT_NAME: 'SUBMIT_NAME',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const TOTAL_ROUNDS = 5;

export const AGE_1_ITEMS_COUNT = 30;
export const NEW_AGES_COUNT = 12;
export const ITEMS_PER_PLAYER_PER_AGE = 3;

export const CONCEPTS_FOR_FIRST_ROUND = 13;
export const CONCEPTS_FOR_NEW_AGES = 6;

export const BASIC_CONCEPTS: Concept[] = [
  {
    id: 'c-0-yes',
    key: 'yes',
    type: 'basic',
    soundId: 'ug',
    syllable: {
      en: 'ug',
      pt: 'ug',
    },
    meaning: 'yes',
    itemsIds: [],
    playerId: 'bot-a',
    age: 0,
  },
  {
    id: 'c-0-no',
    key: 'no',
    type: 'basic',
    soundId: 'na',
    syllable: {
      en: 'na',
      pt: 'na',
    },
    meaning: 'no',
    itemsIds: [],
    playerId: 'bot-a',
    age: 0,
  },
  {
    id: 'c-0-maybe',
    key: 'maybe',
    type: 'basic',
    soundId: 'eh-',
    syllable: {
      en: 'eh',
      pt: 'eh',
    },
    meaning: 'maybe',
    itemsIds: [],
    playerId: 'bot-a',
    age: 0,
  },
  {
    id: 'c-0-very',
    key: 'very',
    type: 'basic',
    soundId: 'gaga',
    syllable: {
      en: 'gaga',
      pt: 'gaga',
    },
    meaning: 'very',
    itemsIds: [],
    playerId: 'bot-a',
    age: 0,
  },
  {
    id: 'c-0-question',
    type: 'basic',
    key: 'question',
    soundId: 'weh',
    syllable: {
      en: 'weh',
      pt: 'uai',
    },
    meaning: 'question',
    itemsIds: [],
    playerId: 'bot-a',
    age: 0,
  },
];

export const SOUNDS: Dictionary<DualLanguageValue> = {
  1: {
    en: 'ah',
    pt: 'ah',
  },
  2: {
    en: 'aye',
    pt: 'ai',
  },
  3: {
    en: 'ber',
    pt: 'ber',
  },
  4: {
    en: 'bing',
    pt: 'bin',
  },
  5: {
    en: 'bip',
    pt: 'bip',
  },
  6: {
    en: 'bong',
    pt: 'bon',
  },
  7: {
    en: 'chi',
    pt: 'ti',
  },
  8: {
    en: 'coo',
    pt: 'cu',
  },
  9: {
    en: 'da',
    pt: 'da',
  },
  10: {
    en: 'dif',
    pt: 'dif',
  },
  11: {
    en: 'duh',
    pt: 'duh',
  },
  12: {
    en: 'flo',
    pt: 'floh',
  },
  13: {
    en: 'foo',
    pt: 'fu',
  },
  14: {
    en: 'van',
    pt: 'van',
  },
  15: {
    en: 'jah',
    pt: 'ja',
  },
  16: {
    en: 'jay',
    pt: 'djey',
  },
  17: {
    en: 'qweh',
    pt: 'que',
  },
  18: {
    en: 'kwa',
    pt: 'kwa',
  },
  19: {
    en: 'lee',
    pt: 'li',
  },
  20: {
    en: 'loo',
    pt: 'lhu',
  },
  21: {
    en: 'ma',
    pt: 'ma',
  },
  22: {
    en: 'meep',
    pt: 'mip',
  },
  23: {
    en: 'moo',
    pt: 'mu',
  },
  24: {
    en: 'off',
    pt: 'uf',
  },
  25: {
    en: 'peh',
    pt: 'pe',
  },
  26: {
    en: 'poe',
    pt: 'pou',
  },
  27: {
    en: 'pu',
    pt: 'pu',
  },
  28: {
    en: 'ra',
    pt: 'ra',
  },
  29: {
    en: 'rue',
    pt: 'riu',
  },
  30: {
    en: 'sha',
    pt: 'xa',
  },
  31: {
    en: 'tee',
    pt: 'ti',
  },
  32: {
    en: 'to',
    pt: 'to',
  },
  33: {
    en: 'tur',
    pt: 'tur',
  },
  34: {
    en: 'tep',
    pt: 'tep',
  },
  35: {
    en: 'vo',
    pt: 'vó',
  },
  36: {
    en: 'wah',
    pt: 'ua',
  },
  37: {
    en: 'yee',
    pt: 'ih',
  },
  38: {
    en: 'zop',
    pt: 'zop',
  },
  39: {
    en: 'cla',
    pt: 'cla',
  },
  40: {
    en: 'zu',
    pt: 'zu',
  },
};
