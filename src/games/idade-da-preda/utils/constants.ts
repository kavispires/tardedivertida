export const IDADE_DA_PREDA_PHASES = {
  CREATING_CONCEPTS: 'CREATING_CONCEPTS',
  CONCEPTS_REVEAL: 'CONCEPTS_REVEAL',
  COMMUNICATING_THINGS: 'COMMUNICATING_THINGS',
  GUESSING: 'GUESSING',
  RESULTS: 'RESULTS',
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

export const SLIDE_DURATION = 7;

export const BASIC_CONCEPTS_TRANSLATIONS: Dictionary<DualLanguageValue> = {
  yes: {
    en: 'yes',
    pt: 'sim',
  },
  no: {
    en: 'no/not',
    pt: 'não',
  },
  maybe: {
    en: 'maybe/sort of',
    pt: 'talvez/meio',
  },
  very: {
    en: 'very',
    pt: 'muito',
  },
  question: {
    en: 'question',
    pt: 'dúvida/pergunta',
  },
};
