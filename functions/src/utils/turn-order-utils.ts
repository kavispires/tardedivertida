// Utils
import { shuffle } from './game-utils';
import { getListOfPlayersIds } from './players-utils';

/**
 * Randomizes player ids
 * @param players - the players object
 * @param doublingThreshold - doubles the order player count is lower than this
 * @param includeBots - whether to include bots in the order
 * @param excludePlayersIds - player ids to exclude from the order
 * @returns obj - gameOrder is the randomized order of players, playerIds is the list of player ids in the game, playerCount is the number of players in the game
 */
export const buildGameOrder = (
  players: Players,
  doublingThreshold = 0,
  includeBots = false,
  excludePlayersIds: UID[] = [],
): { gameOrder: UID[]; playerIds: UID[]; playerCount: number } => {
  const playerIds = shuffle(getListOfPlayersIds(players, includeBots, excludePlayersIds));
  const gameOrder = playerIds.length < doublingThreshold ? [...playerIds, ...playerIds] : playerIds;
  return { gameOrder, playerIds, playerCount: playerIds.length };
};

/**
 * Orders a randomized player list starting from given player id
 * @param gameOrder - the order of players
 * @param startingPlayerId - the player to start the order
 * @returns the reordered game order starting from the specified player
 */
export const reorderGameOrder = (gameOrder: UID[], startingPlayerId: UID) => {
  const index = gameOrder.indexOf(startingPlayerId);
  if (index === -1) {
    return gameOrder;
  }

  return [...gameOrder.slice(index), ...gameOrder.slice(0, index)];
};

/**
 * Get active player
 * @param turnOrder - the turn order
 * @param currentRound - the current round (1-indexed)
 * @returns the player id of the active player for the given round
 */
export const getActivePlayer = (turnOrder: GameOrder | TurnOrder, currentRound: number) => {
  return turnOrder[(currentRound - 1) % turnOrder.length];
};

/**
 * Get next player in a turn order after the current player
 * @param turnOrder - the turn order
 * @param activePlayerId - the current active player id
 * @returns the player id of the next player in the turn order
 */
export const getNextPlayer = (turnOrder: GameOrder | TurnOrder, activePlayerId: UID): UID => {
  const index = turnOrder.indexOf(activePlayerId);

  if (index === -1) return turnOrder[0];

  return turnOrder[(index + 1) % turnOrder.length];
};

/**
 * Get previous player in a turn order before the current player
 * @param turnOrder - the turn order
 * @param activePlayerId - the current active player id
 * @returns the player id of the previous player in the turn order
 */
export const getPreviousPlayer = (turnOrder: GameOrder | TurnOrder, activePlayerId: UID): UID => {
  const index = turnOrder.indexOf(activePlayerId);

  if (index === -1 || index === 0) return turnOrder[turnOrder.length - 1];

  return turnOrder[(index - 1) % turnOrder.length];
};

/**
 * Rotate game order by N positions
 * @param order - the current turn order
 * @param positions - number of positions to rotate (positive for forward, negative for backward)
 * @param from - optional starting position (number) or player ID (UID) from which to start rotation; elements before this position remain untouched
 * @returns the rotated turn order
 */
export const rotateGameOrder = (
  order: GameOrder | TurnOrder,
  positions: number,
  from?: number | UID,
): UID[] => {
  if (order.length === 0) return order;

  // If no 'from' specified, rotate the entire array (original behavior)
  if (from === undefined) {
    const normalizedPositions = ((positions % order.length) + order.length) % order.length;
    return [...order.slice(normalizedPositions), ...order.slice(0, normalizedPositions)];
  }

  // Determine the starting index
  let startIndex: number;
  if (typeof from === 'number') {
    startIndex = from;
  } else {
    startIndex = order.indexOf(from);
    if (startIndex === -1) {
      // Player not found, return original order
      return [...order];
    }
  }

  // Validate startIndex
  if (startIndex < 0 || startIndex >= order.length) {
    return [...order];
  }

  // If startIndex is 0, rotate the entire array
  if (startIndex === 0) {
    const normalizedPositions = ((positions % order.length) + order.length) % order.length;
    return [...order.slice(normalizedPositions), ...order.slice(0, normalizedPositions)];
  }

  // Split array: keep elements before startIndex, rotate the rest
  const untouched = order.slice(0, startIndex);
  const toRotate = order.slice(startIndex);

  // Rotate the subset
  const normalizedPositions = ((positions % toRotate.length) + toRotate.length) % toRotate.length;
  const rotated = [...toRotate.slice(normalizedPositions), ...toRotate.slice(0, normalizedPositions)];

  return [...untouched, ...rotated];
};

/**
 * Get player at specific index with wrapping (safe array access)
 * @param order - the turn order
 * @param index - the index to get (can be negative or > length, will wrap)
 * @returns the player id at the specified index, or undefined if order is empty
 */
export const getPlayerAtIndex = (order: GameOrder | TurnOrder, index: number): UID | undefined => {
  if (order.length === 0) return undefined;

  const normalizedIndex = ((index % order.length) + order.length) % order.length;
  return order[normalizedIndex];
};

/**
 * Get players in the order specified by turnOrder
 * @param players - the players object
 * @param turnOrder - the turn order
 * @returns an array of player objects in the specified turn order
 */
export const getPlayersInOrder = (players: Players, turnOrder: GameOrder | TurnOrder): Player[] => {
  return turnOrder.map((playerId) => players[playerId]).filter(Boolean);
};

/**
 * Get 0-based position of a player in the turn order
 * @param turnOrder - the turn order
 * @param playerId - the player id to find
 * @returns the position (0-indexed) or -1 if not found
 */
export const getPlayerPosition = (turnOrder: GameOrder | TurnOrder, playerId: UID): number => {
  return turnOrder.indexOf(playerId);
};

/**
 * Reverse the game order
 * @param order - the current turn order
 * @returns the reversed turn order
 */
export const reverseGameOrder = (order: GameOrder | TurnOrder): UID[] => {
  return [...order].reverse();
};

/**
 * Validate if a turn order is valid (non-empty array of strings)
 * @param order - the turn order to validate
 * @returns true if the order is a valid non-empty array of strings, false otherwise
 */
export const isValidTurnOrder = (order: unknown): order is TurnOrder => {
  return Array.isArray(order) && order.length > 0 && order.every((id) => typeof id === 'string');
};
