// Utils
import { getStateReferences, updatePlayer, updateState, saveGame } from '../../services/game-session';
import { OUTCOME } from './constants';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';
import { throwHttpsError } from '../../services/firebase-core';

/**
 * Selects the witness player for questioning
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID selecting the witness
 * @param witnessId - The selected witness player ID
 */
export const handleSelectWitness = async (gameName: string, gameId: UID, playerId: UID, witnessId: UID) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'select witness',
    change: {
      witnessId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Selects the question to ask the witness
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID selecting the question
 * @param questionId - The selected question ID
 */
export const handleSelectQuestion = async (gameName: string, gameId: UID, playerId: UID, questionId: UID) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'select question',
    change: {
      questionId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the witness's testimony answer
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The witness player ID giving testimony
 * @param testimony - The testimony answer (true/false)
 */
export const handleGiveTestimony = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  testimony: boolean,
) => {
  return await updateState({
    gameName,
    gameId,
    playerId,
    actionText: 'give testimony',
    change: {
      testimony,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles the elimination action to remove a suspect or pass
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param actionText - The text describing the action
 * @param additionalPayload - Object containing pass flag or suspect ID
 */
export const handleElimination = async (
  gameName: string,
  gameId: UID,
  actionText: string,
  additionalPayload: {
    pass?: boolean;
    suspectId?: UID;
  },
) => {
  const { sessionRef, state } = await getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  let shouldGoToNextPhase = false;
  state.outcome = OUTCOME.CONTINUE;

  // If pass and at least one
  if (additionalPayload.pass && state?.eliminatedSuspects?.length) {
    shouldGoToNextPhase = true;
  }

  const suspectId = additionalPayload?.suspectId;
  // Check if suspect is innocent
  if (suspectId) {
    if (suspectId === state.perpetratorId) {
      shouldGoToNextPhase = true;
      state.outcome = OUTCOME.LOSE;
    } else {
      const eliminatedSuspects = state?.eliminatedSuspects || [];
      eliminatedSuspects.push(suspectId);
      await saveGame(sessionRef, {
        update: {
          state: {
            eliminatedSuspects,
            status: {
              ...state.status,
              released: state.status.released + 1,
            },
          },
        },
      });

      // If it was actually the final innocent person
      const suspectsIds: UID[] = state.suspectsIds ?? [];
      if (
        suspectsIds &&
        suspectsIds.length - (state.previouslyEliminatedSuspects.length + eliminatedSuspects.length) === 1
      ) {
        shouldGoToNextPhase = true;
        state.outcome = OUTCOME.WIN;
      }

      if (
        suspectsIds &&
        suspectsIds.length - (state.previouslyEliminatedSuspects.length + eliminatedSuspects.length) === 2
      ) {
        state.outcome = OUTCOME.FINAL_SHOWDOWN;
        shouldGoToNextPhase = true;
      }
    }
  }
  // In case of a pass or win (found all) or a lose (clicked on perpetrator)
  if (shouldGoToNextPhase) {
    try {
      return getNextPhase(gameName, gameId, state);
    } catch (error) {
      throwHttpsError(error, `Failed to ${actionText}`);
    }
  }

  return true;
};

/**
 * Submits the player's final elimination guess for the perpetrator
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID making the final guess
 * @param suspectId - The suspected perpetrator ID (boolean type in signature)
 */
export const handleFinalElimination = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  suspectId: boolean,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'declare the criminal',
    shouldReady: true,
    change: {
      suspectId,
    },
    nextPhaseFunction: getNextPhase,
  });
};
