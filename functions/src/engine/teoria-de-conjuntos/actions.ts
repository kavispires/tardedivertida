// Utils
import utils from '../../utils';
// Internal
import { getNextPhase } from '.';
import type { ItemId } from '../comunicacao-alienigena/types';
import type { DiagramArea, FirebaseStateData, Guess } from './types';
import { OUTCOME } from './constants';

/**
 * Submits the selected judge player ID for a given game.
 * @function
 * @async
 * @param gameName - The name of the game.
 * @param gameId - The ID of the game.
 * @param playerId - The ID of the player who is submitting the judge ID.
 * @param judgeId - The ID of the selected judge player.
 * @returns - A promise that resolves after the update is complete.
 */
export const handleSubmitJudge = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  judgeId: PlayerId,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit judge player id',
    change: {
      judgeId,
      [`players.${judgeId}.role`]: 'judge',
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitItemDiagram = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  itemId: ItemId,
  position: string,
) => {
  const currentGuess: Guess = {
    itemId,
    playerId,
    suggestedArea: position,
    correctArea: null,
    outcome: OUTCOME.PENDING,
  };
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit item placement',
    change: {
      currentGuess,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitEvaluation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  evaluation: string,
) => {
  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'submit evaluation',
    change: {
      'currentGuess.correctArea': evaluation,
    },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitEvaluationFix = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  itemId: ItemId,
  currentArea: string,
  newEvaluation: string,
) => {
  const actionText = 'fix evaluation';

  const { state } = await utils.firestore.getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  const diagrams: Dictionary<DiagramArea> = state.diagrams;
  // Remove thing from diagram
  diagrams[currentArea].itemsIds = diagrams[currentArea].itemsIds.filter((id) => id !== itemId);

  // Re-add thing to diagram
  diagrams[newEvaluation].itemsIds.push(itemId);

  return await utils.firestore.updateState({
    gameName,
    gameId,
    playerId,
    actionText,
    change: {
      diagrams: diagrams,
    },
  });
};
