// Internal
import type { Clue, Grid } from './types';
import { getClueKey } from './helpers';
// A utility function to help debug without console.log

/**
 * Validates the player's clue state
 * @param clues All clues in the game
 * @param grid The game grid
 * @param userId The current user's ID
 * @param guesses The current guesses state
 * @returns A string with diagnostic information
 */
export function validatePlayerClue(
  clues: Clue[],
  grid: Grid,
  userId: string,
  guesses: PlainObject,
): { valid: boolean; reason?: string } {
  // Find player's own clue
  const playerClue = clues.find((clue) => clue.playerId === userId);
  if (!playerClue) {
    return { valid: false, reason: 'Player clue not found in clues array' };
  }

  // Check if player's clue is in guesses
  const playerClueKey = getClueKey(playerClue);
  const playerGuessCoordinate = guesses[playerClueKey];
  if (playerGuessCoordinate === undefined) {
    return { valid: false, reason: 'Player clue not found in guesses' };
  }

  // Check if the coordinate is valid
  const targetCell = grid.find((cell) => cell.index === playerGuessCoordinate);
  if (!targetCell) {
    return { valid: false, reason: 'Target cell not found in grid' };
  }

  // Check if the cell belongs to the player
  if (targetCell.playerId !== userId) {
    return {
      valid: false,
      reason: `Cell belongs to player ${targetCell.playerId}, not the current player ${userId}`,
    };
  }

  return { valid: true };
}
