// Utils
import utils from '../../utils';
import { METALINGUAGEM_ACHIEVEMENTS, METALINGUAGEM_PHASES, WORD_LENGTH_STATUS } from './constants';
import type { FirebaseStoreData, MetalinguagemAchievement, WordLength } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round, wordLengths: WordLength[]): string => {
  const { LOBBY, SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER } = METALINGUAGEM_PHASES;
  const order = [LOBBY, SETUP, WORD_CREATION, GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    if (round.forceLastRound) return GAME_OVER;
    if (round.current > 0 && round.current === round.total) return GAME_OVER;
    // Instant death if any word is failed
    if (wordLengths.some((wordLength) => wordLength.status === WORD_LENGTH_STATUS.FAILED)) return GAME_OVER;
    // If there's still available or endangered words, go back to word creation
    if (
      wordLengths.some(
        (wordLength) =>
          wordLength.status === WORD_LENGTH_STATUS.AVAILABLE ||
          wordLength.status === WORD_LENGTH_STATUS.ENDANGERED,
      )
    )
      return WORD_CREATION;

    return GAME_OVER;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return WORD_CREATION;
};

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<MetalinguagemAchievement>[] = [];

  // Most Two Correct
  const { most: mostTwoCorrect, least: fewestTwoCorrect } = utils.achievements.getMostAndLeastOf(
    store,
    'twoCorrect',
  );
  if (mostTwoCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.MOST_TWO_CORRECT_GUESSES,
      playerId: mostTwoCorrect.playerId,
      value: mostTwoCorrect.value,
    });
  }
  if (fewestTwoCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.FEWEST_TWO_CORRECT_GUESSES,
      playerId: fewestTwoCorrect.playerId,
      value: fewestTwoCorrect.value,
    });
  }

  // Most One Correct
  const { most: mostOneCorrect, least: fewestOneCorrect } = utils.achievements.getMostAndLeastOf(
    store,
    'oneCorrect',
  );
  if (mostOneCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.MOST_ONE_CORRECT_GUESSES,
      playerId: mostOneCorrect.playerId,
      value: mostOneCorrect.value,
    });
  }
  if (fewestOneCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.FEWEST_ONE_CORRECT_GUESSES,
      playerId: fewestOneCorrect.playerId,
      value: fewestOneCorrect.value,
    });
  }

  // Most Zero Correct
  const { most: mostZeroCorrect, least: fewestZeroCorrect } = utils.achievements.getMostAndLeastOf(
    store,
    'zeroCorrect',
  );
  if (mostZeroCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.MOST_ZERO_CORRECT_GUESSES,
      playerId: mostZeroCorrect.playerId,
      value: mostZeroCorrect.value,
    });
  }
  if (fewestZeroCorrect) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.FEWEST_ZERO_CORRECT_GUESSES,
      playerId: fewestZeroCorrect.playerId,
      value: fewestZeroCorrect.value,
    });
  }

  // Longest Words
  const { most: longestWords, least: shortestWords } = utils.achievements.getMostAndLeastOf(
    store,
    'wordLengths',
  );
  if (longestWords) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.LONGEST_WORDS,
      playerId: longestWords.playerId,
      value: longestWords.value,
    });
  }
  if (shortestWords) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.SHORTEST_WORDS,
      playerId: shortestWords.playerId,
      value: shortestWords.value,
    });
  }

  // Best Words
  const { most: bestWords, least: worstWords } = utils.achievements.getMostAndLeastOfAverage(
    store,
    'bestWords',
  );
  if (bestWords) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.BEST_WORDS,
      playerId: bestWords.playerId,
      value: bestWords.value,
    });
  }
  if (worstWords) {
    achievements.push({
      type: METALINGUAGEM_ACHIEVEMENTS.WORST_WORDS,
      playerId: worstWords.playerId,
      value: worstWords.value,
    });
  }

  return achievements;
};
