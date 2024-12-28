// Constants
import utils from '../../utils';
import { DETETIVES_IMAGINATIVOS_PHASES } from './constants';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER } =
    DETETIVES_IMAGINATIVOS_PHASES;
  const order = [RULES, SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : SECRET_CLUE;
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
  repeat?: boolean,
): PlayerId[] => {
  const result: PlayerId[] = [];
  const playerIds = utils.players.getListOfPlayers(players);
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
  utils.players.getListOfPlayers(players).reduce((total: number, player: Player) => {
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
export const calculateRanking = (
  players: Players,
  impostorVotes: number,
  impostorId: PlayerId,
  leaderId: PlayerId,
): PlainObject => {
  // Gained points: [player vote, being impostor/leader]
  const scores = new utils.players.Scores(players, [0, 0]);

  const relevantPlayers = [impostorId, leaderId];

  utils.players.getListOfPlayers(players).forEach((player) => {
    // If detectives won
    if (impostorVotes > 1 && !relevantPlayers.includes(player.id)) {
      // If the player voted for the impostor
      if (player.vote === impostorId) {
        scores.add(player.id, 3, 0);
      }
    }
    // If relevant players won
    if (impostorVotes <= 1) {
      if (impostorId === player.id) {
        scores.add(player.id, 5, 1);
      }
      if (leaderId === player.id) {
        scores.add(player.id, 4, 1);
      }
    }
  });

  return scores.rank(players);
};
