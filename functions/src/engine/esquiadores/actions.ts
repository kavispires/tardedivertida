// Helpers
import utils from '../../utils';
// Internal functions
import { getNextPhase } from './index';

/**
 * Handles submission of player choices
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting choices
 * @param choices - Array of choice strings
 */
export const handleSubmitChoices = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  choices: string[],
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your clue',
    shouldReady: true,
    change: { choices },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Handles bet submissions
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting bets
 * @param bets - Dictionary of bets by key
 * @param betType - The type of bet being placed
 */
export const handleSubmitBets = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  bets: Dictionary<number>,
  betType: string,
) => {
  return await utils.firestore.updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your bets',
    shouldReady: true,
    change: { [betType]: bets },
    nextPhaseFunction: getNextPhase,
  });
};
