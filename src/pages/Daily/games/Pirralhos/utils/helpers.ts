import { cloneDeep, merge } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
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
    { x: 50, y: 8, angle: -90 }, // Top center
    { x: 85, y: 75, angle: 90 }, // Bottom right
    { x: 15, y: 75, angle: 210 }, // Bottom left
  ],
  4: [
    { x: 50, y: 8, angle: -90 }, // Top center
    { x: 85, y: 35, angle: 0 }, // Right
    { x: 50, y: 92, angle: 90 }, // Bottom center
    { x: 15, y: 35, angle: 180 }, // Left
  ],
  5: [
    { x: 50, y: 5, angle: -90 }, // Top center
    { x: 88, y: 30, angle: -18 }, // Top right
    { x: 75, y: 75, angle: 54 }, // Bottom right
    { x: 25, y: 75, angle: 126 }, // Bottom left
    { x: 12, y: 30, angle: 198 }, // Top left
  ],
  6: [
    { x: 50, y: 5, angle: -90 }, // Top center
    { x: 85, y: 25, angle: -30 }, // Top right
    { x: 85, y: 65, angle: 30 }, // Bottom right
    { x: 50, y: 92, angle: 90 }, // Bottom center
    { x: 15, y: 65, angle: 150 }, // Bottom left
    { x: 15, y: 25, angle: 210 }, // Top left
  ],
  7: [
    { x: 50, y: 3, angle: -90 }, // Top center
    { x: 85, y: 20, angle: -38 }, // Upper right
    { x: 90, y: 50, angle: 0 }, // Middle right
    { x: 70, y: 80, angle: 51 }, // Lower right
    { x: 30, y: 80, angle: 129 }, // Lower left
    { x: 10, y: 50, angle: 180 }, // Middle left
    { x: 15, y: 20, angle: 218 }, // Upper left
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

/**
 * Calculate the rotation angle for an arrow pointing from one kid to the next
 * @param fromAngle - Angle of the current kid in degrees
 * @param toAngle - Angle of the next kid in degrees
 * @returns Rotation angle in degrees for the arrow
 */
export function calculateArrowRotation(fromAngle: number, toAngle: number): number {
  // Calculate the midpoint angle
  let midAngle = (fromAngle + toAngle) / 2;

  // Handle the wrap-around case (e.g., from 315° to 45°)
  if (Math.abs(toAngle - fromAngle) > 180) {
    midAngle = ((fromAngle + toAngle + 360) / 2) % 360;
  }

  // Add 90 degrees because the arrow should point along the ellipse tangent
  // (perpendicular to the radius at that point)
  return midAngle + 90;
}
