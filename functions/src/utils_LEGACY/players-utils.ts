import { cloneDeep, groupBy, orderBy, shuffle } from 'lodash';
// Constants
import { AVATARS_COLORS } from '../constants/avatars';
// Services
import { throwHttpsError } from '../services/firebase-core';
// Internal
import { getRandomUniqueItem } from './game-utils';

/**
 * Generates a player id based on their name by normalizing, removing accents, and lowercasing.
 * @param playerName - The name of the player to generate an ID from
 * @returns A unique identifier string prefixed with underscore
 */
export function generatePlayerId(playerName: string): UID {
  return `_${playerName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Replace characters with accents
    .toLowerCase()}`;
}

/**
 * Creates a new player object with default properties.
 * @param id - The unique identifier for the player
 * @param name - The display name of the player
 * @param avatarId - The player's chosen avatar ID, will be reassigned if already in use
 * @param players - The existing players object to check for avatar conflicts
 * @param isGuest - Whether the player is a guest user
 * @returns A new player object with initialized properties
 */
export const createPlayer = (
  id: UID,
  name: string,
  avatarId: string,
  players: Players = {},
  isGuest?: boolean,
): Player => {
  const playerList = getListOfPlayers(players, true);
  const usedAvatars = playerList.map((player) => player.avatarId);
  const newAvatarId = usedAvatars.includes(avatarId)
    ? getRandomUniqueItem(Object.keys(AVATARS_COLORS), usedAvatars)
    : avatarId;

  return {
    id,
    name,
    avatarId: newAvatarId,
    type: 'player',
    ready: false,
    score: 0,
    updatedAt: Date.now(),
    isGuest: Boolean(isGuest),
  };
};

/**
 * Sets the specified player as ready and updates their timestamp.
 * @param players - The players object to modify
 * @param playerId - The ID of the player to mark as ready
 * @returns The modified players object
 */
export const readyPlayer = (players: Players, playerId: UID): Players => {
  players[playerId].ready = true;
  players[playerId].updatedAt = Date.now();
  return players;
};

/**
 * Sets all players as ready, optionally excluding one player.
 * @param players - The players object to modify
 * @param butThisOne - Optional player ID to exclude from being marked ready
 */
export const readyPlayers = (players: Players, butThisOne: UID = '') => {
  for (const playerKey in players) {
    players[playerKey].ready = playerKey !== butThisOne;
  }
};

/**
 * Sets the specified player as not ready and updates their timestamp.
 * @param players - The players object to modify
 * @param playerId - The ID of the player to mark as not ready
 */
export const unReadyPlayer = (players: Players, playerId: UID) => {
  players[playerId].ready = false;
  players[playerId].updatedAt = Date.now();
};

/**
 * Sets all non-bot players as not ready, optionally excluding specific players.
 * @param players - The players object to modify
 * @param butThisOne - Optional player ID or array of player IDs to keep as ready
 */
export const unReadyPlayers = (players: Players, butThisOne?: UID | UID[]) => {
  const excludeList: UID[] = butThisOne ? (typeof butThisOne === 'string' ? [butThisOne] : butThisOne) : [];
  for (const playerKey in players) {
    if (players[playerKey].type === 'player') {
      players[playerKey].ready = excludeList.includes(playerKey);
    }
  }
};

/**
 * Adds properties to all players in the players object.
 * @param players - The players object to modify
 * @param properties - An object containing the properties to add to each player, or a function that receives each player and returns properties to add
 */
export const addPropertiesToPlayers = (
  players: Players,
  properties: PlainObject | ((player: Player) => PlainObject),
) => {
  for (const playerId in players) {
    const propsToAdd = typeof properties === 'function' ? properties(players[playerId]) : properties;

    players[playerId] = {
      ...players[playerId],
      ...cloneDeep(propsToAdd),
      updatedAt: Date.now(),
    };
  }
};

/**
 * Removes specified properties from all players in the players object.
 * @param players - The players object to modify
 * @param properties - An array of property names to remove from each player
 */
export const removePropertiesFromPlayers = (players: Players, properties: string[]) => {
  for (const playerId in players) {
    properties.forEach((property) => {
      delete players[playerId]?.[property];
    });
  }
};

/**
 * Resets all players to their default state, keeping only essential properties.
 * @param players - The players object to reset
 */
export const resetPlayers = (players: Players) => {
  for (const playerId in players) {
    players[playerId] = {
      id: playerId,
      avatarId: players[playerId].avatarId,
      name: players[playerId].name,
      type: players[playerId].type,
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    };
  }
};

/**
 * Checks if all players (including bots) have their ready status set to true.
 * @param players - The players object to check
 * @returns True if all players are ready, false otherwise
 */
