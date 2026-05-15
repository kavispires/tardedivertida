// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles player answer submission and optional game stop
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting answers
 * @param answers - Dictionary of answers by cell
 * @param stop - Optional flag to stop the game
 */
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

/**
 * Handles player evaluation submissions for other players' answers
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting evaluations
 * @param evaluations - Dictionary of evaluations by evaluation key
 */
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
