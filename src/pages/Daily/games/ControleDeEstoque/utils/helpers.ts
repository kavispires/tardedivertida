import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { SEPARATOR } from 'utils/constants';
import { deepCopy } from 'utils/helpers';
// Internal
import { PHASES, SETTINGS } from './settings';
import type { ControleDeEstoqueLocalToday, DailyControleDeEstoqueEntry, GameState } from './types';

export const DEFAULT_LOCAL_TODAY: ControleDeEstoqueLocalToday = {
  id: '',
  number: 0,
  warehouse: [],
  guesses: [],
  extraAttempts: 0,
};

export const getInitialState = (data: DailyControleDeEstoqueEntry, removeHeart?: boolean): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    hearts: SETTINGS.HEARTS,
    phase: PHASES.STOCKING,
    warehouse: Array(data.goods.length).fill(null),
    fulfillments: [],
    lastPlacedGoodId: null,
    latestAttempt: null,
    win: false,
    guesses: [],
    evaluations: [],
    activeOrder: null,
    extraAttempts: 0,
  };

  if (localToday.warehouse.length || localToday.extraAttempts) {
    // Update phase
    const warehouse =
      localToday.warehouse.length > 0 ? localToday.warehouse : Array(data.goods.length).fill(null);
    const guesses = localToday.warehouse.length > 0 ? (localToday.guesses ?? []) : [];

    // Activate the last order attempt
    const fulfillments = guesses.length > 0 ? parseGuessString(guesses[guesses.length - 1]) : [];
    // Determine win
    const attempts = validateAttempts(warehouse, fulfillments);
    const extraAttempts = localToday.extraAttempts ?? 0;
    const win = attempts.length > 0 && attempts.every(Boolean);

    state.phase = warehouse.every(Boolean) ? PHASES.FULFILLING : PHASES.STOCKING;
    state.warehouse = warehouse;
    state.guesses = guesses;
    state.evaluations = guesses.map((g) => validateAttempts(warehouse, parseGuessString(g)));
    state.hearts = SETTINGS.HEARTS - guesses.length - extraAttempts - (removeHeart ? 1 : 0);
    state.extraAttempts = extraAttempts;
    state.fulfillments = fulfillments;
    state.win = win;
  }

  return state;
};

/**
 * Validates the attempts made to fulfill orders in the warehouse.
 * @param warehouse - The current state of the warehouse.
 * @param fulfillments - The list of order fulfillments.
 * @returns An array of boolean values indicating whether each fulfillment attempt was successful or not.
 */
export const validateAttempts = (
  warehouse: GameState['warehouse'],
  fulfillments: GameState['fulfillments'],
) => {
  return fulfillments.reduce((acc: boolean[], fulfillment) => {
    // If it's out of stock
    if (fulfillment.shelfIndex === -1) {
      const evaluation = !warehouse.some((good) => good === fulfillment.order);
      acc.push(evaluation);
      return acc;
    }

    // Any other order, should be placed correctly
    const evaluation = fulfillment.order === warehouse[fulfillment.shelfIndex];
    acc.push(evaluation);
    return acc;
  }, []);
};

/**
 * Returns a string representation of the guesses made in the game.
 * @param fulfillments - The fulfillments array containing the game state.
 * @returns A string representing the guesses made in the game.
 */
export const getGuessString = (fulfillments: GameState['fulfillments']) => {
  return fulfillments.map((f) => `${f.order}${SEPARATOR}${f.shelfIndex}`).join(',');
};

/**
 * Parses a guess string into an array of objects containing order and shelf index.
 * @param guessString - The guess string to be parsed.
 * @returns An array of objects containing order and shelf index.
 */
const parseGuessString = (guessString: string) => {
  return guessString.split(',').map((g) => {
    const [order, shelfIndex] = g.split(SEPARATOR);
    return { order, shelfIndex: Number(shelfIndex) };
  });
};
