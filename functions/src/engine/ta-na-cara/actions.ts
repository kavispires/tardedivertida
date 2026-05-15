// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Submits the selected question prompt for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the prompt
 * @param questionId - The selected question ID
 */
export const handleSubmitPrompt = async (gameName: string, gameId: UID, playerId: UID, questionId: UID) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your question',
    change: { currentQuestionId: questionId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the selected target character for questioning
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the target
 * @param targetId - The selected target character ID
 */
export const handleSubmitTarget = async (gameName: string, gameId: UID, playerId: UID, targetId: UID) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    change: { currentTargetId: targetId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's character guess
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the guess
 * @param characterId - The guessed character ID
 */
export const handleSubmitGuess = async (gameName: string, gameId: UID, playerId: UID, characterId: UID) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guess',
    shouldReady: true,
    change: {
      guess: characterId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's answer to a question about their character
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the answer
 * @param answer - The answer (true/false)
 */
export const handleSubmitAnswer = async (gameName: string, gameId: UID, playerId: UID, answer: boolean) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your answer',
    shouldReady: true,
    change: { currentAnswer: answer },
    nextPhaseFunction: getNextPhase,
  });
};
