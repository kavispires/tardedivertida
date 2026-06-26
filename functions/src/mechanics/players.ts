import { cloneDeep, orderBy, shuffle } from 'lodash';
// Constants
import { AVATARS_COLORS } from '../constants/avatars';
// Utils
import { getRandomUniqueItem, stringRemoveAccents } from '../utils';

// ===========================================================
// PLAYER MECHANICS UTILITIES
// ===========================================================

/**
 * Generates a player id based on their name by normalizing, removing accents, and lowercasing.
 * @param playerName - The name of the player to generate an ID from
 * @returns A unique identifier string prefixed with underscore
 */
export function generatePlayerId(playerName: string): UID {
  return `_${stringRemoveAccents(playerName).toLowerCase()}`;
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
  const usedAvatars = Object.values(players).map((player) => player.avatarId);
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
 * Counts the total number of players in the game.
 * @param players - The players object to count
 * @param includeBots - Whether to include bot players in the count
 * @returns The number of players in the game
 */
export const getPlayerCount = (players: Players, includeBots = true): number =>
  getListOfPlayersIds(players, includeBots).length;

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

type ReadyStateOptions = {
  /** Specific player IDs to update. If omitted, applies to all players. */
  targetIds?: UID[];
  /** Player IDs that should receive the INVERSE of the isReady state. */
  excludeIds?: UID[];
  /** If true, bots will be skipped and their state left unchanged. */
  ignoreBots?: boolean;
};

/**
 * Updates the ready state for one, multiple, or all players.
 * @param players - The players object to modify
 * @param isReady - The target ready state (true or false)
 * @param options - Configuration for targeting, exclusions, and bot handling
 * @returns The modified players object
 */
export const setPlayersReadyState = (
  players: Players,
  isReady: boolean,
  options: ReadyStateOptions = {},
): Players => {
  const now = Date.now();
  const { targetIds, excludeIds, ignoreBots } = options;

  for (const playerId in players) {
    const player = players[playerId];

    // RULE: Leave bots as-is if ignoreBots is true
    if (ignoreBots && player.type === 'bot') {
      continue;
    }

    // RULE: readyPlayer / unreadyPlayer behavior
    // If targetIds is provided and this player isn't in it, leave them as-is
    if (targetIds && !targetIds.includes(playerId)) {
      continue;
    }

    // RULE: readyPlayers / unReadyPlayers behavior
    // Replicates your original logic: targets get `isReady`, exclusions get the inverse.
    player.ready = excludeIds?.includes(playerId) ? !isReady : isReady;
    player.updatedAt = now;
  }

  return players;
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
 * Cleans up the properties of a collection of players objects by deleting all properties
 * except for a predefined set of keys, plus any additional keys specified in the `keepKeys` parameter.
 * @param players - A collection of players objects to clean up.
 * @param [keepKeys=[]] - An optional array of additional keys to keep in the objects.
 * @returns The cleaned up collection of players objects.
 */
export const cleanupPlayers = (players: Players, keepKeys: string[]) => {
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

// ===========================================================
// BOT MANAGEMENT UTILITIES
// ===========================================================

/**
 * Retrieves a list of all bot players from the players object.
 * @param players - The players object to extract from
 * @returns An array of bot player objects
 */
export const getListOfBots = (players: Players): Player[] => {
  return Object.values(players).filter((player) => player.type === 'bot');
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
