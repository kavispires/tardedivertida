// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

export const handleSubmitIdentity = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  identityId: CardId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your new identity',
    shouldReady: true,
    change: {
      newIdentityId: identityId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitPrompt = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  questionId: CardId,
  customQuestion: string,
  customAnswer: string,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your question',
    change: {
      currentQuestionId: questionId,
      customQuestion: customQuestion ?? '',
      customAnswer: customAnswer ?? '',
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitAnswer = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  questionId: CardId,
  answer: boolean,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your answer',
    shouldReady: true,
    change: { [`identity.answers.${questionId}`]: answer },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitGuesses = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guesses: Dictionary<CardId>,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your guesses',
    shouldReady: true,
    change: {
      guesses,
    },
    nextPhaseFunction: getNextPhase,
  });
};
