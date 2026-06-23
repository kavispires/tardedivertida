import { cloneDeep, merge } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from '@pages/Daily/utils';
import { STATUSES } from '@pages/Daily/utils/constants';
import type { BasicResultsOptions } from '@pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { DailyPirralhosEntry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  guesses: [],
  assessments: {},
};

/**
 * Retrieves the initial state for the game based on the provided data.
 * @param data - The DailyPirralhosEntry object containing the necessary data.
 * @returns The initial GameState object.
 */
export function getInitialState(data: DailyPirralhosEntry): GameState {
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
    assessments: localToday.assessments,
  };

  return state;
}

/**
 * Generates a shareable result string for the game.
 */
export function writeResult({ ...rest }: BasicResultsOptions): string {
  return generateShareableResult({
    additionalLines: [],
    ...rest,
  });
}

/**
 * Generates the written result for the game with the state
 * @param data - The DailyPirralhosEntry data.
 * @param language - The language for the result.
 */
export function getWrittenResult({ data, language }: { data: DailyPirralhosEntry; language: Language }) {
  const state = getInitialState(data);
  return writeResult({
    type: SETTINGS.ROUTE,
    hideLink: true,
    challengeNumber: state.number,
    language,
    totalHearts: SETTINGS.HEARTS,
    remainingHearts: state.hearts,
  });
}

type EllipsePosition = {
  x: number;
  y: number;
  angle: number;
};

/**
 * Hardcoded positions for kids arranged in an elliptical pattern optimized for mobile portrait
 * Positions are in percentages for responsive layout
 */
const HARDCODED_POSITIONS: Record<number, EllipsePosition[]> = {
  3: [
    { x: 50, y: 10, angle: 45 }, // Top center
    { x: 85, y: 60, angle: 0 }, // Bottom right
    { x: 15, y: 60, angle: -45 }, // Bottom left
  ],
  4: [
    { x: 50, y: 10, angle: 45 }, // Top center
    { x: 85, y: 40, angle: -45 }, // Right
    { x: 50, y: 75, angle: 45 }, // Bottom center
    { x: 15, y: 40, angle: -45 }, // Left
  ],
  5: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 35, angle: -45 }, // Top right
    { x: 75, y: 75, angle: 0 }, // Bottom right
    { x: 25, y: 75, angle: 45 }, // Bottom left
    { x: 15, y: 35, angle: -45 }, // Top left
  ],
  6: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 25, angle: 90 }, // Top right
    { x: 85, y: 60, angle: -45 }, // Bottom right
    { x: 50, y: 85, angle: 45 }, // Bottom center
    { x: 15, y: 60, angle: 90 }, // Bottom left
    { x: 15, y: 25, angle: -45 }, // Top left
  ],
  7: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 25, angle: 90 }, // Upper right
    { x: 85, y: 55, angle: 115 }, // Middle right
    { x: 75, y: 85, angle: 0 }, // Lower right
    { x: 25, y: 85, angle: 65 }, // Lower left
    { x: 15, y: 55, angle: 90 }, // Middle left
    { x: 15, y: 25, angle: -45 }, // Upper left
  ],
  8: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 20, angle: 90 }, // Upper right
    { x: 85, y: 45, angle: 90 }, // Middle right
    { x: 85, y: 70, angle: -45 }, // Lower right
    { x: 50, y: 85, angle: 45 }, // Bottom center
    { x: 15, y: 70, angle: 90 }, // Lower left
    { x: 15, y: 45, angle: 90 }, // Middle left
    { x: 15, y: 20, angle: -45 }, // Upper left
  ],
  9: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 15, angle: 90 }, // 1 right
    { x: 85, y: 40, angle: 90 }, // 2 right
    { x: 85, y: 65, angle: -75 }, // 3 right
    { x: 75, y: 88, angle: 45 }, // 4 center
    { x: 25, y: 88, angle: 75 }, // 4 left
    { x: 15, y: 65, angle: 90 }, // 3 left
    { x: 15, y: 40, angle: 90 }, // 2 left
    { x: 15, y: 15, angle: -45 }, // 1 left
  ],
  10: [
    { x: 50, y: 5, angle: 45 }, // Top center
    { x: 85, y: 15, angle: 90 }, // 1 right
    { x: 85, y: 37, angle: 90 }, // 2 right
    { x: 85, y: 60, angle: 90 }, // 3 right
    { x: 85, y: 83, angle: -45 }, // 4 center
    { x: 50, y: 90, angle: 45 }, // Bottom center
    { x: 15, y: 83, angle: 90 }, // 4 left
    { x: 15, y: 60, angle: 90 }, // 3 left
    { x: 15, y: 37, angle: 90 }, // 2 left
    { x: 15, y: 15, angle: -45 }, // 1 left
  ],
};

/**
 * Get positions for kids arranged in an ellipse pattern
 * @param kidCount - Number of kids to position (3-7)
 * @returns Array of positions with x, y coordinates (as percentages) and angle in degrees
 */
export function calculateEllipsePositions(kidCount: number): EllipsePosition[] {
  const positions = HARDCODED_POSITIONS[kidCount];

  if (!positions) {
    // Fallback to 5 kids if count not found
    return HARDCODED_POSITIONS[5];
  }

  return positions;
}
