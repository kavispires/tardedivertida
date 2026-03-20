// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitDrawing = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  drawing: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your drawing',
    shouldReady: true,
    change: { currentDrawing: drawing },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitEvaluation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  guesses: Dictionary<UID[]>,
  choseRandomly: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluation',
    shouldReady: true,
    change: { guesses, choseRandomly: Boolean(choseRandomly) },
    nextPhaseFunction: getNextPhase,
  });
};
