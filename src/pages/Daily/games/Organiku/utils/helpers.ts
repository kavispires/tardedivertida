import { cloneDeep, merge } from 'lodash';
import { loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
// Internal
import { SETTINGS } from './settings';
import type { DailyOrganikuEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  revealed: {},
  foundCount: {},
  flips: 0,
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyOrganikuEntry object containing the necessary data for the game.
 * @returns The initial GameState object.
 */
export const getInitialState = (data: DailyOrganikuEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: merge(cloneDeep(DEFAULT_LOCAL_TODAY), {
      revealed: data.defaultRevealedIndexes.reduce((acc, index) => {
        acc[index] = true;
        return acc;
      }, {} as BooleanDictionary),
      foundCount: data.itemsIds.reduce((acc, itemId) => {
        acc[itemId] = data.defaultRevealedIndexes.filter((index) => data.grid[index] === itemId).length;
        return acc;
      }, {} as NumberDictionary),
    }),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    revealed: localToday.revealed,
    foundCount: localToday.foundCount,
    flips: localToday.flips,
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
