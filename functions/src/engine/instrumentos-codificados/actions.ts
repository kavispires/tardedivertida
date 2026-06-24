// Helpers
import { getStateReferences, updatePlayer } from '../../services/game-session';
import { getNextPhase } from './index';
import type { FirebaseStateData } from './types';
import { throwHttpsError } from '../../services/firebase-core';
import utils from '../../utils';

/**
 * Submits a hint for a target instrument
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the hint
 * @param hint - The hint text
 * @param targetId - The target instrument ID
 * @param position - The position of the hint
 */
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

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit hint',
    shouldReady: true,
    change: { currentHint },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's conclusions about instruments
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting conclusions
 * @param conclusions - Dictionary of conclusion data
 */
export const handleSubmitConclusions = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  conclusions: PlainObject,
) => {
  const actionText = 'submit conclusions';

  const { players } = await getStateReferences<FirebaseStateData>(gameName, gameId, actionText);

  const updatedConclusions = {
    ...players[playerId].conclusions,
    ...conclusions,
  };

  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText,
    shouldReady: true,
    change: { conclusions: updatedConclusions },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's code guess
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the code
 * @param code - The code guess string
 */
export const handleSubmitCode = async (gameName: string, gameId: UID, playerId: UID, code: string) => {
  const actionText = 'submit conclusions';

  const { sessionRef, state, players } = await getStateReferences<FirebaseStateData>(
    gameName,
    gameId,
    actionText,
  );

  utils.players.readyPlayer(players, playerId);

  players[playerId].codeGuess = code;

  try {
    await sessionRef.doc('state').update({ [`players.${playerId}`]: players[playerId] });
  } catch (error) {
    throwHttpsError(error, actionText);
  }

  // If all players are ready, trigger next phase
  if (utils.players.isEverybodyReady(players)) {
    return getNextPhase(gameName, gameId, state);
  }

  return true;
};
