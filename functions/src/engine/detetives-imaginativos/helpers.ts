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
 * @param leader
 * @param gameOrder
 * @param players
 * @param repeat
 * @returns
 */
export const determinePhaseOrder = (
  leader: PlayerId,
  gameOrder: PlayerId[],
  players: Players,
  repeat?: boolean
): PlayerId[] => {
  const result: PlayerId[] = [];
  const playerIds = Object.values(players);
  const tempGameOrder = [...gameOrder, ...gameOrder];
  const leaderIndex = tempGameOrder.indexOf(leader);

  for (let i = 0; i < playerIds.length; i++) {
    result.push(tempGameOrder[leaderIndex + i]);
  }

  return repeat ? [...result, ...result] : result;
};

/**
 * Count impostor votes
 * @param players
 * @param impostor
 * @returns
 */
export const countImpostorVotes = (players: Players, impostor: PlayerId): number =>
  Object.values(players).reduce((total: number, player: Player) => {
    if (player.vote === impostor) {
      total += 1;
    }

    return total;
  }, 0);

/**
 *
 * @param players
 * @param impostorVotes
 * @param impostor
 * @param leader
 * @returns
 */
export const calculateNewScores = (
  players: Players,
  impostorVotes: number,
  impostor: PlayerId,
  leader: PlayerId
): PlainObject => {
  const relevantPlayers = [impostor, leader];

  return Object.values(players).reduce((result, player) => {
    const currentScore = player.score;
    let addedScore = 0;
    // If detectives won
    if (impostorVotes > 1 && !relevantPlayers.includes(player.id)) {
      // If the player voted for the impostor
      if (player.vote === impostor) {
        addedScore += 3;
      }
    }
    // If relevant players won
    if (impostorVotes <= 1) {
      if (impostor === player.id) {
        addedScore += 5;
      }
      if (leader === player.id) {
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
