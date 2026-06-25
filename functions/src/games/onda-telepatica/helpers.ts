import { shuffle } from 'lodash';
// Types
import type { CategoryCard, Deck, OndaTelepaticaOptions, ResourceData } from './types';
// Constants
import { DOUBLE_ROUNDS_THRESHOLD } from '../../constants/general';
import {
  ONDA_TELEPATICA_PHASES,
  CATEGORIES_PER_ROUND,
  GAME_OVER_SCORE_THRESHOLD,
  MAX_ROUNDS,
} from './constants';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, DIAL_CLUE, GUESS, REVEAL, GAME_OVER } = ONDA_TELEPATICA_PHASES;
  const order = [SETUP, DIAL_CLUE, GUESS, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return isGameOver || round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : DIAL_CLUE;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determine if a player has passed the points threshold and game should be over
 * @param players - The collection of players in the game
 * @param options - The game configuration options
 * @param round - The round object containing current round information
 */
export const determineGameOver = (
  players: Players,
  options: OndaTelepaticaOptions,
  round: Round,
): boolean => {
  if (!options.fixedRounds) {
    return utils.players
      .getListOfPlayers(players)
      .some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
  }

  const playerCount = utils.players.getPlayerCount(players);
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current > playerCount;
};

/**
 * Gets 2 unique categories per round from the resource data
 * @param data - The resource data containing all categories
 */
export const buildDeck = (data: ResourceData): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * CATEGORIES_PER_ROUND;

  const shuffledQuestions = shuffle(Object.values(data.allCategories));

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
 * Builds player rankings based on accuracy and psychic predictions
 * @param players - The collection of players in the game (this function modifies players)
 * @param currentCategory - The current category card
 * @param psychicId - The ID of the psychic player
 * @param store - The Firebase store data for tracking achievements
 */
export const buildRanking = (
  players: Players,
  currentCategory: CategoryCard,
  psychicId: UID,
  store: PlainObject,
) => {
  // Gained Points [correct guesses, psychic points]
  const scores = new utils.players.Scores(players, [0, 0]);

  let psychicPoints = 0;
  let playersMaxPoints = 0;

  // Build score object
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id !== psychicId) {
      const points = determineScore(player.guess, currentCategory?.target ?? 0);
      scores.add(player.id, points, 0);

      playersMaxPoints = points > playersMaxPoints ? points : playersMaxPoints;

      // Determine psychic points
      psychicPoints += points > 0 ? 1 : 0;

      // Achievements: Accuracy
      const difference = Math.abs(currentCategory?.target ?? 0 - player.guess);
      increaseAchievement(store.achievements, player.id, 'accuracy', difference);
      if (points === 0) {
        increaseAchievement(store.achievements, player.id, 'zero', 1);
      }
      if (points === 4) {
        increaseAchievement(store.achievements, player.id, 'exact', 1);
      }
    }
  });
  // Psychic achievement
  increaseAchievement(store.achievements, psychicId, 'psychicPoints', psychicPoints);

  // If psychic predicted the win
  const isMoreThanHalf = psychicPoints >= (utils.players.getPlayerCount(players) - 1) / 2;
  // Psychic gets a maximum of 3 points for other players votes
  psychicPoints = psychicPoints > 3 ? 3 : psychicPoints;
  // Psychic gets 1 points if he bet on the guess amount correctly
  psychicPoints += players[psychicId].guess === isMoreThanHalf ? 1 : 0;
  // The psychic can never get more points than the other players
  psychicPoints = psychicPoints > playersMaxPoints ? playersMaxPoints : psychicPoints;
  // Add psychic points
  scores.add(psychicId, psychicPoints, 1);

  return scores.rank(players);
};
