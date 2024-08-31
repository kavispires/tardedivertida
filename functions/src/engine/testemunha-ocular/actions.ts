// Utils
import utils from '../../utils';
import { getNextPhase } from './index';
import { SUSPECT_COUNT } from './constants';
import { FirebaseStateData } from './types';

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param additionalPayload
 * @returns
 */
export const handleExtraAction = async (
  gameName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: any
) => {
  // Save card to store
  try {
    const { state } = await utils.firestore.getStateReferences<FirebaseStateData>(
      gameName,
      gameId,
      actionText
    );

    return getNextPhase(gameName, gameId, state, additionalPayload);
  } catch (error) {
    utils.firestore.throwException(error, `Failed to ${actionText}`);
  }

  return true;
};

/**
 *
 * @param gameName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param additionalPayload
 * @returns
 */
export const handleElimination = async (
  gameName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: any
) => {
  const { sessionRef, state } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText
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
    if (suspectId === state.perpetrator.id) {
      shouldGoToNextPhase = true;
      lose = true;
    } else {
      const eliminatedSuspects = state?.eliminatedSuspects || [];
      eliminatedSuspects.push(suspectId);
      await utils.firestore.saveGame(sessionRef, {
        update: {
          state: {
            eliminatedSuspects,
          },
        },
      });

      // If it was actually the final innocent person
      if (SUSPECT_COUNT - (state.previouslyEliminatedSuspects.length + eliminatedSuspects.length) === 1) {
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
      utils.firestore.throwException(error, `Failed to ${actionText}`);
    }
  }

  return true;
};
