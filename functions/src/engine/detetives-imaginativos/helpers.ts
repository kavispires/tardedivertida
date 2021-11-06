// Constants
import { DETETIVES_IMAGINATIVOS_PHASES } from './constants';
// Interfaces
import { PlainObject, Player, PlayerId, Players, Round } from '../../utils/interfaces';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param roundsToEndGame
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const {
    RULES,
    SETUP,
    SECRET_CLUE,
    CARD_PLAY,
    DEFENSE,
    VOTING,
    REVEAL,
    GAME_OVER,
  } = DETETIVES_IMAGINATIVOS_PHASES;
  const order = [RULES, SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.current > 0 && round.current === round.total ? GAME_OVER : SECRET_CLUE;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return SECRET_CLUE;
};

/**
 * Determines the order for the current phase
 * @param leaderId
 * @param gameOrder
 * @param players
 * @param repeat
 * @returns
 */
export const determinePhaseOrder = (
  leaderId: PlayerId,
  gameOrder: PlayerId[],
  players: Players,
  repeat?: boolean
): PlayerId[] => {
  const result: PlayerId[] = [];
  const playerIds = Object.values(players);
  const tempGameOrder = [...gameOrder, ...gameOrder];
  const leaderIndex = tempGameOrder.indexOf(leaderId);

  for (let i = 0; i < playerIds.length; i++) {
    result.push(tempGameOrder[leaderIndex + i]);
  }

  return repeat ? [...result, ...result] : result;
};

/**
 * Count impostor votes
 * @param players
 * @param impostorId
 * @returns
 */
export const countImpostorVotes = (players: Players, impostorId: PlayerId): number =>
  Object.values(players).reduce((total: number, player: Player) => {
    if (player.vote === impostorId) {
      total += 1;
    }
    return total;
  }, 0);

/**
 *
 * @param players
 * @param impostorVotes
 * @param impostorId
 * @param leaderId
 * @returns
 */
export const calculateNewScores = (
  players: Players,
  impostorVotes: number,
  impostorId: PlayerId,
  leaderId: PlayerId
): PlainObject => {
  const relevantPlayers = [impostorId, leaderId];

  return Object.values(players).reduce((result, player) => {
    const currentScore = player.score;
    let addedScore = 0;
    // If detectives won
    if (impostorVotes > 1 && !relevantPlayers.includes(player.id)) {
      // If the player voted for the impostor
      if (player.vote === impostorId) {
        addedScore += 3;
      }
    }
    // If relevant players won
    if (impostorVotes <= 1) {
      if (impostorId === player.id) {
        addedScore += 5;
      }
      if (leaderId === player.id) {
        addedScore += 4;
      }
    }

    const newScore = currentScore + addedScore;
    result[player.id] = [currentScore, addedScore, newScore];
    // Update player as well
    player.score = newScore;
    return result;
  }, {});
};
