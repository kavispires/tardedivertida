// Helpers
import utils from '../../utils';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';

export const handleSubmitHint = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  hint: string,
  targetId: UID,
  position: number,
) => {
  const currentHint = {
    targetId,
    hint,
    position,
  };

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit hint',
    shouldReady: true,
    change: { currentHint },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitConclusions = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  conclusions: PlainObject,
) => {
  const actionText = 'submit conclusions';

  const { players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  const updatedConclusions = {
    ...players[playerId].conclusions,
    ...conclusions,
  };

  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: { conclusions: updatedConclusions },
    nextPhaseFunction: getNextPhase,
  });
};

export const handleSubmitCode = async (gameName: string, gameId: UID, playerId: UID, code: string) => {
  const actionText = 'submit conclusions';

  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  utils.players.readyPlayer(players, playerId);

  players[playerId].codeGuess = code;

  try {
    await sessionRef.doc('state').update({ [`players.${playerId}`]: players[playerId] });
  } catch (error) {
    utils.firebase.throwException(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.players.isEverybodyReady(players)) {
    return getNextPhase(gameName, gameId, state);
  }

  return true;
};
