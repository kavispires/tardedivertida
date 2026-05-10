import { cloneDeep, merge } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyMapeamentoEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  guesses: [],
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyMapeamentoEntry object containing the necessary data.
 * @returns The initial GameState object.
 */
export function getInitialState(data: DailyMapeamentoEntry): GameState {
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
    guesses: localToday.guesses,
  };

  return state;
}

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  guesses,
  ...rest
}: BasicResultsOptions & {
  guesses: string[];
}): string {
  return generateShareableResult({
    additionalLines: [],
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyMapeamentoEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyMapeamentoEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: SETTINGS.ROUTE,
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    guesses: state.guesses,
  });
}
