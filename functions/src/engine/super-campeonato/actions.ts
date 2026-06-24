// Utils
import { updatePlayer } from '../../services/game-session';
// Internal
import { getNextPhase } from '.';

/**
 * Submits the player's challenge choice between two options
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID choosing a challenge
 * @param challengeId - The selected challenge ID
 */
export const handleSubmitChallenge = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  challengeId: UID,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your challenge',
    shouldReady: true,
    change: { challengeId },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's contender choice for the round
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID choosing a contender
 * @param contendersIds - The selected contender IDs
 */
export const handleSubmitContenders = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  contendersIds: UID[],
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your contender(s)',
    shouldReady: true,
    change: { selectedContenderIds: contendersIds },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's bets for quarter, semi, and final rounds
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting bets
 * @param quarter - The quarter-final bet
 * @param semi - The semi-final bet
 * @param final - The final bet
 */
export const handleSubmitBets = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  quarter: string,
  semi: string,
  final: string,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your contender(s)',
    shouldReady: true,
    change: { 'bets.quarter': quarter, 'bets.semi': semi, 'bets.final': final },
    nextPhaseFunction: getNextPhase,
  });
};

/**
 * Submits the player's votes for contenders in the tier
 * @param gameName - The name of the game
 * @param gameId - The game session ID
 * @param playerId - The player ID submitting votes
 * @param votes - Dictionary mapping contender IDs to vote counts
 */
export const handleSubmitVotes = async (
  gameName: string,
  gameId: UID,
  playerId: UID,
  votes: Dictionary<number>,
) => {
  return await updatePlayer({
    gameName,
    gameId,
    playerId,
    actionText: 'submit your votes',
    shouldReady: true,
    change: { votes },
    nextPhaseFunction: getNextPhase,
  });
};
