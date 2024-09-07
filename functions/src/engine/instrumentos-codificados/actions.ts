// Helpers
import utils from '../../utils';
import { getNextPhase } from './index';
import { FirebaseStateData } from './types';

export const handleSubmitHint = async (
  gameName: GameName,
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
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  conclusions: PlainObject
) => {
  const actionText = 'submit conclusions';

  const { players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText
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

export const handleSubmitCode = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  code: string
) => {
  const actionText = 'submit conclusions';

  const { sessionRef, state, players } = await utils.firestore.getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText
  );

  const updatedPlayers = utils.players.readyPlayer(players, playerId);

  updatedPlayers[playerId].codeGuess = code;

  try {
    await sessionRef.doc('state').update({ [`players.${playerId}`]: updatedPlayers[playerId] });
  } catch (error) {
    utils.firebase.throwExceptionV2(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.players.isEverybodyReady(updatedPlayers)) {
    return getNextPhase(gameName, gameId, state);
  }

  return true;
};
