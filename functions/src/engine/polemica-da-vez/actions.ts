// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextPolemicaDaVezPhase } from '.';

/**
 * When active player chooses the round's topic
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param questionId
 * @returns
 */
export const handleSubmitTopic = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  topicId: string,
  customTopic?: string
) => {
  const actionText = 'submit the question';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  try {
    await sessionRef.doc('store').update({ topicId, customTopic: customTopic ?? null });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  return nextPolemicaDaVezPhase(collectionName, gameId, players);
};

/**
 * When each player submit their round's reaction and likes guess
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param answers
 * @returns
 */
export const handleSubmitReaction = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  reaction: boolean,
  likesGuess: number
) => {
  const actionText = 'submit the answers';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].reaction = reaction;
  updatedPlayers[playerId].likesGuess = likesGuess;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextPolemicaDaVezPhase(collectionName, gameId, players);
  }

  return true;
};
