// Constants
import { RETRATO_FALADO_PHASES } from './constants';
// Types
import { NewScores, Player, PlayerId, Players, RankingEntry, Round } from '../../utils/types';
import { AllMonsters, MonsterCard, MonsterSketch } from './types';
// Helpers
import * as gameUtils from '../../utils/game-utils';

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
export const buildDeck = (allMonsters: AllMonsters, usedCardsIds: string[], playerCount: number) => {
  const availableCards = Object.values(allMonsters).filter((entry) => !usedCardsIds.includes(entry.id));
  return gameUtils.getRandomItems(availableCards, playerCount);
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

  return gameUtils.shuffle(gathering);
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
  const newScores: NewScores = {};

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = {
      playerId: player.id,
      name: player.name,
      previousScore: player.score,
      gainedPoints: [0, 0, 0],
      newScore: player.score,
    };
  });

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
