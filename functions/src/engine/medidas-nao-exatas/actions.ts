// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { Guess } from './types';

export const handleSubmitPool = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  poolIds: CardId[],
  secretWordId: CardId,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: Guess[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    change: { guesses },
    shouldReady: true,
    nextPhaseFunction: getNextPhase,
  });
};
