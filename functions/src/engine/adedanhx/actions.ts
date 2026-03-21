// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitAnswers = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  answers: Dictionary<string>,
  stop?: boolean,
) => {
  if (stop) {
    await utils.firestore.updateState({
      gameName,
      gameId,
      playerId,
      actionText: 'stop the game',
      change: { stop: playerId },
    });
  }

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your answers',
    shouldReady: true,
    change: { answers },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitEvaluationsAnswers = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluations: Dictionary<boolean>,
) => {
  const change = Object.keys(evaluations).reduce((acc: Dictionary<boolean>, evaluationKey) => {
    acc[`evaluations.${evaluationKey}`] = evaluations[evaluationKey];
    return acc;
  }, {});

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    shouldReady: false,
    change: { ...change },
  });
};
