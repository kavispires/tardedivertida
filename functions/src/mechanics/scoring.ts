// ===========================================================
// GAME SCORING MANAGEMENT UTILITIES
// ===========================================================

import { groupBy, orderBy } from 'lodash';
import { getListOfBots, getListOfPlayers } from './players';

/**
 * Manages score tracking for players, including previous scores, gained points, and new scores.
 */
export class Scores {
  scores: NewScores;

  /**
   * Creates a new Scores instance and initializes score tracking for all players.
   * @param players - The players object or array to track scores for
   * @param gainedPointsInitialState - Optional array defining the structure for tracking gained points across multiple categories
   */
  constructor(players: Players | Player[], gainedPointsInitialState?: number[]) {
    this.scores = {};

    this.init(players, gainedPointsInitialState);
  }

  private init(players: Players | Player[], gainedPointsInitialState?: number[]) {
    this.scores = Object.values(players)
      .filter((player) => player.type !== 'audience')
      .reduce((scores, player) => {
        scores[player.id] = {
          playerId: player.id,
          name: player.name,
          previousScore: player.score,
          gainedPoints: gainedPointsInitialState ? [...gainedPointsInitialState] : new Array(1).fill(0),
          newScore: player.score,
        };
        return scores;
      }, {});
  }

  /**
   * Adds points to a specific player's score.
   * @param playerId - The ID of the player to add points to
   * @param value - The number of points to add
   * @param gainedIndex - The index in the gainedPoints array to modify (for tracking points by category)
   */
  add(playerId: UID, value: number, gainedIndex = 0): void {
    this.scores[playerId].gainedPoints[gainedIndex] += value;
    this.scores[playerId].newScore += value;
  }

  /**
   * Adds points to multiple players' scores simultaneously.
   * @param playerIds - An array of player IDs to add points to
   * @param value - The number of points to add to each player
   * @param gainedIndex - The index in the gainedPoints array to modify (for tracking points by category)
   */
  addMultiple(playerIds: UID[], value: number, gainedIndex = 0): void {
    playerIds.forEach((playerId) => {
      this.scores[playerId].gainedPoints[gainedIndex] += value;
      this.scores[playerId].newScore += value;
    });
  }

  /**
   * Subtracts points from a specific player's score.
   * @param playerId - The ID of the player to subtract points from
   * @param value - The number of points to subtract
   * @param gainedIndex - The index in the gainedPoints array to modify (for tracking points by category)
   */
  subtract(playerId: UID, value: number, gainedIndex = 0): void {
    this.scores[playerId].gainedPoints[gainedIndex] -= value;
    this.scores[playerId].newScore -= value;
  }

  /**
   * Finalizes scores, updates player objects, and returns a sorted ranking.
   * @param players - The players object to update with the new scores
   * @param round - Whether to round all score values to integers
   * @returns A sorted array of score entries from lowest to highest
   */
  rank(players: Players, round?: boolean): NewScore[] {
    if (round) {
      Object.keys(this.scores).forEach((playerId) => {
        this.scores[playerId].newScore = Math.round(this.scores[playerId].newScore);
        this.scores[playerId].gainedPoints = this.scores[playerId].gainedPoints.map((g) => Math.round(g));
      });
    }

    // Add the new score to the player
    if (players) {
      getListOfPlayers(players, true).forEach((player) => {
        player.score = this.scores[player.id].newScore;
      });
    }

    return Object.values(this.scores).sort((a: NewScore, b: NewScore) => (a.newScore > b.newScore ? 1 : -1));
  }

  /**
   * Resets all players' previous and new scores to zero.
   */
  reset(): void {
    Object.values(this.scores).forEach((entry) => {
      entry.previousScore = 0;
      entry.newScore = 0;
    });
  }

  /**
   * Retrieves the total gained points for a specific player across all categories.
   * @param playerId - The ID of the player to get points for
   * @returns The sum of all gained points for the player
   */
  get(playerId: UID): number {
    return this.scores[playerId]?.gainedPoints.reduce((acc, g) => acc + g, 0) ?? 0;
  }
}

/**
 * Resets all bot players' scores to zero when bots shouldn't accumulate points.
 * @param players - The players object to modify
 */
export const neutralizeBotScores = (players: Players) => {
  getListOfBots(players).forEach((botPlayer) => {
    botPlayer.score = 0;
  });
};

/**
 * Calculates how many points the leading player needs to reach the victory threshold.
 * Returns 0 if a player has already reached or exceeded the victory points.
 * @param players - The players object containing all player data
 * @param victory - The number of points needed to win
 * @returns The number of points remaining until victory
 */
export const getPointsToVictory = (players: Players, victory: number): number => {
  const max = getListOfPlayers(players, true).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);
  return max < victory ? victory - max : 0;
};

/**
 * Orders a list of players by their score and optionally groups them by score.
 *
 * @param players - The list of players to be ordered.
 * @param groupByScore - A boolean indicating whether to group players by their score. Defaults to false.
 * @param resolveTiesBy - The property to use for resolving ties when players have the same score. Defaults to 'name'.
 * @returns An array of players ordered by score. If groupByScore is true, returns an array of arrays, where each inner array contains players with the same score.
 */
export const orderPlayersByScore = (
  players: Players,
  groupByScore = false,
  resolveTiesBy = 'name',
): Player[][] => {
  const listOfPlayers = orderBy(getListOfPlayers(players, true), ['score', resolveTiesBy], ['desc', 'asc']);

  if (groupByScore) {
    const groups = groupBy(listOfPlayers, 'score');

    const sortedScoreValues = orderBy(Object.keys(groups), [(o) => Number(o)], ['desc']);

    return sortedScoreValues.map((score) => groups[score]);
  }

  return listOfPlayers.map((player) => [player]);
};

/**
 * Determines the winning players based on who has the highest score.
 * @param players - The players object to evaluate
 * @returns An array of players with the highest score (may be multiple in case of ties)
 */
export const determineWinners = (players: Players): Player[] => {
  const orderedScores = orderPlayersByScore(players, true);
  return orderedScores[0];
};

/**
 * Determines the losing players based on who has the lowest score.
 * @param players - The players object to evaluate
 * @returns An array of players with the lowest score (may be multiple in case of ties)
 */
export const determineLosers = (players: Players): Player[] => {
  const orderedScores = orderPlayersByScore(players, true);
  return orderedScores[orderedScores.length - 1];
};
