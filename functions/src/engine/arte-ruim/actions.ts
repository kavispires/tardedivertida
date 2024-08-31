// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitDrawing = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  drawing: string
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your drawing',
    shouldReady: true,
    change: { 'currentCard.drawing': drawing },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitVoting = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: StringDictionary,
  choseRandomly: boolean
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your votes',
    shouldReady: true,
    change: { votes, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
