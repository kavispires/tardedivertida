// Types
import type {
  CategoryCard,
  Deck,
  FirebaseStoreData,
  OndaTelepaticaAchievement,
  OndaTelepaticaOptions,
  ResourceData,
} from './types';
// Constants
import {
  CATEGORIES_PER_ROUND,
  GAME_OVER_SCORE_THRESHOLD,
  MAX_ROUNDS,
  ONDA_TELEPATICA_ACHIEVEMENTS,
  ONDA_TELEPATICA_PHASES,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param pointsToVictory
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, DIAL_CLUE, GUESS, REVEAL, GAME_OVER } = ONDA_TELEPATICA_PHASES;
  const order = [RULES, SETUP, DIAL_CLUE, GUESS, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return isGameOver || triggerLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : DIAL_CLUE;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return DIAL_CLUE;
};

/**
 * Determine if a player has passed the points  threshold and it should be game over
 * @param players
 * @returns
 */
export const determineGameOver = (
  players: Players,
  options: OndaTelepaticaOptions,
  round: Round
): boolean => {
  if (!options.fixedRounds) {
    return Object.values(players).some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
  }

  const playerCount = utils.players.getPlayerCount(players);
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current > playerCount;
};

/**
 * Gets 2 unique categories per round
 * @param data
 * @returns
 */
export const buildDeck = (data: ResourceData): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * CATEGORIES_PER_ROUND;

  const shuffledQuestions = utils.game.shuffle(Object.values(data.allCategories));

  return shuffledQuestions.slice(0, neededQuestionsAmount + 1);
};

/**
 *
 * @param guess
 * @param target
 * @returns
 */
const determineScore = (guess: number, target: number): number => {
  const difference = Math.abs(target - guess);

  switch (difference) {
    case 0:
      return 4;
    case 1:
      return 3;
    case 2:
      return 2;
    default:
      return 0;
  }
};

/**
 *
 * @param players - it modifies players
 * @param currentCategory
 * @param psychicId
 * @param store
 * @returns
 */
export const buildRanking = (
  players: Players,
  currentCategory: CategoryCard,
  psychicId: PlayerId,
  store: PlainObject
) => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  const newScores: PlainObject = {};

  let psychicPoints = 0;
  let playersMaxPoints = 0;

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = [player.score, 0, player.score];

    if (player.id !== psychicId) {
      const points = determineScore(player.guess, currentCategory?.target ?? 0);
      newScores[player.id][1] += points;
      newScores[player.id][2] += points;

      players[player.id].score += points;
      playersMaxPoints = points > playersMaxPoints ? points : playersMaxPoints;

      // Determine psychic points
      psychicPoints += points > 0 ? 1 : 0;

      // Achievements
      const difference = Math.abs(currentCategory?.target ?? 0 - player.guess);
      // Accuracy
      store.achievements[player.id].accuracy += difference;
      if (points === 0) {
        store.achievements[player.id].zero += 1;
      }
      if (points === 4) {
        store.achievements[player.id].exact += 1;
      }
    }
  });
  // Psychic achievement
  store.achievements[psychicId].psychicPoints += psychicPoints;

  // If psychic predicted the win
  const isMoreThanHalf = psychicPoints >= (Object.keys(players).length - 1) / 2;
  // Psychic gets a maximum of 3 points for other players votes
  psychicPoints = psychicPoints > 3 ? 3 : psychicPoints;
  // Psychic gets 1 points if he bet on the guess amount correctly
  psychicPoints += players[psychicId].guess === isMoreThanHalf ? 1 : 0;
  // The psychic can never get more points than the other players
  psychicPoints = psychicPoints > playersMaxPoints ? playersMaxPoints : psychicPoints;
  // Add psychic points
  players[psychicId].score += psychicPoints;
  newScores[psychicId][1] += psychicPoints;
  newScores[psychicId][2] += psychicPoints;

  return Object.entries(newScores)
    .map(([playerId, scores]) => {
      return {
        playerId,
        name: players[playerId].name,
        previousScore: scores[0],
        gainedPoints: scores[1],
        newScore: scores[2],
      };
    })
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
};

/**
 * Get achievements:
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<OndaTelepaticaAchievement>[] = [];

  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'accuracy');
  // Most accurate: got results closest to the needle
  if (most) {
    achievements.push({
      type: ONDA_TELEPATICA_ACHIEVEMENTS.MOST_ACCURATE,
      playerId: most.playerId,
      value: most.accuracy,
    });
  }

  // Least accurate: got results farthest from the needle
  if (least) {
    achievements.push({
      type: ONDA_TELEPATICA_ACHIEVEMENTS.LEAST_ACCURATE,
      playerId: least.playerId,
      value: least.accuracy,
    });
  }

  const { most: exact } = utils.achievements.getMostAndLeastOf(store, 'exact');

  // Most exact: got results exactly at the needle more times
  if (exact) {
    achievements.push({
      type: ONDA_TELEPATICA_ACHIEVEMENTS.MOST_EXACT,
      playerId: exact.playerId,
      value: exact.exact,
    });
  }

  const { most: zeros } = utils.achievements.getMostAndLeastOf(store, 'zero');

  // Most zeroes: did not get points most times
  if (zeros) {
    achievements.push({
      type: ONDA_TELEPATICA_ACHIEVEMENTS.MOST_ZEROS,
      playerId: zeros.playerId,
      value: zeros.zero,
    });
  }

  const { most: psychicPoints } = utils.achievements.getMostAndLeastOf(store, 'psychicPoints');

  // Most zeroes: did not get points most times
  if (psychicPoints) {
    achievements.push({
      type: ONDA_TELEPATICA_ACHIEVEMENTS.BEST_PSYCHIC,
      playerId: psychicPoints.playerId,
      value: psychicPoints.psychicPoints,
    });
  }

  return achievements;
};
