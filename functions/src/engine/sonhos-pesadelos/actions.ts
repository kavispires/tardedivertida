// Interfaces
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/interfaces';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { nextSonhosPesadelosPhase } from './index';

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param dreams
 * @returns
 */
export const handleSubmitDreams = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  dreams: PlainObject
) => {
  const actionText = 'submit your drawing';

  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};

  const newDreams = {};
  Object.keys(dreams).forEach((cardId) => {
    if (newDreams[cardId] === undefined) {
      newDreams[cardId] = [...(players[playerId]?.dreams?.[cardId] ?? [])];
    }
    newDreams[cardId].push(dreams[cardId]);
  });

  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit dreams',
    shouldReady: true,
    change: {
      dreams: newDreams,
    },
    nextPhaseFunction: nextSonhosPesadelosPhase,
  });
};

/**
 *
 * @param collectionName
 * @param gameId
 * @param playerId
 * @param votes
 * @returns
 */
export const handleSubmitVoting = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  votes: PlainObject
) => {
  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: nextSonhosPesadelosPhase,
  });
};
