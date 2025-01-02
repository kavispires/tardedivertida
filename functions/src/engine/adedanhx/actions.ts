// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';

export const handleSubmitAnswers = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  answers: StringDictionary,
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

export const handleNextEvaluationGroup = async (gameName: GameName, gameId: GameId, playerId: PlayerId) => {
  const actionText = 'play a card';

  const { state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  // If it's the last answer, go to the next phase
  if (state.answersGroups.length - 1 === state.answersGroupIndex) {
    return getNextPhase(gameName, gameId);
  }

  // Unready everybody
  utils.players.unReadyPlayers(players);

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'stop the game',
    change: { answersGroupIndex: state.answersGroupIndex + 1, players },
  });
};

export const handleSubmitRejectAnswers = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluations: BooleanDictionary,
) => {
  const change = Object.keys(evaluations).reduce((acc: BooleanDictionary, evaluationKey) => {
    acc[`evaluations.${evaluationKey}`] = evaluations[evaluationKey];
    return acc;
  }, {});

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    shouldReady: true,
    change: { ...change },
  });
};
