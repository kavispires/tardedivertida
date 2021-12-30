// Types
import { CategoryCard, Deck, PastCategories, ResourceData } from './types';
import { PlainObject, PlayerId, Players, Round } from '../../utils/types';
// Constants
import {
  CATEGORIES_PER_ROUND,
  GAME_OVER_SCORE_THRESHOLD,
  MAX_ROUNDS,
  ONDA_TELEPATICA_PHASES,
} from './constants';
// Utils
import * as gameUtils from '../../utils/game-utils';

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

  if (isGameOver) {
    return GAME_OVER;
  }

  if (currentPhase === REVEAL) {
    return triggerLastRound || (round.current > 0 && round.current === round.total) ? GAME_OVER : DIAL_CLUE;
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
export const determineGameOver = (players: Players): boolean => {
  return Object.values(players).some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
};

/**
 *
 * @param pastCategories
 * @returns
 */
export const buildUsedCategoriesIdsDict = (pastCategories: PastCategories): PlainObject => {
  return pastCategories.reduce((acc, category) => {
    acc[category.id] = true;
    return acc;
  }, {});
};

/**
 * Gets 2 unique categories per round
 * @param allQuestions
 * @param pastQuestionsIds
 * @returns
 */
export const buildDeck = (data: ResourceData): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * CATEGORIES_PER_ROUND;

  const filteredCategories = Object.values(data.allCategories).filter(
    ({ id }) => !data.usedCategories.includes(id)
  );

  const availableQuestions =
    filteredCategories.length > neededQuestionsAmount
      ? filteredCategories
      : Object.values(data.allCategories);

  const shuffledQuestions = gameUtils.shuffle(availableQuestions);

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
 * Build round ranking
 * @param players - it modifies players
 * @param gallery
 * @returns
 */
export const buildRanking = (players: Players, currentCategory: CategoryCard, psychicId: PlayerId) => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  const newScores: PlainObject = {};

  let psychicPoints = 0;

  // Build score object
  Object.values(players).forEach((player) => {
    newScores[player.id] = [player.score, 0, player.score];

    if (player.id !== psychicId) {
      const points = determineScore(player.guess, currentCategory?.target ?? 0);
      newScores[player.id][1] += points;
      newScores[player.id][2] += points;

      players[player.id].score += points;

      // Determine psychic points
      psychicPoints += points > 0 ? 1 : 0;
    }
  });

  // If psychic predicted the win
  const isMoreThanHalf = psychicPoints >= (Object.keys(players).length - 1) / 2;
  // Psychic gets a maximum of 3 points for other players votes
  psychicPoints = psychicPoints > 3 ? 3 : psychicPoints;
  // Psychic gets 2 points if he bet on the guess amount correctly
  psychicPoints += players[psychicId].guess === isMoreThanHalf ? 2 : 0;
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
