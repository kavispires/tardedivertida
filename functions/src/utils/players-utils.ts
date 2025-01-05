// Constants
import { cloneDeep, orderBy } from 'lodash';
import { AVATAR_IDS } from './constants';
import { throwException } from './firebase';
// Utils
import { getRandomUniqueItem, shuffle } from './game-utils';

/**
 * Generates a player id based of their name
 * @param playerName
 * @returns
 */
export function generatePlayerId(playerName: PlayerName): PlayerId {
  return `_${playerName
    .normalize('NFD')
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
    .replace(/[\u0300-\u036f]/g, '') // Replace characters with accents
    .toLowerCase()}`;
}

/**
 * Creates new player object
 * @param name
 * @param avatarId the player's chosen avatar
 * @param players
 * @returns
 */
export const createPlayer = (
  id: PlayerId,
  name: PlayerName,
  avatarId: PlayerAvatarId,
  players: Players = {},
  isGuest?: boolean,
): Player => {
  const playerList = getListOfPlayers(players, true);
  const usedAvatars = playerList.map((player) => player.avatarId);
  const newAvatarId = usedAvatars.includes(avatarId)
    ? getRandomUniqueItem(AVATAR_IDS, usedAvatars)
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
 * Set given player as ready in the players object
 * @param players
 * @param playerId
 * @returns
 */
export const readyPlayer = (players: Players, playerId: PlayerId): Players => {
  players[playerId].ready = true;
  players[playerId].updatedAt = Date.now();
  return players;
};

/**
 * Set all players as ready
 * @param players
 * @param butThisOne
 * @returns
 */
export const readyPlayers = (players: Players, butThisOne: PlayerId = ''): Players => {
  for (const playerKey in players) {
    players[playerKey].ready = playerKey !== butThisOne;
  }
  return players;
};

/**
 * Set given player as ready in the players object
 * @param players
 * @param playerId
 * @returns
 */
export const unReadyPlayer = (players: Players, playerId: PlayerId): Players => {
  players[playerId].ready = false;
  players[playerId].updatedAt = Date.now();
  return players;
};

/**
 * Set all players as not ready
 * @param players
 * @param butThisOne - playerId or list of player ids to be ignored
 * @returns
 */
export const unReadyPlayers = (players: Players, butThisOne?: PlayerId | PlayerId[]): Players => {
  const excludeList: PlayerId[] = butThisOne
    ? typeof butThisOne === 'string'
      ? [butThisOne]
      : butThisOne
    : [];
  for (const playerKey in players) {
    if (players[playerKey].type === 'player') {
      players[playerKey].ready = excludeList.includes(playerKey);
    }
  }
  return players;
};

/**
 * Add properties to players
 * @param players
 * @param properties object with properties to be added
 * @returns
 */
export const addPropertiesToPlayers = (players: Players, properties: PlainObject): Players => {
  for (const playerId in players) {
    players[playerId] = {
      ...players[playerId],
      ...cloneDeep(properties),
      updatedAt: Date.now(),
    };
  }
  return players;
};

/**
 * Add properties to players
 * @param players
 * @param properties array with property names to ne removed
 * @returns
 */
export const removePropertiesFromPlayers = (players: Players, properties: string[]): Players => {
  for (const playerId in players) {
    properties.forEach((property) => {
      delete players[playerId]?.[property];
    });
  }
  return players;
};

/**
 * Set all players as not ready
 * @param players
 * @returns
 */
export const resetPlayers = (players: Players): Players => {
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
  return players;
};

/**
 * Verify if all players are ready
 * @param players
 * @returns
 */
export const isEverybodyReady = (players: Players): boolean => {
  return getListOfPlayers(players, true).every((player) => player.ready);
};

/**
 * Determine winners based on who has the highest score
 * @param players
 * @returns array of winning players
 */
export const determineWinners = (players: Players): Player[] => {
  const listOfPlayers = getListOfPlayers(players, true);
  const maxScore = Math.max(...listOfPlayers.map((player) => player.score));
  return listOfPlayers.filter((player) => {
    return player.score === maxScore;
  });
};

/**
 * Get active player
 * @param turnOrder
 * @param currentRound
 * @returns
 */
export const getActivePlayer = (turnOrder: GameOrder | TurnOrder, currentRound: number) => {
  return turnOrder[(currentRound - 1) % turnOrder.length];
};

/**
 * Get next player in a turn order after the current player
 * @param turnOrder
 * @param activePlayerId
 * @returns
 */
export const getNextPlayer = (turnOrder: GameOrder | TurnOrder, activePlayerId: PlayerId): PlayerId => {
  const index = turnOrder.indexOf(activePlayerId);

  if (index === -1) return turnOrder[0];

  return turnOrder[(index + 1) % turnOrder.length];
};

/**
 * Get previous player in a turn order before the current player
 * @param turnOrder
 * @param activePlayerId
 * @returns
 */
export const getPreviousPlayer = (turnOrder: GameOrder | TurnOrder, activePlayerId: PlayerId): PlayerId => {
  const index = turnOrder.indexOf(activePlayerId);

  if (index === -1 || index === 0) return turnOrder[turnOrder.length - 1];

  return turnOrder[(index - 1) % turnOrder.length];
};

/**
 * Counts how many player keys are in players a.k.a the number of players in the game
 * @param players
 * @returns
 */
export const getPlayerCount = (players: Players, includeBots = true): number =>
  getListOfPlayersIds(players, includeBots).length;

/**
 * Creates number ids and distribute them as given propertyName to players
 * @param players
 * @param startingId
 * @param endingId
 * @param propertyName
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
 * Deal items from a list to players
 * @param players
 * @param list
 * @param quantityPerPlayer
 * @param propertyName
 */
export const dealItemsToPlayers = (
  players: Players,
  list: unknown[],
  quantityPerPlayer: number,
  propertyName: string,
) => {
  const playersList = getListOfPlayers(players);
  if (list.length < playersList.length * quantityPerPlayer) {
    throwException('List has less items the needed', 'deal items to players');
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

    player[propertyName].push(list[i]);
  }

  return players;
};

/**
 * Adds bots to the players object
 * @param players
 * @param quantity 1-5
 * @returns
 */
export const addBots = (
  players: Players,
  quantity: 1 | 2 | 3 | 4 | 5,
  defaultProperties: Record<string, unknown> = {},
) => {
  const names = ['A-bot', 'B-bop', 'C-am', 'D-Doo', 'E-max'];
  const avatarIds = ['A', 'B', 'C', 'D', 'E'];
  const bots: Player[] = new Array(quantity).fill(0).map((n, i) => ({
    ...cloneDeep({
      ...createPlayer(generatePlayerId(names[n + i]), names[i], avatarIds[i]),
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
 * Get list of non-bot players
 * @param players
 * @param includeBots default=false
 * @param butThese player ids to ignore
 * @returns array of players
 */
export const getListOfPlayers = (
  players: Players,
  includeBots = false,
  butThese: PlayerId[] = [],
): Player[] => {
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
export const getListOfPlayersIds = (
  players: Players,
  includeBots = false,
  butThese: PlayerId[] = [],
): PlayerId[] => {
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
export const sortPlayerIdsByName = (playerIds: PlayerId[], players: Players): PlayerId[] => {
  return orderBy(
    playerIds.map((id) => players[id]),
    ['name'],
    ['asc'],
  ).map((player) => player.id);
};

/**
 * Get list of bot players
 * @param players
 * @returns
 */
export const getListOfBots = (players: Players): Player[] => {
  return Object.values(players).filter((player) => player.type === 'bot');
};

/**
 * When bots shouldn't score, it clears their score
 * @param players
 */
export const neutralizeBotScores = (players: Players) => {
  getListOfBots(players).forEach((botPlayer) => {
    botPlayer.score = 0;
  });
};

/**
 * Randomizes player ids
 * @param players
 * @param doublingThreshold - doubles the order player count is lower than this
 * @returns obj - gameOrder is the randomized order of players,
 * playerIds is the list of player ids in the game,
 * playerCount is the number of players in the game
 */
export const buildGameOrder = (
  players: Players,
  doublingThreshold = 0,
  includeBots = false,
  excludePlayersIds: PlayerId[] = [],
): { gameOrder: PlayerId[]; playerIds: PlayerId[]; playerCount: number } => {
  const playerIds = shuffle(getListOfPlayersIds(players, includeBots, excludePlayersIds));
  const gameOrder = playerIds.length < doublingThreshold ? [...playerIds, ...playerIds] : playerIds;
  return { gameOrder, playerIds, playerCount: playerIds.length };
};

/**
 * Orders a randomized player list starting from given player id
 * @param gameOrder - the order of players
 * @param startingPlayerId - the player to start the order
 * @returns
 */
export const reorderGameOrder = (gameOrder: PlayerId[], startingPlayerId: PlayerId) => {
  const index = gameOrder.indexOf(startingPlayerId);
  if (index === -1) {
    return gameOrder;
  }

  return [...gameOrder.slice(index), ...gameOrder.slice(0, index)];
};

export class Scores {
  scores: NewScores;

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
   * Adds a value to given player's gained score
   * @param playerId
   * @param value
   * @param gainedIndex
   */
  add(playerId: PlayerId, value: number, gainedIndex = 0): void {
    this.scores[playerId].gainedPoints[gainedIndex] += value;
    this.scores[playerId].newScore += value;
  }

  /**
   * Adds a value to all players's gained score in the list
   * @param playerIds
   * @param value
   * @param gainedIndex
   */
  addMultiple(playerIds: PlayerId[], value: number, gainedIndex = 0): void {
    playerIds.forEach((playerId) => {
      this.scores[playerId].gainedPoints[gainedIndex] += value;
      this.scores[playerId].newScore += value;
    });
  }

  /**
   * Subtracts a value from given player's gained score
   * @param playerId
   * @param value
   * @param gainedIndex
   */
  subtract(playerId: PlayerId, value: number, gainedIndex = 0): void {
    this.scores[playerId].gainedPoints[gainedIndex] -= value;
    this.scores[playerId].newScore -= value;
  }

  /**
   * Returns sorted round's ranking
   */
  rank(players: Players): NewScore[] {
    // Add the new score to the player
    if (players) {
      getListOfPlayers(players, true).forEach((player) => {
        player.score = this.scores[player.id].newScore;
      });
    }

    return Object.values(this.scores).sort((a: NewScore, b: NewScore) => (a.newScore > b.newScore ? 1 : -1));
  }

  /**
   * Resets previous and total score
   */
  reset(): void {
    Object.values(this.scores).forEach((entry) => {
      entry.previousScore = 0;
      entry.newScore = 0;
    });
  }

  /**
   * Returns the gained score of a given player
   * @param playerId
   * @param index
   */
  get(playerId: PlayerId): number {
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
  votes: PlayerId[];
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
 * Ranks the votes of Players objects based on a given property.
 * @param players - A collection of players objects
 * @param property - The property to be compared
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

export const getWinningRankedVote = (
  rankedVotes: MostVotesResult[],
  turnOrder: PlayerId[],
  activePlayerId: PlayerId,
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
