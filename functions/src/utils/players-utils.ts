// Constants
import { AVATAR_IDS } from './constants';
import { throwException } from './firebase';
// Utils
import { getRandomUniqueItem, shuffle } from './game-utils';
import { deepCopy } from './helpers';

/**
 * Generates a player id based of their name
 * @param playerName
 * @returns
 */
export function generatePlayerId(playerName: PlayerName): PlayerId {
  return `_${playerName
    .normalize('NFD')
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
  players: Players = {}
): Player => {
  const playerList = Object.values(players);
  const usedAvatars = playerList.map((player) => player.avatarId);
  const newAvatarId = usedAvatars.includes(avatarId)
    ? getRandomUniqueItem(AVATAR_IDS, usedAvatars)
    : avatarId;

  return {
    id,
    name,
    avatarId: newAvatarId,
    ready: false,
    score: 0,
    updatedAt: Date.now(),
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
    players[playerKey].ready = playerKey === butThisOne ? false : true;
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
    if (!players[playerKey].bot) {
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
      ...properties,
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
    const isBot = Boolean(players[playerId].bot);
    players[playerId] = {
      id: playerId,
      avatarId: players[playerId].avatarId,
      name: players[playerId].name,
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    };

    if (isBot) {
      players[playerId].bot = true;
    }
  }
  return players;
};

/**
 * Verify if all players are ready
 * @param players
 * @returns
 */
export const isEverybodyReady = (players: Players): boolean => {
  return Object.values(players).every((player) => player.ready);
};

/**
 * Determine winners based on who has the highest score
 * @param players
 * @returns array of winning players
 */
export const determineWinners = (players: Players): Player[] => {
  const maxScore = Math.max(...Object.values(players).map((player) => player.score));
  return Object.values(players).filter((player) => {
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
export const getPlayerCount = (players: Players): number => Object.keys(players).length;

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
  propertyName: string
) => {
  const ids = shuffle(new Array(startingId + endingId + 1).fill(0).map((e, i) => e + i));
  // Add sheep id
  Object.values(players).forEach((player, index) => {
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
  quantityPerPlayer = 1,
  propertyName: string
) => {
  const playersList = Object.values(players);
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
  defaultProperties: Record<string, any> = {}
) => {
  const names = ['A-bot', 'B-bop', 'C-am', 'D-Doo', 'E-max'];
  const avatarIds = ['A', 'B', 'C', 'D', 'E'];
  const bots: Player[] = new Array(quantity).fill(0).map((n, i) => ({
    ...deepCopy({
      ...createPlayer(generatePlayerId(names[n + i]), names[i], avatarIds[i]),
      ...defaultProperties,
      bot: true,
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
 * @param ignoreBots
 * @returns
 */
export const getListOfPlayers = (players: Players, ignoreBots = true): Player[] => {
  if (!ignoreBots) return Object.values(players);

  return Object.values(players).filter((player) => !player.bot);
};

/**
 * Get list of bot players
 * @param players
 * @returns
 */
export const getListOfBots = (players: Players): Player[] => {
  return Object.values(players).filter((player) => player.bot);
};

/**
 * When bots shouldn't score, it clears their score
 * @param players
 */
export const neutralizeBotScores = (players: Players) => {
  Object.values(players).forEach((player) => {
    if (player.bot) {
      player.score = 0;
    }
  });
};
