// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { nextOndaTelepaticaPhase } from '.';

/**
 * When psychic chooses the round's category
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param categoryId
 * @returns
 */
export const handleSubmitCategory = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  categoryId: string
) => {
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit category',
    change: {
      categoryId,
    },
    nextPhaseFunction: nextOndaTelepaticaPhase,
  });
};

/**
 * When psychic submits the round's clue
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param clue
 * @returns
 */
export const handleSubmitClue = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  clue: string
) => {
  return await firebaseUtils.updateStore({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit clue',
    change: {
      clue,
    },
    nextPhaseFunction: nextOndaTelepaticaPhase,
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
    nextPhaseFunction: nextOndaTelepaticaPhase,
  });
};
