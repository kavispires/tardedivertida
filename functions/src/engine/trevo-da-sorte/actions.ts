// Utils
import * as utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import { Guess, GuessPayload } from './types';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardsIds
 * @returns
 */
export const handleSubmitBadWords = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardsIds: CardId[]
) => {
  return await utils.firebase.updatePlayer({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clues
 * @returns
 */
export const handleSubmitClues = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clues: string[]
) => {
  const update = {
    'clover.leaves.A.clue': clues[0],
    'clover.leaves.B.clue': clues[1],
    'clover.leaves.C.clue': clues[2],
    'clover.leaves.D.clue': clues[3],
  };

  return await utils.firebase.updatePlayer({
    collectionName,
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
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: GuessPayload,
  activeCloverId: PlayerId
) => {
  const guess: Guess = {
    cloverId: activeCloverId,
    playerId,
    leaves: guesses,
    score: Object.values(guesses).reduce((acc: number, entry) => acc + entry.score, 0),
  };

  return await utils.firebase.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { [`guesses.${activeCloverId}`]: guess },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param changes
 * @returns
 */
export const handleUpdateCloverState = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  changes: any
) => {
  return await utils.firebase.updateState({
    collectionName,
    gameId,
    playerId,
    actionText: 'update clover state',
    change: { ...changes },
  });
};
