import { invert } from 'lodash';

export const CRIMES_HEDIONDOS_ACTIONS = {
  SUBMIT_CRIME: 'SUBMIT_CRIME',
  SUBMIT_MARK: 'SUBMIT_MARK',
  SUBMIT_GUESSES: 'SUBMIT_GUESSES',
} as const;

export const GUESS_STATUS = {
  /**
   * The guess is locked and cannot be changed
   */
  LOCKED: 'LOCKED',
  /**
   * The guess is correct for all items
   */
  CORRECT: 'CORRECT',
  /**
   * One item is correct in this guess
   */
  ONE: 'ONE',
  /**
   * Two items are correct in this guess
   */
  TWO: 'TWO',
  /**
   * Three items are correct in this guess
   */
  THREE: 'THREE',
  /**
   * All items are incorrect in this guess, but the groupIndex is correct
   */
  WRONG: 'WRONG',
  /**
   * All items are incorrect and the groupIndex is incorrect in this guess
   */
  WRONG_GROUP: 'WRONG_GROUP',
};

export const CARD_CODES_BY_TYPE = {
  evidence: 'ev',
  weapon: 'wp',
  location: 'lc',
  victim: 'vt',
};

export const CARD_TYPE_BY_CODE = invert(CARD_CODES_BY_TYPE) as Record<
  string,
  keyof typeof CARD_CODES_BY_TYPE
>;
