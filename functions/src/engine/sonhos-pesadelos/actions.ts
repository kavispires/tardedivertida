// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { nextSonhosPesadelosPhase } from './index';

export const handleSubmitDreams = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  dreams: PlainObject
) => {
  const actionText = 'submit your drawing';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);
  Object.keys(dreams).forEach((cardId) => {
    updatedPlayers[playerId].dreams[cardId].push(dreams[cardId]);
  });

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return nextSonhosPesadelosPhase(collectionName, gameId, players);
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
    return nextSonhosPesadelosPhase(collectionName, gameId, players);
  }

  return true;
};