export const isEverybodyReady = (players: Players): boolean => {
  return getListOfPlayers(players, true).every((player) => player.ready);
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

/**
 * Counts the total number of players in the game.
 * @param players - The players object to count
 * @param includeBots - Whether to include bot players in the count
 * @returns The number of players in the game
 */
export const getPlayerCount = (players: Players, includeBots = true): number =>
  getListOfPlayersIds(players, includeBots).length;

/**
 * Creates and distributes randomized numeric IDs to players as a specified property.
 * @param players - The players object to modify
 * @param startingId - The starting number for the ID range
 * @param endingId - The ending number for the ID range
 * @param propertyName - The property name to assign the ID to on each player
 * @param includeBots - Whether to include bot players in the distribution
 */
export const distributeNumberIds = (
  players: Players,
  startingId: number,
  endingId: number,
  propertyName: string,
  includeBots = false,
) => {
  const ids = shuffle(new Array(startingId + endingId + 1).fill(0).map((e, i) => e + i));
  // Add sheep id
  getListOfPlayers(players, includeBots).forEach((player, index) => {
    player[propertyName] = `${ids[index]}`;
  });
};

/**
 * Distributes items from a list to players in round-robin fashion.
 * @param players - The players object to modify
 * @param list - The array of items to distribute
 * @param quantityPerPlayer - How many items each player should receive
 * @param propertyName - The property name to assign the items to on each player
 */
export const dealItemsToPlayers = (
  players: Players,
  list: unknown[],
  quantityPerPlayer: number,
  propertyName: string,
  doItsBestToEvenlyDistribute = false,
) => {
  const playersList = getListOfPlayers(players);
  if (list.length < playersList.length * quantityPerPlayer && !doItsBestToEvenlyDistribute) {
    throwHttpsError('List has less items the needed', 'deal items to players');
  }

  if (quantityPerPlayer === 1) {
    playersList.forEach((player, index) => {
      player[propertyName] = list[index];
    });
    return players;
  }

  for (let i = 0; i < playersList.length * quantityPerPlayer; i++) {
    const player = playersList[i % playersList.length];
    if (player[propertyName] === undefined) {
      player[propertyName] = [];
    }

    if (list[i] !== undefined) {
      player[propertyName].push(list[i]);
    }
  }
};

/**
 * Adds bot players to the players object with randomized names and avatars.
 * @param players - The players object to modify
 * @param language - The language to use for bot names (English or Portuguese)
 * @param quantity - The number of bots to add (1-5)
 * @param defaultProperties - Additional properties to assign to each bot from the start
 * @returns An array of the created bot players
 */
export const addBots = (
  players: Players,
  language: Language,
  quantity: 1 | 2 | 3 | 4 | 5,
  defaultProperties: Record<string, unknown> = {},
) => {
  const names = shuffle(
    language === 'en'
      ? ['Pixandra', 'Codey', 'Roborta', 'Techory', 'Pixandra', 'Digitany', 'Algorita', 'Bitney']
      : ['Codevaldo', 'CPUgo', 'Roborval', 'Megabyteus', 'Pixélio', 'Techiane', 'Digivaldo'],
  );
  const avatarIds = ['A', 'B', 'C', 'D', 'E'];
  const ids = ['a-bot', 'b-bot', 'c-bot', 'd-bot', 'e-bot'];
  const bots: Player[] = new Array(quantity).fill(0).map((_, i) => ({
    ...cloneDeep({
      ...createPlayer(generatePlayerId(ids[i]), names[i], avatarIds[i]),
      ...defaultProperties,
      type: 'bot',
      ready: true,
    }),
  }));

  bots.forEach((bot) => {
    players[bot.id] = bot;
  });

  return bots;
};

/**
 * Retrieves a list of player objects, optionally including bots and excluding specific players.
 * @param players - The players object to extract from
 * @param includeBots - Whether to include bot players in the list
 * @param butThese - An array of player IDs to exclude from the list
 * @returns An array of player objects
 */
export const getListOfPlayers = (players: Players, includeBots = false, butThese: UID[] = []): Player[] => {
  const options = Object.values(players).filter((player) => !butThese.includes(player.id));
  if (includeBots) return options;
  return options.filter((player) => player.type === 'player');
};

/**
 * Retrieves a list of player IDs from the given players object.
 * @param players - The object containing player information.
 * @param includeBots - A boolean indicating whether to include bot players in the list. Defaults to false.
 * @param butThese - An array of player IDs to exclude from the list. Defaults to an empty array.
 * @returns An array of player IDs, ordered by player name in ascending order.
 */
export const getListOfPlayersIds = (players: Players, includeBots = false, butThese: UID[] = []): UID[] => {
  return orderBy(getListOfPlayers(players, includeBots, butThese), ['name'], ['asc']).map(
    (player) => player.id,
  );
};

/**
 * Sorts an array of player IDs based on the players' names in ascending order.
 * @param playerIds - An array of player IDs to be sorted.
 * @param players - An object containing player information, where the key is the player ID and the value is the player object.
 * @returns A new array of player IDs sorted by the players' names in ascending order.
 */
export const sortPlayerIdsByName = (playerIds: UID[], players: Players): UID[] => {
  return orderBy(
    playerIds.map((id) => players[id]),
    ['name'],
    ['asc'],
  ).map((player) => player.id);
};

/**
 * Retrieves a list of all bot players from the players object.
 * @param players - The players object to extract from
 * @returns An array of bot player objects
 */
export const getListOfBots = (players: Players): Player[] => {
  return Object.values(players).filter((player) => player.type === 'bot');
};

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
 * Cleans up the properties of a collection of players objects by deleting all properties
 * except for a predefined set of keys, plus any additional keys specified in the `keepKeys` parameter.
 * @param players - A collection of players objects to clean up.
 * @param [keepKeys=[]] - An optional array of additional keys to keep in the objects.
 * @returns The cleaned up collection of players objects.
 */
export const cleanup = (players: Players, keepKeys: string[]) => {
  const keys = ['avatarId', 'id', 'name', 'ready', 'score', 'updatedAt', 'type', ...keepKeys];
  getListOfPlayers(players, true).forEach((player) => {
    player.ready = false;
    Object.keys(player).forEach((key) => {
      if (!keys.includes(key)) {
        delete player[key];
      }
    });
  });

  return players;
};

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
