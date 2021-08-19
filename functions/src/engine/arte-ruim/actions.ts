// Interfaces
import { SubmitVotesPayload } from '../../utils/interfaces';
import { SubmitDrawingPayload } from './interfaces';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextArteRuimPhase } from './index';

export const submitDrawing = async (data: SubmitDrawingPayload) => {
  const { gameId, gameName: collectionName, playerId, drawing, cardId } = data;

  const actionText = 'submit your drawing';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(drawing, 'drawing', actionText);
  firebaseUtils.verifyPayload(cardId, 'cardId', actionText);

  // Get 'players' from given game session
  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].currentCard.drawing = drawing;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextArteRuimPhase(collectionName, gameId, players);
};

export const submitVoting = async (data: SubmitVotesPayload) => {
  const { gameId, gameName: collectionName, playerId, votes } = data;

  const actionText = 'submit your votes';
  firebaseUtils.verifyPayload(gameId, 'gameId', actionText);
  firebaseUtils.verifyPayload(collectionName, 'collectionName', actionText);
  firebaseUtils.verifyPayload(playerId, 'playerId', actionText);
  firebaseUtils.verifyPayload(votes, 'votes', actionText);

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  // Make player ready and attach drawing
  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].votes = votes;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  if (!utils.isEverybodyReady(updatedPlayers)) {
    return true;
  }

  // If all players are ready, trigger next phase
  return nextArteRuimPhase(collectionName, gameId, players);
};
