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

export function getRowAndColumnIndexes(index: number, gridSize: number): number[] {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  const indexes: number[] = [];

  // Row indexes (same row, different column)
  for (let c = 0; c < gridSize; c++) {
    const i = row * gridSize + c;
    if (i !== index) indexes.push(i);
  }

  // Column indexes (same column, different row)
  for (let r = 0; r < gridSize; r++) {
    const i = r * gridSize + col;
    if (i !== index) indexes.push(i);
  }

  return indexes;
}

/**
 * Validates whether a button was pressed correctly based on its expected action
 * @param actualPressCount - The number of times the button was actually pressed
 * @param expectedAction - The expected action type for the button
 * @param configPressCount - The press count from the button config
 * @param previousPressCount - Optional press count from the previous button (for SAME_AS_PREVIOUS)
 * @returns True if the button was pressed correctly, false otherwise
 */
export function validateButtonPress(
  actualPressCount: number,
  expectedAction: string,
  configPressCount: number,
  previousPressCount?: number,
): boolean {
  switch (expectedAction) {
    case 'PRESS':
      return actualPressCount === configPressCount;

    case 'DO_NOT_PRESS':
      return actualPressCount === 0;

    case 'MULTI_PRESS':
      return actualPressCount === configPressCount;

    case 'PRESS_LESS':
      return actualPressCount < configPressCount;

    case 'PRESS_MORE':
      return actualPressCount > configPressCount;

    case 'ANY':
      return true;

    case 'TBD':
      // For TBD actions, check if it's SAME_AS_PREVIOUS logic
      if (configPressCount === -2 && previousPressCount !== undefined) {
        return actualPressCount === previousPressCount;
      }
      // Default to true for other TBD cases
      return true;

    default:
      // Unknown action type, default to false for safety
      return false;
  }
}

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
