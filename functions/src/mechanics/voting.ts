// Internal
import { getListOfPlayers } from './players';

export type MostVotesResult = {
  /**
   * The property that signals the vote (usually `vote`)
   */
  property: string;
  /**
   * The value of the property that signals the vote
   */
  value: string;
  /**
   * The players who voted for this result
   */
  votes: UID[];
  /**
   * How many players voted for this result
   */
  count: number;
  /**
   * In case of a tie in most votes (count)
   */
  tie?: boolean;
};

/**
 * Analyzes and ranks vote results based on a specified player property.
 * @param players - The players object to analyze
 * @param property - The property name on player objects that contains their vote
 * @param winnerOnly - Whether to return only the top vote recipient(s)
 * @returns An array of vote results sorted by vote count, with tie information
 */
export const getRankedVotes = (players: Players, property: string, winnerOnly = false): MostVotesResult[] => {
  const propertyCounts: Record<string, MostVotesResult> = {};

  // Calculate the counts for each property value
  getListOfPlayers(players, true).forEach((player) => {
    if (player[property] !== undefined) {
      const playerProperty = String(player[property]);

      if (!propertyCounts[playerProperty]) {
        propertyCounts[playerProperty] = {
          property,
          value: playerProperty,
          votes: [],
          count: 0,
        };
      }

      propertyCounts[playerProperty].votes.push(player.id);
      propertyCounts[playerProperty].count++;
    }
  });

  // Find the most repeating property values
  const resultArray: MostVotesResult[] = Object.values(propertyCounts);
  resultArray.sort((a, b) => b.count - a.count);

  const mostRepeatingCount = resultArray[0].count;

  if (resultArray[0].count === resultArray[1]?.count) {
    resultArray.forEach((result) => {
      result.tie = result.count === mostRepeatingCount;
    });
  }

  if (winnerOnly) {
    return resultArray.filter((result) => result.count === mostRepeatingCount);
  }

  return resultArray;
};

/**
 * Determines the winning vote result, using turn order to break ties if necessary.
 * @param rankedVotes - The ranked vote results from getRankedVotes
 * @param turnOrder - The turn order array for tie-breaking
 * @param activePlayerId - The current active player's ID for priority tie-breaking
 * @returns The winning vote result, with ties resolved by turn order
 */
export const getWinningRankedVote = (
  rankedVotes: MostVotesResult[],
  turnOrder: UID[],
  activePlayerId: UID,
): MostVotesResult => {
  // If there is only one entry in rankedVotes, that's the winner
  if (rankedVotes.length === 1) {
    return rankedVotes[0];
  }

  // If the first entry in rankedVotes does not have the 'tie' prop, it is the winner
  if (!rankedVotes[0].tie) {
    return rankedVotes[0];
  }

  const tiedResults = rankedVotes.filter((result) => result.tie);

  // Find the tied result that has the activePlayerId in the votes prop
  const tiedWithActivePlayer = tiedResults.find((result) => result.votes.includes(activePlayerId));

  // If the activePlayerId is among the tied entries, return that result
  if (tiedWithActivePlayer) {
    return tiedWithActivePlayer;
  }

  // Check the next player in turnOrder until a result is found
  const extendedTurnOrder = [...turnOrder, ...turnOrder];
  for (const playerId of extendedTurnOrder) {
    const tiedWithNextPlayer = tiedResults.find((result) => result.votes.includes(playerId));

    if (tiedWithNextPlayer) {
      return tiedWithNextPlayer;
    }
  }

  // If no winner is found, return the first entry
  return rankedVotes[0];
};
