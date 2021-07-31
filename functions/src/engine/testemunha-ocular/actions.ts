// Interfaces
import { GameName, GameId } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import { nextTestemunhaOcularPhase } from './index';

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
    nextTestemunhaOcularPhase(collectionName, gameId, players, ...additionalPayload);
  } catch (error) {
    firebaseUtils.throwException(error, `Failed to ${actionText}`);
  }

  return true;
};
