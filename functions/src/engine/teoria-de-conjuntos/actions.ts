import { getNextPhase } from '.';
// Types
import type { DiagramArea, FirebaseStateData, Guess } from './types';
// Constants
import { OUTCOME } from './constants';
// Services
import { getStateReferences, updateState } from '../../services/game-session';

/**
 * Submits the selected judge player ID for the game
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the judge selection
 * @param judgeId - The ID of the selected judge player
 */
export const handleSubmitJudge = async (gameName: string, gameId: UID, playerId: UID, judgeId: UID) => {
  return await updateState({
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

/**
 * Submits an item placement on the Venn diagram
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID placing the item
 * @param itemId - The item ID being placed
 * @param position - The position/area on the diagram
 */
export const handleSubmitItemDiagram = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  position: string,
) => {
  const currentGuess: Guess = {
    itemId,
    playerId,
    suggestedArea: position,
    correctArea: null,
    outcome: OUTCOME.PENDING,
  };
  return await updateState({
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

/**
 * Submits the judge's evaluation of an item placement
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The judge player ID submitting evaluation
 * @param evaluation - The evaluation string (correct area)
 */
export const handleSubmitEvaluation = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluation: string,
) => {
  return await updateState({
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

/**
 * Fixes a previously submitted evaluation by moving an item to a new area
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The judge player ID fixing the evaluation
 * @param itemId - The item ID to move
 * @param currentArea - The current area where the item is located
 * @param newEvaluation - The new correct area for the item
 */
export const handleSubmitEvaluationFix = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  itemId: UID,
  currentArea: string,
  newEvaluation: string,
) => {
  const actionText = 'fix evaluation';

  const { state } = await getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  const diagrams: Dictionary<DiagramArea> = state.diagrams;
  // Remove thing from diagram
  diagrams[currentArea].itemsIds = diagrams[currentArea].itemsIds.filter((id) => id !== itemId);

  // Re-add thing to diagram
  diagrams[newEvaluation].itemsIds.push(itemId);

  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText,
    change: {
      diagrams: diagrams,
    },
  });
};
