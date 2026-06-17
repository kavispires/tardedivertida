// Constants
import utils from '../../utils';
import { DETETIVES_IMAGINATIVOS_PHASES } from './constants';
import type { FirebaseStoreData } from './types';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (
  currentPhase: (typeof DETETIVES_IMAGINATIVOS_PHASES)[keyof typeof DETETIVES_IMAGINATIVOS_PHASES],
  round: Round,
): string => {
  const { SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER } = DETETIVES_IMAGINATIVOS_PHASES;
  const order = [SETUP, SECRET_CLUE, CARD_PLAY, DEFENSE, VOTING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : SECRET_CLUE;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Count impostor votes and assign achievements accordingly
 * @param players - The collection of players in the game
 * @param impostorId - The ID of the impostor player
 * @param store - The Firebase store data for tracking achievements
 */
export const countImpostorVotes = (players: Players, impostorId: UID, store: FirebaseStoreData): number =>
  utils.players.getListOfPlayers(players).reduce((total: number, player: Player) => {
    if (!player.vote) {
      return total;
    }
    // Achievement: Defense time
    increaseAchievement(store.achievements, player.id, 'defenseTime', player.defenseTime || 0);

    if (player.vote === impostorId) {
      // Achievement: 'Vote for the Impostor'
      increaseAchievement(store.achievements, player.id, 'votedForImpostor', 1);
      return total + 1;
    }

    increaseAchievement(store.achievements, player.id, 'votedForInnocent', 1);
    increaseAchievement(store.achievements, player.vote, 'receivedVotes', 1);

    return total;
  }, 0);

/**
 * Calculates player rankings based on voting results and roles
 * @param players - The collection of players in the game
 * @param impostorVotes - The number of votes the impostor received
 * @param impostorId - The ID of the impostor player
 * @param leaderId - The ID of the leader player
 */
export const calculateRanking = (
  players: Players,
  impostorVotes: number,
  impostorId: UID,
  leaderId: UID,
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
