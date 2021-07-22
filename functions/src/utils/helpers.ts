import { AVATAR_IDS, LETTERS } from './constants';
import { GameCode, Player, PlayerAvatarId, PlayerId, PlayerName, Players, Teams } from '../utils/interfaces';
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
 * Set all players as not ready
 * @param players
 * @param butThisOne
 * @returns
 */
export const unReadyPlayers = (players: Players, butThisOne: PlayerId = ''): Players => {
  for (const playerKey in players) {
    players[playerKey].ready = playerKey === butThisOne ? true : false;
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
  for (const playerKey in players) {
    properties.forEach((property) => {
      delete players[playerKey]?.[property];
    });
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
 * @param round
 * @param totalRounds
 * @returns
 */
export const getRoundsToEndGame = (round: number, totalRounds: number): number => {
  return totalRounds - round;
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
