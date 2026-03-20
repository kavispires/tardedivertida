// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitPrompt = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  questionId: UID,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your question',
    change: { currentQuestionId: questionId },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitTarget = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  targetId: UID,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your target',
    change: { currentTargetId: targetId },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuess = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  characterId: UID,
) => {
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

export const handleSubmitAnswer = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  answer: boolean,
) => {
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
