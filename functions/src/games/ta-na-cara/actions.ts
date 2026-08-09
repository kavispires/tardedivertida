// Types
import type { AnswerValue } from './types';
// Services
import { updatePlayer, updateState } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the selected question prompt for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the prompt
 * @param question - The custom question text entered by the player
 * @param questionId - The selected question ID
 */
export const handleSubmitPrompt = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  questionId?: UID,
  question?: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your question',
    shouldReady: true,
    change: { currentQuestionId: questionId ?? null, currentQuestion: question ?? null },
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
export const handleSubmitAnswer = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  answer: AnswerValue,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your answer',
    shouldReady: true,
    change: { currentAnswer: answer },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's trigger to move to the guessing phase
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the guess
 */
export const handleTriggerGuessing = async (gameName: string, gameId: UID, playerId: UID) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'trigger guessing phase',
    change: {
      triggerGuessing: true,
      guessingTriggeredBy: playerId,
    },
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
  return await updatePlayer({
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
