// Types
import {
  GameOrder,
  PlainObject,
  Player,
  PlayerAvatarId,
  PlayerId,
  PlayerName,
  Players,
  TurnOrder,
} from './types';
// Constants
import { AVATAR_IDS } from './constants';
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
 * @param butThisOne
 * @returns
 */
export const unReadyPlayers = (players: Players, butThisOne?: PlayerId, butThose?: PlayerId[]): Players => {
  const excludeList: PlayerId[] = butThisOne ? [butThisOne] : butThose ? butThose : [];
  for (const playerKey in players) {
    players[playerKey].ready = excludeList.includes(playerKey);
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
    players[playerId] = {
      id: playerId,
      avatarId: players[playerId].avatarId,
      name: players[playerId].name,
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
