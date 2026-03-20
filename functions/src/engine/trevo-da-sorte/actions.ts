// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import type { CloverLeaf, Guess, GuessPayload } from './types';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param cardsIds
 * @returns
 */
export const handleSubmitBadWords = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  cardsIds: UID[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit bad words',
    shouldReady: true,
    change: { badWordsIds: cardsIds },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param clues
 * @returns
 */
export const handleSubmitClues = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  clues: CloverLeaf[],
) => {
  const update = {
    'clover.leaves.A': clues[0],
    'clover.leaves.B': clues[1],
    'clover.leaves.C': clues[2],
    'clover.leaves.D': clues[3],
  };

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit clues',
    shouldReady: true,
    change: { ...update },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param guesses
 * @returns
 */
export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: GuessPayload,
  activeCloverId: UID,
) => {
  const guess: Guess = {
    cloverId: activeCloverId,
    playerId,
    leaves: guesses,
    score: Object.values(guesses).reduce((acc: number, entry) => acc + entry.score, 0),
  };

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { [`guesses.${activeCloverId}`]: guess },
    nextPhaseFunction: getNextPhase,
  });
};
