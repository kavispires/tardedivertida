// Types
import { GameId, PlayerId, GameName, PlainObject } from '../../utils/types';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import { getNextPhase } from './index';

export const handleSubmitHint = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  hint: string,
  targetId: PlayerId,
  position: number
) => {
  const currentHint = {
    targetId,
    hint,
    position,
  };

  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText: 'submit hint',
    shouldReady: true,
    change: { currentHint },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitConclusions = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  conclusions: PlainObject
) => {
  const actionText = 'submit conclusions';

  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);
  const players = playersDoc.data() ?? {};

  const updatedConclusions = {
    ...players[playerId].conclusions,
    ...conclusions,
  };

  return await firebaseUtils.updatePlayer({
    collectionName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: { conclusions: updatedConclusions },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitCode = async (
  collectionName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  code: string
) => {
  const actionText = 'submit conclusions';

  const sessionRef = firebaseUtils.getSessionRef(collectionName, gameId);
  const playersDoc = await firebaseUtils.getSessionDoc(collectionName, gameId, 'players', actionText);

  const players = playersDoc.data() ?? {};
  const updatedPlayers = utils.readyPlayer(players, playerId);

  updatedPlayers[playerId].codeGuess = code;

  try {
    await sessionRef.doc('players').update({ [playerId]: updatedPlayers[playerId] });
  } catch (error) {
    firebaseUtils.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.isEverybodyReady(updatedPlayers)) {
    return getNextPhase(collectionName, gameId, players);
  }

  return true;
};
