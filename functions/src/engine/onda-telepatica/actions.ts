// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { getNextPhase } from '.';

/**
 * When psychic submits the round's clue
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param categoryId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  categoryId: string,
  clue: string
) => {
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit clue',
    change: {
      clue,
      categoryId,
    },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * When each player submit their round's guess
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param guess
 * @returns
 */
export const handleSubmitGuess = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  guess: number | boolean
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit guess',
    shouldReady: true,
    change: { guess },
    nextPhaseFunction: getNextPhase,
  });
};
