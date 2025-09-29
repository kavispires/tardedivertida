// Utils
import utils from '../../utils';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';

/**
 * Handles an extra action within the game by saving the card to the store and transitioning to the next phase.
 *
 * @param gameName - The name of the game.
 * @param gameId - The unique identifier of the game.
 * @param actionText - A description of the action being performed.
 * @param additionalPayload - Any additional data required for the action.
 * @returns A promise that resolves to the next phase of the game or throws an exception if the action fails.
 */
export const handleExtraAction = async (
  gameName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: PlainObject,
) => {
  // Save card to store
  try {
    const { state } = await utils.firestore.getStateReferences<FirebaseStateData>(
      gameName,
      gameId,
      actionText,
    );

    return getNextPhase(gameName, gameId, state, additionalPayload);
  } catch (error) {
    utils.firebase.throwException(error, `Failed to ${actionText}`);
  }

  return true;
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
  gameName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: PlainObject,
) => {
  const { sessionRef, state } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  let shouldGoToNextPhase = false;
  let lose = false;
  let win = false;

  // If pass and at least one
  if (additionalPayload.pass && state?.eliminatedSuspects?.length) {
    shouldGoToNextPhase = true;
  }

  const suspectId = additionalPayload?.suspectId;
  // Check if suspect is innocent
  if (suspectId) {
    if (suspectId === state.perpetratorId) {
      shouldGoToNextPhase = true;
      lose = true;
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
      const suspectsIds: CardId[] = state.suspectsIds ?? [];
      if (
        suspectsIds &&
        suspectsIds.length - (state.previouslyEliminatedSuspects.length + eliminatedSuspects.length) === 1
      ) {
        shouldGoToNextPhase = true;
        win = true;
      }
    }
  }

  // In case of a pass or win (found all) or a lose (clicked on perpetrator)
  if (shouldGoToNextPhase) {
    try {
      return getNextPhase(gameName, gameId, state, { lose, win });
    } catch (error) {
      utils.firebase.throwException(error, `Failed to ${actionText}`);
    }
  }

  return true;
};
