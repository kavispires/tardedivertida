// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';
import { FirebaseStateData } from './types';

export const handleSubmitAnswers = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  answers: StringDictionary,
  stop?: boolean
) => {
  await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your answers',
    shouldReady: true,
    change: { answers },
    nextPhaseFunction: getNextPhase,
  });

  if (stop) {
    await utils.firebase.updateState({
      gameName,
      gameId,
      playerId,
      actionText: 'stop the game',
      change: { stop: playerId },
    });
  }

  return true;
};

export const handleNextEvaluationGroup = async (gameName: GameName, gameId: GameId, playerId: PlayerId) => {
  const actionText = 'play a card';

  const { state } = await utils.firebase.getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  // If it's the last answer, go to the next phase
  if (state.answerGroups.length - 1 === state.answerGroupIndex) {
    return getNextPhase(gameName, gameId);
  }

  return await utils.firebase.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'stop the game',
    change: { answerGroupIndex: state.answerGroupIndex + 1 },
  });
};

export const handleSubmitRejectAnswers = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,

  evaluations: string[]
) => {
  const change = evaluations.reduce((acc: BooleanDictionary, evaluation) => {
    acc[`evaluations.${evaluation}`] = true;
    return acc;
  }, {});

  return await utils.firebase.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    shouldReady: false,
    change: { ...change },
  });
};
