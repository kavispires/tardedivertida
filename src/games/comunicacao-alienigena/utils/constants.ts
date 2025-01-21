export const COMUNICACAO_ALIENIGENA_ACTIONS = {
  SUBMIT_ALIEN: 'SUBMIT_ALIEN',
  SUBMIT_SEEDS: 'SUBMIT_SEEDS',
  SUBMIT_HUMAN_INQUIRY: 'SUBMIT_HUMAN_INQUIRY',
  SUBMIT_ALIEN_RESPONSE: 'SUBMIT_ALIEN_RESPONSE',
  SUBMIT_ALIEN_REQUEST: 'SUBMIT_ALIEN_REQUEST',
  SUBMIT_OFFERINGS: 'SUBMIT_OFFERINGS',
} as const;

export const ALIEN_CANVAS = {
  WIDTH: 500,
  HEIGHT: 120,
};

export const ITEM_TYPES = {
  ITEM: 'ITEM',
  CURSE: 'CURSE',
  BLANK: 'BLANK',
} as const;

export const BADGE_INSTRUCTION = {
  pt: 'Quantas vezes esse item foi parte de uma pergunta',
  en: 'How many times this item was part of a question',
};
