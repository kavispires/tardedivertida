// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitClue = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string,
  currentClueCoordinate: number
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    change: { clue, currentClueCoordinate },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: StringDictionary,
  choseRandomly: boolean
) => {
  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: { guesses, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
