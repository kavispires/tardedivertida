// Interfaces
import { GameId, PlayerId, GameName } from '../../utils/interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import * as playerHandUtils from '../../utils/player-hand-utils';
import { nextContadoresHistoriasPhase } from './index';
import { HAND_LIMIT } from './constants';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handleSubmitStory = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  story: string,
  cardId: string
) => {
  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', 'submit story');

  const players = playersDoc.data() ?? {};

  // Remove card from storytellers's hand and add new card
  try {
    playerHandUtils.discardPlayerCard(players, cardId, playerId, HAND_LIMIT);
    players[playerId].cardId = cardId;
    await sessionRef.doc('players').update({ [playerId]: players[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update player with new card');
  }

  // Submit clue
  try {
    await sessionRef.doc('store').update({ story, solutionCardId: cardId });
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to save story to store');
  }

  // If all players are ready, trigger next phase
  return nextContadoresHistoriasPhase(collectionName, gameId, players);
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param cardId
 * @returns
 */
export const handlePlayCard = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  cardId: string
) => {
  const actionText = 'play a card';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const stateDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'state', actionText);
  const players = playersDoc.data() ?? {};
  const state = stateDoc.data() ?? {};

  if (state.storyteller === playerId) {
    firebaseUtils.throwException('You are the storyteller!', 'Failed to play card.');
  }

  let updatedPlayers = utils.readyPlayer(players, playerId);

  // Remove card from player's hand and add new card
  try {
    updatedPlayers = playerHandUtils.discardPlayerCard(updatedPlayers, cardId, playerId, HAND_LIMIT);
    updatedPlayers[playerId].cardId = cardId;
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, 'Failed to update player with new card');
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextContadoresHistoriasPhase(collectionName, gameId, updatedPlayers);

  return true;
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId
) => {
  const actionText = 'vote';
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach vote
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].vote = vote;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextContadoresHistoriasPhase(collectionName, gameId, updatedPlayers);
};
