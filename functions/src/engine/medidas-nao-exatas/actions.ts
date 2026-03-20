// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Guess } from './types';

export const handleSubmitPool = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  poolIds: UID[],
  secretWordId: UID,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the pool',
    change: { poolIds, secretWordId },
  });
};

export const handleSubmitMetrics = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  metrics: Record<string, number>,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit the metrics',
    change: { metrics },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Guess[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    change: { guesses },
    shouldReady: guesses.length > 1, // If more than one guess, player is ready
    nextPhaseFunction: getNextPhase,
  });
};
