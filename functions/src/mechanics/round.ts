/**
 * Calculates how many rounds remain until the game ends.
 * @param currentRound - The current round number
 * @param totalRounds - The total number of rounds in the game
 * @returns The number of rounds remaining
 */
export const getRoundsToEndGame = (currentRound: number, totalRounds: number): number => {
  return totalRounds - currentRound;
};

/**
 * Increments the current round count by 1.
 * Optionally allows overriding the total or setting a specific current round.
 * @param round - The current round object
 * @param total - Optional override for total rounds
 * @param current - Optional override for current round (prevents increment)
 * @returns Updated round object with incremented current value
 */
export const increaseRound = (round: Round, total?: number, current?: number): Round => {
  return {
    ...round,
    total: total ?? round.total,
    current: current ?? (round?.current ?? 0) + 1,
  };
};
