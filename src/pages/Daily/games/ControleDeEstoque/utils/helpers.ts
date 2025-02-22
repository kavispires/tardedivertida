import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Utils
import { SEPARATOR } from 'utils/constants';
// Internal
import { PHASES, SETTINGS } from './settings';
import type { DailyControleDeEstoqueEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  phase: PHASES.STOCKING,
  warehouse: [],
  fulfillments: [],
  lastPlacedGoodId: null,
  guesses: [],
  evaluations: [],
  extraAttempts: 0,
};

export const getInitialState = (
  data: DailyControleDeEstoqueEntry,
  override?: Partial<GameState>,
): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      warehouse: Array(data.goods.length).fill(null),
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    phase: localToday.phase,
    warehouse: localToday.warehouse,
    fulfillments: localToday.fulfillments,
    lastPlacedGoodId: localToday.lastPlacedGoodId,
    guesses: localToday.guesses,
    evaluations: localToday.evaluations,
    extraAttempts: localToday.extraAttempts,
    ...override,
  };

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
