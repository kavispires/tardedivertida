export const CONTROLE_DE_ESTOQUE_PHASES = {
  GOOD_PLACEMENT: 'GOOD_PLACEMENT',
  PLACEMENT_CONFIRMATION: 'PLACEMENT_CONFIRMATION',
  FULFILLMENT: 'FULFILLMENT',
  RESULTS: 'RESULTS',
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
