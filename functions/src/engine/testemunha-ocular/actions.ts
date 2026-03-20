// Utils
import utils from '../../utils';
import { OUTCOME } from './constants';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';

export const handleSelectWitness = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  witnessId: UID,
) => {
  return await utils.firestore.updateState({
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

export const handleSelectQuestion = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  questionId: UID,
) => {
  return await utils.firestore.updateState({
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

export const handleGiveTestimony = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  testimony: boolean,
) => {
  return await utils.firestore.updateState({
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
 * Handles the elimination action in the game.
 *
 * @param gameName - The name of the game.
 * @param gameId - The unique identifier of the game.
 * @param actionText - The text describing the action.
 * @param additionalPayload - Additional data required for the action.
 * @returns A promise that resolves to the next phase of the game or true if no phase change is needed.
 *
 * The function performs the following steps:
 * 1. Retrieves the current game state and session reference.
 * 2. Determines if the game should proceed to the next phase based on the action and game state.
 * 3. Checks if the suspect is the perpetrator or an innocent person.
 * 4. Updates the game state with the eliminated suspect if they are innocent.
 * 5. Determines if the game is won or lost based on the number of eliminated suspects.
 * 6. Proceeds to the next phase if necessary, handling any errors that occur.
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
  const { sessionRef, state } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

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
      await utils.firestore.saveGame(sessionRef, {
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
      utils.firebase.throwException(error, `Failed to ${actionText}`);
    }
  }

  return true;
};

export const handleFinalElimination = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  suspectId: boolean,
) => {
  return await utils.firestore.updatePlayer({
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
