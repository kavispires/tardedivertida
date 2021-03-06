// Constants
import { RETRATO_FALADO_PHASES } from './constants';
// Types
import type { Player, PlayerId, Players, RankingEntry, Round } from '../../utils/types';
import type { AllMonsters, MonsterSketch } from './types';
import type { MonsterCard } from '../../utils/tdi';
// Helpers
import * as utils from '../../utils';
import { buildNewScoreObject } from '../../utils/helpers';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER } = RETRATO_FALADO_PHASES;
  const order = [RULES, SETUP, COMPOSITE_SKETCH, EVALUATION, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return triggerLastRound || (round.current > 0 && round.current === round.total)
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
 * @param usedCardsIds
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
  const newScores = buildNewScoreObject(players, [0, 0, 0]);

  // Add points for mostVotes
  mostVotes.forEach((playerId) => {
    newScores[playerId].gainedPoints[0] += 2;
    newScores[playerId].newScore += 2;
  });

  // Add witness vote
  if (mostVotes.includes(witnessVote)) {
    newScores[witnessId].gainedPoints[1] += 2;
    newScores[witnessId].newScore += 2;
  } else {
    newScores[witnessVote].gainedPoints[2] += 1;
    newScores[witnessVote].newScore += 1;
  }

  Object.values(newScores).forEach((score) => {
    players[score.playerId].score = score.newScore;
  });

  return Object.values(newScores);
};
