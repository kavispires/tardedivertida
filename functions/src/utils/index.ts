import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { AVATAR_IDS, GAME_CODES, GAME_COLLECTIONS, GAME_KEYS, LETTERS } from './constants';
import {
  FirebaseContext,
  GameCode,
  GameId,
  PlainObject,
  Player,
  PlayerAvatarId,
  PlayerId,
  PlayerName,
  Players,
  Teams,
} from '../utils/interfaces';
import { getInitialState as arteRuimGetInitialState, nextArteRuimPhase } from '../engine/arte-ruim';
import {
  getInitialState as clubeDetetivesGetInitialState,
  nextClubeDetetivesPhase,
} from '../engine/clube-detetives';
import {
  getInitialState as espiaoEntreNosGetInitialState,
  nextEspiaoEntreNosPhase,
} from '../engine/espiao-entre-nos';
import {
  getInitialState as ondaTelepaticaGetInitialState,
  nextOndaTelepaticaPhase,
} from '../engine/onda-telepatica';
import { getInitialState as ueSoIssoGetInitialState, nextUeSoIssoPhase } from '../engine/ue-so-isso';
import { shuffle, getRandomUniqueItem } from './game-utils';

/**
 * Validate if payload property exists
 * @param property
 * @param propertyName
 * @param action
 */
export function verifyPayload(property?: any, propertyName = 'unknown property', action = 'function') {
  if (property === undefined || property === null) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: a ${propertyName} is required`);
  }
}

/**
 * Validate if user is authenticated
 * @param context
 * @param action
 */
export function verifyAuth(context: FirebaseContext, action = 'perform function') {
  // Verify auth
  const uid = context?.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('internal', `Failed to ${action}: you must be logged in`);
  }
}

/**
 * Get Firebase session for gameId in collection
 * @param collectionName
 * @param gameId
 * @returns firebase session reference
 */
export function getSessionRef(
  collectionName: string,
  gameId: string
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return admin.firestore().collection(collectionName).doc(gameId).collection('session');
}

/**
 * Aids deleting a value of a document on an update
 * @returns
 */
export function deleteValue() {
  return admin.firestore.FieldValue.delete();
}

/**
 * Get firebase doc verifying its existence
 * @param collectionName
 * @param gameId
 * @param doc
 * @param actionText
 * @returns
 */
export async function getSessionDoc(
  collectionName: string,
  gameId: string,
  docName: string,
  actionText: string
): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
  const sessionRef = getSessionRef(collectionName, gameId);
  const gameDoc = await sessionRef.doc(docName).get();

  if (!gameDoc.exists) {
    throw new functions.https.HttpsError(
      'internal',
      `Failed to ${actionText}: game ${collectionName}/${gameId}/${docName} does not exist`
    );
  }

  return gameDoc;
}

/**
 * Throws an exception. It should be used only inside a catch
 * @param error
 * @param action
 */
export function throwException(error: any, action = 'function') {
  throw new functions.https.HttpsError('internal', `Failed to ${action}: ${JSON.stringify(error)}`);
}

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (gameCode: GameCode, usedIds: string[] = [], length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: GameCode, length: number) {
    let id = `${gameCode}`;
    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
 * Get collection name by single letter game code
 * @param gameCode
 * @returns
 */
export const getCollectionNameByGameCode = (gameCode: GameCode): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_COLLECTIONS.ARTE_RUIM;
    case GAME_CODES.D:
      return GAME_COLLECTIONS.CLUBE_DETETIVE;
    case GAME_CODES.E:
      return GAME_COLLECTIONS.ESPIAO_ENTRE_NOS;
    case GAME_CODES.O:
      return GAME_COLLECTIONS.ONDA_TELEPATICA;
    case GAME_CODES.U:
      return GAME_COLLECTIONS.UE_SO_ISSO;
    default:
      return null;
  }
};

/**
 * Get collection internal key by single letter game code
 * @param gameCode
 * @returns
 */
export const getCollectionKeyByGameCode = (gameCode: GameCode): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_KEYS.ARTE_RUIM;
    case GAME_CODES.D:
      return GAME_KEYS.CLUBE_DETETIVE;
    case GAME_CODES.E:
      return GAME_KEYS.ESPIAO_ENTRE_NOS;
    case GAME_CODES.O:
      return GAME_KEYS.ONDA_TELEPATICA;
    case GAME_CODES.U:
      return GAME_KEYS.UE_SO_ISSO;
    default:
      return null;
  }
};

/**
 * Get collection name by extracting the first letter of a game id
 * @param {string} gameId
 */
export const getCollectionNameByGameId = (gameId: GameId): string | null => {
  return getCollectionNameByGameCode(gameId[0]);
};

/**
 * Get the initial state from game collection
 * @param collectionName
 * @returns
 */
export const getInitialStateForCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuimGetInitialState;
    case GAME_COLLECTIONS.CLUBE_DETETIVE:
      return clubeDetetivesGetInitialState;
    case GAME_COLLECTIONS.ESPIAO_ENTRE_NOS:
      return espiaoEntreNosGetInitialState;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepaticaGetInitialState;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIssoGetInitialState;
    default:
      throw new Error(`Collection '${collectionName}' initial state does not exist`);
  }
};

/**
 * Get the next phase delegator from game collection
 * @param collectionName
 * @returns
 */
export const getNextPhaseForCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_KEYS.ARTE_RUIM:
      return nextArteRuimPhase;
    case GAME_KEYS.CLUBE_DETETIVE:
      return nextClubeDetetivesPhase;
    case GAME_KEYS.ESPIAO_ENTRE_NOS:
      return nextEspiaoEntreNosPhase;
    case GAME_KEYS.ONDA_TELEPATICA:
      return nextOndaTelepaticaPhase;
    case GAME_KEYS.UE_SO_ISSO:
      return nextUeSoIssoPhase;
    default:
      throw new Error(`Collection '${collectionName}' phase delegator does not exist`);
  }
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
    players[playerKey][property] = playerKey === butThisOne ? value : value;
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
  extraPoints: number[]
): PlainObject => {
  const teams = {};
  const playerNames = shuffle(Object.keys(players));
  const playersPerTeam = Math.ceil(playerNames.length / numberOfTeams);
  const shuffledPlayerNames = shuffle(playerNames);

  let currentTeamIndex = 0;
  let currentTeamCount = 0;
  shuffledPlayerNames.forEach((playerName) => {
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
