import { cloneDeep } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyVitraisEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  timeElapsed: 0,
  lockedPieces: [],
  score: 0,
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyVitraisEntry object containing the necessary data for the game.
 * @returns The initial GameState object.
 */
export const getInitialState = (data: DailyVitraisEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: {
      ...cloneDeep(DEFAULT_LOCAL_TODAY),
      lockedPieces: [data.startingPieceId],
    },
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    timeElapsed: localToday.timeElapsed,
    lockedPieces: localToday.lockedPieces,
    score: localToday.score,
  };

  return state;
};

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({
  timeElapsed,
  score,
  ...rest
}: BasicResultsOptions & {
  timeElapsed: number;
  score: number;
}): string {
  // const correctItems = itemsIds.map((itemId) =>
  //   foundCount[itemId] === Object.keys(foundCount).length ? itemId : null,
  // );

  // const additionalLines = [correctItems.map((item) => (item ? '🟢' : '◼️')).join('')];

  return generateShareableResult({
    heartsSuffix: ` (${score} pts em ${Math.floor(timeElapsed / 60)}:${timeElapsed % 60} s)`,
    additionalLines: [''],
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyVitraisEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyVitraisEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: 'vitrais',
    language,
    hideLink: true,
    challengeNumber: state.number,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
    timeElapsed: state.timeElapsed,
    score: state.score,
  });
}

export function getCoordinateFromPosition(position: number, gridCols: number) {
  const y = Math.floor(position / gridCols);
  const x = position % gridCols;
  return { x, y };
}
