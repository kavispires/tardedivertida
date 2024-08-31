// Types
import { ExtendedTextCard } from './types';
// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitMap = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  newMap: (ExtendedTextCard | null)[]
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your map',
    shouldReady: true,
    change: { newMap },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitPath = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  pathId: PlayerId,
  guess: CardId[],
  choseRandomly?: boolean
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    shouldReady: true,
    change: { [`guesses.${pathId}`]: guess, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
