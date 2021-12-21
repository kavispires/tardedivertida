// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/types';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    change: { clue },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: PlainObject
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses },
    nextPhaseFunction: getNextPhase,
  });
};
