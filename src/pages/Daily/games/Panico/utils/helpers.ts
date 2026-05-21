import { cloneDeep, merge } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyPanicoEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  totalButtons: 0,
  farthestButtonIndex: 0,
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyPanicoEntry object containing the necessary data for the game.
 * @returns The initial GameState object.
 */
export const getInitialState = (data: DailyPanicoEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY)),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    totalButtons: data.buttons.length,
    farthestButtonIndex: localToday.farthestButtonIndex || 0,
  };

  return state;
};

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  percentage,
  ...rest
}: BasicResultsOptions & {
  percentage: number;
}): string {
  return generateShareableResult({
    heartsSuffix: ` (${percentage}%)`,
    additionalLines: [],
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyPanicoEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyPanicoEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: SETTINGS.ROUTE,
    language,
    hideLink: true,
    challengeNumber: state.number,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    percentage: Math.round((state.farthestButtonIndex / (state.totalButtons - 1)) * 100),
  });
}
