// Constants
import { RETRATO_FALADO_PHASES } from './constants';
// Types
import type { AllMonsters, MonsterSketch } from './types';
// Helpers
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER } = RETRATO_FALADO_PHASES;
  const order = [RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : COMPOSITE_SKETCH;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return COMPOSITE_SKETCH;
};

/**
 * Build the deck to be used on the game
 * @param allMonsters
 * @param playerCount
 * @returns
 */
export const buildDeck = (allMonsters: AllMonsters, playerCount: number) => {
  return utils.game.getRandomItems(Object.values(allMonsters), playerCount);
};

/**
 * Builds the sketches array
 * @param players
 * @param currentMonster
 * @returns
 */
export const gatherSketches = (
  players: Players,
  currentMonster: MonsterCard,
  witnessId: PlayerId
): MonsterSketch[] => {
  const gathering = Object.values(players).reduce((acc: MonsterSketch[], player: Player) => {
    if (player.id !== witnessId) {
      acc.push({
        playerId: player.id,
        sketch: player.sketch,
        id: currentMonster.id,
        orientation: currentMonster.orientation,
      });
    }
    return acc;
  }, []);

  return utils.game.shuffle(gathering);
};

/**
 * Get the players with the most votes
 * @param players
 * @param witnessId
 * @returns
 */
export const getMostVotes = (players: Players, witnessId: PlayerId): PlayerId[] => {
  type MostVotesAcc = { [key: string]: number };
  const votes = Object.values(players).reduce((acc: MostVotesAcc, player: Player) => {
    if (player.id !== witnessId) {
      if (acc[player.vote] === undefined) {
        acc[player.vote] = 1;
      } else {
        acc[player.vote] += 1;
      }
    }
    return acc;
  }, {});

  const max = Math.max(...Object.values(votes));

  return Object.entries(votes).reduce((acc: PlayerId[], [playerId, voteCount]: [PlayerId, number]) => {
    if (voteCount === max) acc.push(playerId);
    return acc;
  }, []);
};

/**
 *
 * @param players
 * @param witnessId
 * @param mostVotes
 * @param witnessVote
 */
export const buildRanking = (
  players: Players,
  witnessId: PlayerId,
  mostVotes: PlayerId[],
  witnessVote: PlayerId
): RankingEntry[] => {
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  // Add points for mostVotes
  mostVotes.forEach((playerId) => {
    scores.add(playerId, 2, 0);
  });

  // Add witness vote
  if (mostVotes.includes(witnessVote)) {
    scores.add(witnessId, 2, 1);
  } else {
    scores.add(witnessVote, 1, 2);
  }

  return scores.rank(players);
};
