export const CONTROLE_DE_ESTOQUE_PHASES = {
  THE_WAREHOUSE: 'THE_WAREHOUSE',
  GOOD_PLACEMENT: 'GOOD_PLACEMENT',
  PLACEMENT_CONFIRMATION: 'PLACEMENT_CONFIRMATION', // Does not exist as a separate phase, it happens in GOOD_PLACEMENT
  FULFILLMENT: 'FULFILLMENT',
  RESULTS: 'RESULTS',
} as const;

export const CONTROLE_DE_ESTOQUE_ACTIONS = {
  PLACE_GOOD: 'PLACE_GOOD',
  CONFIRM_PLACEMENT: 'CONFIRM_PLACEMENT',
  SUBMIT_FULFILL_ORDERS: 'SUBMIT_FULFILL_ORDERS',
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
  // Tutorial: No limitations, everyone gets acquainted with the game
  FIRST_DAY: 'FIRST_DAY',
  // Placement limitation: all goods placed on the outer edges of the warehouse
  WALLS: 'WALLS',
  // Placement limitation: all goods in a single row or column
  AISLE: 'AISLE',
  // Communication limitation: workers can only say the letter position
  FOCUS: 'FOCUS',
  // Time limitation: 15 seconds to discuss and place, placement is permanent
  TIMER_EFFICIENCY: 'TIMER_EFFICIENCY',
  // Visualization limitation: goods are blurred for everyone
  TINTED_GLASS: 'TINTED_GLASS',
  // Visualization limitation: black and white with low contrast for everyone
  POWER_OUTAGE: 'POWER_OUTAGE',
  // Visualization limitation: only part of each good is visible to everyone
  DAMAGED_GOOD: 'DAMAGED_GOOD',
  // Supervisor limitation: supervisor cannot see goods (ever), workers guide verbally
  EYE_EXAM: 'EYE_EXAM',
  // Supervisor limitation: supervisor cannot see goods (during placement), workers can only say position (not item).
  CRANE: 'CRANE',
  // Workers limitation: only supervisor sees goods (during placement), supervisor talks freely before placement
  CONFIDENTIAL: 'CONFIDENTIAL',
  // Workers limitation: only supervisor sees goods (ever), supervisor cannot talk until after placement
  BLIND_BOX: 'BLIND_BOX',
  // Warehouse transformation: all goods rotated 90 degrees clockwise
  FENG_SHUI: 'FENG_SHUI',
  // Warehouse transformation: all goods mirrored horizontally
  MIRROR: 'MIRROR',
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

export const FULFILLMENT_TIMER = 120 as const; // 2 minutes in seconds
