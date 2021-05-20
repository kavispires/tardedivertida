import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as constants from './constants';
import {
  FirebaseContext,
  GameCode,
  GameId,
  PlainObject,
  Player,
  PlayerName,
  Players,
  Teams,
} from '../utils/interfaces';
import { arteRuim, getInitialState as arteRuimGetInitialState } from '../engine/arte-ruim';
import { ondaTelepatica, getInitialState as ondaTelepaticaGetInitialState } from '../engine/onda-telepatica';
import { ueSoIsso, getInitialState as ueSoIssoGetInitialState } from '../engine/ue-so-isso';
import { shuffle, getRandomUniqueItem } from './game-utils';

const { GAME_CODES, GAME_COLLECTIONS } = constants;

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
    case GAME_CODES.O:
      return GAME_COLLECTIONS.ONDA_TELEPATICA;
    case GAME_CODES.U:
      return GAME_COLLECTIONS.UE_SO_ISSO;
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
 * Get all methods from game collection
 * @param collectionName
 * @returns
 */
export const getGameMethodsByCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuim;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepatica;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIsso;
    default:
      throw new Error(`Collection '${collectionName}' does not exist`);
  }
};

/**
 * Get all methods from game collection
 * @param collectionName
 * @returns
 */
export const getInitialStateForCollection = (collectionName: string) => {
  switch (collectionName) {
    case GAME_COLLECTIONS.ARTE_RUIM:
      return arteRuimGetInitialState;
    case GAME_COLLECTIONS.ONDA_TELEPATICA:
      return ondaTelepaticaGetInitialState;
    case GAME_COLLECTIONS.UE_SO_ISSO:
      return ueSoIssoGetInitialState;
    default:
      throw new Error(`Collection '${collectionName}' does not exist`);
  }
};

/**
 * Creates new player object
 * @param name
 * @param avatarId the player's chosen avatar
 * @param players
 * @returns
 */
export const createPlayer = (name: PlayerName, avatarId: string, players: Players = {}): Player => {
  const playerList = Object.values(players);
  const usedAvatars = playerList.map((player) => player.avatarId);
  avatarId = usedAvatars.includes(avatarId)
    ? getRandomUniqueItem(constants.AVATAR_IDS, usedAvatars)
    : avatarId;

  return {
    name,
    avatarId,
    ready: false,
    score: 0,
    updatedAt: Date.now(),
  };
};

/**
 * Set given player as ready in the players object
 * @param players
 * @param playerName
 * @returns
 */
export const readyPlayer = (players: Players, playerName: PlayerName): Players => {
  players[playerName].ready = true;
  players[playerName].updatedAt = Date.now();
  return players;
};

/**
 * Set all players as ready
 * @param players
 * @param butThisOne
 * @returns
 */
export const readyPlayers = (players: Players, butThisOne = ''): Players => {
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
export const unReadyPlayers = (players: Players, butThisOne = ''): Players => {
  for (const playerKey in players) {
    players[playerKey].ready = playerKey === butThisOne ? true : false;
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
export const determineTeams = (players: Players, numberOfTeams: number): PlainObject => {
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

    const teamLetter = constants.LETTERS[currentTeamIndex];

    if (teams[teamLetter] === undefined) {
      teams[teamLetter] = {
        members: [],
        name: teamLetter,
        score: 0,
      };
    }
    teams[teamLetter].members.push(playerName);
    players[playerName].team = teamLetter;

    currentTeamCount += 1;
  });

  return teams;
};
