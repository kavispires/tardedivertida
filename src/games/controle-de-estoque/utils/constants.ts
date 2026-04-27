export const CONTROLE_DE_ESTOQUE_PHASES = {
  THE_WAREHOUSE: 'THE_WAREHOUSE',
  GOOD_PLACEMENT: 'GOOD_PLACEMENT',
  PLACEMENT_CONFIRMATION: 'PLACEMENT_CONFIRMATION',
  FULFILLMENT: 'FULFILLMENT',
  RESULTS: 'RESULTS',
} as const;

export const CONTROLE_DE_ESTOQUE_ACTIONS = {
  PLACE_GOOD: 'PLACE_GOOD',
  CONFIRM_PLACEMENT: 'CONFIRM_PLACEMENT',
  FULFILL_ORDER: 'FULFILL_ORDER',
  COMPLETE_FULFILLMENT: 'COMPLETE_FULFILLMENT',
} as const;

export const DAYS_OF_THE_WEEK = [
  {
    en: 'Monday',
    pt: 'Segunda-feira',
  },
  {
    en: 'Tuesday',
    pt: 'Terça-feira',
  },
  {
    en: 'Wednesday',
    pt: 'Quarta-feira',
  },
  {
    en: 'Thursday',
    pt: 'Quinta-feira',
  },
  {
    en: 'Friday',
    pt: 'Sexta-feira',
  },
  {
    en: 'Saturday',
    pt: 'Sábado',
  },
  {
    en: 'Sunday',
    pt: 'Domingo',
  },
];

export const BOSS_IDEAS_IDS = {
  // Affects the goods everywhere
  TINTED_GLASS: 'TINTED_GLASS',
  // Affects the goods for the workers
  CONFIDENTIAL: 'CONFIDENTIAL',
  // Affects the goods for the supervisor
  EYE_EXAM: 'EYE_EXAM',
};

export const OUTCOME = {
  NEW_IDEA: 'NEW_IDEA',
  CONTINUE: 'CONTINUE',
  END_PHASE: 'END_PHASE',
} as const;

export const EVENT_TYPE = {
  CONCEAL: 'CONCEAL',
  PLACE_THEN_CONCEAL: 'PLACE_THEN_CONCEAL',
  REVEAL: 'REVEAL',
} as const;
