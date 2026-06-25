// Services
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from './index';

/**
 * Submits the player's urban planning proposal
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting the planning
 * @param planning - Dictionary of planning data
 */
export const handleSubmitPlanning = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  planning: Dictionary<string>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your planning',
    shouldReady: true,
    change: { planning },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's evaluations of other players' placements
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting evaluations
 * @param evaluations - Dictionary of evaluation data
 */
export const handleSubmitPlacements = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  evaluations: Dictionary<string>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your evaluations',
    shouldReady: true,
    change: { evaluations },
    nextPhaseFunction: getNextPhase,
  });
};
