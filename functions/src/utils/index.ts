import * as constants from './constants';
import { arteRuim } from '../engine/arte-ruim';

const { GAME_CODES, GAME_COLLECTIONS } = constants;

/**
 * Generates an unique game id starting with the gameCode character
 * @param gameCode a single capital letter
 * @param usedIds the list of used ids
 * @param length the length of the game id
 * @returns
 */
export const generateGameId = (gameCode: string, usedIds: string[] = [], length = 4): string => {
  if (!gameCode) throw Error('Missing game code');

  /**
   * Generate a game id
   * @param gameCode a single capital letter
   * @param length
   * @returns
   */
  function generateId(gameCode: string, length: number) {
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
export const getCollectionNameByGameCode = (gameCode: string): string | null => {
  switch (gameCode) {
    case GAME_CODES.A:
      return GAME_COLLECTIONS.ARTE_RUIM;
    default:
      return null;
  }
};

/**
 * Get collection name by extracting the first letter of a game id
 * @param {string} gameId
 */
export const getCollectionNameByGameId = (gameId: string): string | null => {
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
    default:
      throw new Error(`Collection '${collectionName}' does not exist`);
  }
};
