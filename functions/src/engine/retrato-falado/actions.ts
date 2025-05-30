// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Update store with the current orientation
 * @param gameName
 * @param gameId
 * @param playerId
 * @param orientation
 * @returns
 */
export const handleSubmitOrientation = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  orientation: string,
) => {
  return await utils.firestore.updateStore({
    gameName,
    gameId,
    playerId,
    actionText: 'submit orientation',
    change: { currentOrientation: orientation },
  });
};

/**
 * Update player with their sketch
 * @param gameName
 * @param gameId
 * @param playerId
 * @param sketch
 * @returns
 */
export const handleSubmitSketch = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  sketch: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit sketch',
    shouldReady: true,
    change: { sketch },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Update player with their vote
 * @param gameName
 * @param gameId
 * @param playerId
 * @param vote
 * @returns
 */
export const handleSubmitVote = async (
  gameName: GameName,
  gameId: GameId,
  playerId: PlayerId,
  vote: PlayerId,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit vote',
    shouldReady: true,
    change: { vote },
    nextPhaseFunction: getNextPhase,
  });
};
