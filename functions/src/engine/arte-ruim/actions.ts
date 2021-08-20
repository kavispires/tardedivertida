// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextArteRuimPhase } from './index';

export const handleSubmitDrawing = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  drawing: string
) => {
  const actionText = 'submit your drawing';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].currentCard.drawing = drawing;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextArteRuimPhase(collectionName, gameId, players);
  }

  return true;
};

export const handleSubmitVoting = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  const actionText = 'submit your drawing';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const updatedPlayers = utils.readyPlayer(players, playerId);
  updatedPlayers[playerId].votes = votes;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextArteRuimPhase(collectionName, gameId, players);
  }

  return true;
};
