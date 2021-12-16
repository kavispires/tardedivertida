// Interfaces
import { GameName, GameId } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import { getNextPhase } from './index';
import { SUSPECT_COUNT } from './constants';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param additionalPayload
 * @returns
 */
export const handleExtraAction = async (
  collectionName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: any
) => {
  // Save card to store
  try {
    const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
    const players = playersDoc.data() ?? {};
    return getNextPhase(collectionName, gameId, players, additionalPayload);
  } catch (error) {
    firebaseUtils.throwException(error, `Failed to ${actionText}`);
  }

  return true;
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param actionText
 * @param additionalPayload
 * @returns
 */
export const handleElimination = async (
  collectionName: GameName,
  gameId: GameId,
  actionText: string,
  additionalPayload: any
) => {
  // Get state
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const state = stateDoc.data() ?? {};

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
      const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
      const eliminatedSuspects = state?.eliminatedSuspects || [];
      eliminatedSuspects.push(suspectId);
      await firebaseUtils.saveGame(sessionRef, {
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
      const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
      const players = playersDoc.data() ?? {};
      return getNextPhase(collectionName, gameId, players, { lose, win });
    } catch (error) {
      firebaseUtils.throwException(error, `Failed to ${actionText}`);
    }
  }

  return true;
};
