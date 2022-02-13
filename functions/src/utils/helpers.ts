import { AVATAR_IDS, LETTERS } from './constants';
import {
  BooleanDictionary,
  GameCode,
  GameOrder,
  InitialState,
  InitialStateArgs,
  NewScores,
  PlainObject,
  Player,
  PlayerAvatarId,
  PlayerId,
  PlayerName,
  Players,
  Round,
  Teams,
  TurnOrder,
} from './types';
import { shuffle, getRandomUniqueItem } from './game-utils';

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (gameCode: GameCode, usedIds: string[] = [], length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  if (gameCode.length > 1 || !LETTERS.includes(gameCode)) throw Error('Invalid game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: GameCode, length: number) {
    let id = `${gameCode}`;
    while (id.length < length) {
      id += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return id;
  }

  let gameId: string | null = null;
  while (!gameId || usedIds.includes(gameId)) {
    gameId = generateId(gameCode, length);
  }

  return gameId;
};

/**
 * Remove accents from a string keeping original letters
 * @param str
 * @returns
 */
export function stringRemoveAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Builds default initial state to be extended by game engines
 * @param dataObject
 * @returns
 */
export function getDefaultInitialState({
  gameId,
  gameName,
  uid,
  language,
  playerCounts,
  initialPhase,
  totalRounds,
  store,
  options = {},
}: InitialStateArgs): InitialState {
  return {
    meta: {
      gameId,
      gameName: gameName,
      createdAt: Date.now(),
      createdBy: uid,
      min: playerCounts.MIN,
      max: playerCounts.MAX,
      isLocked: false,
      isComplete: false,
      language,
      replay: 0,
      options,
    },
    players: {},
    store: {
      language,
      options,
      ...store,
    },
    state: {
      phase: initialPhase,
      round: {
        current: 0,
        total: totalRounds,
      },
      updatedAt: Date.now(),
    },
  };
}

/**
 * Generates a player id based of their name
 * @param playerName
 * @returns
 */
export function generatePlayerId(playerName: PlayerName) {
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
 * Set a property in all players
 * @param players
 * @param butThisOne
 * @returns
 */
export const modifyPlayers = (players: Players, property: string, value: any, butThisOne = ''): Players => {
  for (const playerKey in players) {
    if (playerKey !== butThisOne) {
      players[playerKey][property] = value;
    }
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
 * Set all players as not ready
 * @param players
 * @param butThisOne
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
 * Add properties to players
 * @param players
 * @param butThisOne
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
 * Verify if all players are ready
 * @param players
 * @returns
 */
export const isEverybodyReady = (players: Players): boolean => {
  return Object.values(players).every((player) => player.ready);
};

/**
 * Calculates how many points remain to call the end of the game
 * @param players
 * @param victory
 * @returns
 */
export const getPointsToVictory = (players: Players | Teams, victory: number): number => {
  const max = Object.values(players).reduce((acc, player) => {
    return Math.max(acc, player.score);
  }, 0);
  return max < victory ? victory - max : 0;
};

/**
 * Calculates how many rounds remain to call the end of the game
 * @param currentRound
 * @param totalRounds
 * @returns
 */
export const getRoundsToEndGame = (currentRound: number, totalRounds: number): number => {
  return totalRounds - currentRound;
};

/**
 * Determine each players teams
 * @param players
 * @param numberOfTeams
 * @returns an object with the teams (the players are modified by reference adding their team Letter)
 */
export const determineTeams = (
  players: Players,
  numberOfTeams: number,
  extraPoints: number[] = []
): Teams => {
  const teams = {};
  const playerIds = shuffle(Object.keys(players));
  const playersPerTeam = Math.ceil(playerIds.length / numberOfTeams);

  let currentTeamIndex = 0;
  let currentTeamCount = 0;
  playerIds.forEach((playerName) => {
    if (currentTeamCount >= playersPerTeam) {
      currentTeamCount = 0;
      currentTeamIndex += 1;
    }

    const teamLetter = LETTERS[currentTeamIndex];
    const extraPoint = extraPoints?.[currentTeamIndex] ?? 0;

    if (teams[teamLetter] === undefined) {
      teams[teamLetter] = {
        members: [],
        name: teamLetter,
        score: extraPoint,
      };
    }
    teams[teamLetter].members.push(playerName);
    players[playerName].team = teamLetter;
    players[playerName].score = extraPoint;

    currentTeamCount += 1;
  });

  return teams;
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
 * Orders array by a value its item object
 * @param {object[]} list
 * @param {string|string[]} properties
 * @param {string|string[]} orders
 * @returns {object[]}
 */
export const orderBy = (list: PlainObject[], properties: string | string[], orders: string | string[]) => {
  function sortBy(_key, _cb) {
    if (!_cb) _cb = () => 0;
    return (a, b) => (a[_key] > b[_key] ? 1 : b[_key] > a[_key] ? -1 : _cb(a, b));
  }

  function sortByDesc(key, _cb) {
    if (!_cb) _cb = () => 0;
    return (b, a) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : _cb(b, a));
  }

  let cb: any = () => 0;
  const p = Array.isArray(properties) ? properties.reverse() : [properties];
  const o = Array.isArray(orders) ? orders.reverse() : [orders];

  for (const [i, key] of p.entries()) {
    const order = o[i] ?? o[0] ?? 'asc';
    if (order === 'asc') {
      cb = sortBy(key, cb);
    } else if (order === 'desc') {
      cb = sortByDesc(key, cb);
    } else {
      throw new Error(`Unsupported order "${order}"`);
    }
  }

  return [...list].sort(cb);
};

/**
 * Increase the current round count by 1
 * @param round
 * @param [total] overrides total
 * @param [current] overrides current (there won't be a increase)
 * @returns
 */
export const increaseRound = (round: Round, total?: number, current?: number): Round => {
  return {
    total: total ?? round.total,
    current: current ?? (round?.current ?? 0) + 1,
  };
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
 * Flattens a two dimensional array
 * @param twoDimensionalArray
 * @returns
 */
export const flattenArray = (twoDimensionalArray: any[]) =>
  twoDimensionalArray.reduce((acc, arr) => [...acc, ...arr], []);

/**
 * Function to simulate calls when developing
 * @param duration
 */
export const wait = async (duration = 3000) => {
  if (process.env.FUNCTIONS_EMULATOR) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
};

/**
 * Creates a dictionary with used card ids
 * @param dataList
 * @returns
 */
export const buildUsedCardsIdsDict = (dataList: PlainObject[]): BooleanDictionary => {
  return dataList.reduce((acc, entry) => {
    acc[entry.id] = true;
    return acc;
  }, {});
};

/**
 * Builds new scoring object used by ranking builders
 * @param players
 * @param gainedPointsInitialState
 * @returns
 */
export const buildNewScoreObject = (players: Players, gainedPointsInitialState?: number[]): NewScores => {
  const newScores: NewScores = {};

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = {
      playerId: player.id,
      name: player.name,
      previousScore: player.score,
      gainedPoints: gainedPointsInitialState ? [...gainedPointsInitialState] : new Array(1).fill(0),
      newScore: player.score,
    };
  });

  return newScores;
};

/**
 * Randomizes player ids
 * @param players
 * @param doublingThreshold - doubles the order player count is lower than this
 * @returns
 */
export const buildGameOrder = (
  players: Players,
  doublingThreshold = 0
): { gameOrder: PlayerId[]; playerIds: PlayerId[]; playerCount: number } => {
  const playerIds = shuffle(Object.keys(players));
  const gameOrder = playerIds.length < doublingThreshold ? [...playerIds, ...playerIds] : playerIds;
  return { gameOrder, playerIds, playerCount: playerIds.length };
};
