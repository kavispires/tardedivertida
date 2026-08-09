// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * TA NA CARA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Ta Na Cara game
 */
const achievements = achievementBuilder(GAME_KEYS.TA_NA_CARA)
  .truthy('triggerGuessing', {
    doc: 'Player triggered the guessing phase',
    key: 'TRIGGERED_GUESSING',
  })
  .counter('positiveAnswers', {
    doc: 'Number of times the player answered positively to a question',
    most: 'MOST_POSITIVE_ANSWERS',
  })
  .counter('extremePositiveAnswers', {
    doc: 'Number of times the player answered extremely positively to a question',
    most: 'MOST_EXTREME_POSITIVE_ANSWERS',
  })
  .counter('negativeAnswers', {
    doc: 'Number of times the player answered negatively to a question',
    most: 'MOST_NEGATIVE_ANSWERS',
  })
  .counter('extremeNegativeAnswers', {
    doc: 'Number of times the player answered extremely negatively to a question',
    most: 'MOST_EXTREME_NEGATIVE_ANSWERS',
  })
  .counter('maybeAnswers', {
    doc: 'Number of times the player answered neutrally to a question',
    most: 'MOST_MAYBE_ANSWERS',
    least: 'FEWEST_MAYBE_ANSWERS',
  })
  .counter('originalQuestions', {
    doc: 'Number of original questions the player asked',
    most: 'MOST_ORIGINAL_QUESTIONS',
  })
  .counter('suggestedQuestions', {
    doc: 'Number of suggested questions the player asked',
    most: 'MOST_SUGGESTED_QUESTIONS',
  })
  .build();

export const {
  constants,
  setupAchievements,
  increaseAchievement,
  calculateAchievements,
  setTruthyAchievement,
} = achievements;
