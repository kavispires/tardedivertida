import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
import { orderBy, random, sampleSize, shuffle } from 'lodash';
// Constants
import {
  HARD_MODE_EXTRA_SUSPECT_COUNT,
  MAX_ROUNDS,
  OUTCOME,
  QUESTION_COUNT,
  SUSPECT_COUNT,
  TESTEMUNHA_OCULAR_ACHIEVEMENTS,
  TESTEMUNHA_OCULAR_PHASES,
} from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, TestemunhaOcularAchievement } from './types';

/**
 * Determine the next phase based on the current phase and outcome
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the trial
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome: Outcome): string => {
  const { SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL, FINAL_TRIAL, GAME_OVER } =
    TESTEMUNHA_OCULAR_PHASES;
  const order = [SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL];

  if (currentPhase === FINAL_TRIAL) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL && (outcome === OUTCOME.LOSE || outcome === OUTCOME.WIN)) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL && outcome === OUTCOME.FINAL_SHOWDOWN) {
    return QUESTION_SELECTION;
  }

  if (currentPhase === TRIAL) {
    return round.forceLastRound || round.current >= MAX_ROUNDS ? GAME_OVER : QUESTION_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Gets a pool of suspects based on game configuration
 * @param allSuspects - The array of all suspect cards
 * @param language - The game language
 * @param largerPool - Whether to use a larger pool of suspects
 * @param targetedPool - Whether to use a targeted pool based on attributes
 * @param isGbExclusive - Whether to use GB exclusive suspects only
 */
export const getPoolOfSuspects = (
  allSuspects: SuspectCard[],
  language: string,
  largerPool: boolean,
  targetedPool: boolean,
  isGbExclusive: boolean,
) => {
  const poolSize = largerPool ? SUSPECT_COUNT + HARD_MODE_EXTRA_SUSPECT_COUNT : SUSPECT_COUNT;

  if (isGbExclusive) {
    return orderBy(
      sampleSize(
        allSuspects.filter((s) => s.gbExclusive),
        poolSize,
      ),
      [`name.${language}`],
      ['asc'],
    );
  }

  if (!targetedPool) {
    return orderBy(sampleSize(allSuspects, poolSize), [`name.${language}`], ['asc']);
  }

  const attributeKeys = shuffle(['age', 'build', 'race', 'gender']);
  const startIndex = random(1, poolSize);
  const ordering = shuffle(['asc', 'desc', 'asc', 'desc']);

  const orderedPool = orderBy(
    allSuspects,
    [`${attributeKeys[0]}`, `${attributeKeys[1]}`, `${attributeKeys[2]}`, `${attributeKeys[3]}`],
    ordering as ('asc' | 'desc')[],
  );

  return orderBy(orderedPool.slice(startIndex, startIndex + poolSize), [`name.${language}`], ['asc']);
};

/**
 * Builds a questions deck organized by difficulty level
 * @param allQuestions - The array of all testimony question cards
 */
export function buildQuestionsDeck(allQuestions: TestimonyQuestionCard[]): TestimonyQuestionCard[] {
  // Separate the questions by level
  const questionsByLevel: Dictionary<TestimonyQuestionCard[]> = {};
  shuffle(allQuestions).forEach((question) => {
    if (!questionsByLevel[question.level]) {
      questionsByLevel[question.level] = [];
    }
    questionsByLevel[question.level].push(question);
  });

  // Sort levels from highest to lowest
  const levels = Object.keys(questionsByLevel).sort((a, b) => Number(b) - Number(a));

  // Shuffle questions within each level
  levels.forEach((level) => {
    questionsByLevel[level] = shuffle(questionsByLevel[level]);
  });

  // Get 2 questions from the highest level as starting questions
  const firstTwoQuestions = questionsByLevel[levels[0]].slice(0, 2);

  // Track remaining questions per level (excluding the first two)
  const remainingQuestionsByLevel: Dictionary<TestimonyQuestionCard[]> = {};
  levels.forEach((level, index) => {
    remainingQuestionsByLevel[level] =
      index === 0 ? questionsByLevel[level].slice(2) : [...questionsByLevel[level]];
  });

  // Calculate how many questions we need (excluding the first two)
  const questionsNeeded = QUESTION_COUNT - 2;
  const questionsPerLevel = Math.floor(questionsNeeded / levels.length);

  // Collect questions evenly from each level
  const selectedQuestions: TestimonyQuestionCard[] = [];
  levels.forEach((level) => {
    selectedQuestions.push(...remainingQuestionsByLevel[level].slice(0, questionsPerLevel));
  });

  // Fill remaining slots with any leftover questions
  const remainingSlots = questionsNeeded - selectedQuestions.length;
  if (remainingSlots > 0) {
    const leftoverQuestions: TestimonyQuestionCard[] = [];
    levels.forEach((level) => {
      leftoverQuestions.push(...remainingQuestionsByLevel[level].slice(questionsPerLevel));
    });
    selectedQuestions.push(...shuffle(leftoverQuestions).slice(0, remainingSlots));
  }

  // Shuffle the selected questions and combine with the first two
  return [...firstTwoQuestions, ...shuffle(selectedQuestions)];
}

/**
 * Get a new question
 * @param questionsDeck - full deck of questions
 * @param totalQuestionsSoFar - number of questions already drawn
 * @returns
 */
export const getNewQuestions = (
  questionsDeck: TestimonyQuestionCard[],
  totalQuestionsSoFar: number,
): TestimonyQuestionCard[] => {
  return questionsDeck.slice(totalQuestionsSoFar * 2, totalQuestionsSoFar * 2 + 2);
};

/**
 * Calculates round score
 * @param currentScore
 * @param currentRound
 * @param eliminatedSuspectsCount
 * @returns
 */
export const calculateScore = (
  currentScore: number,
  currentRound: number,
  eliminatedSuspectsCount: number,
): number => {
  if (currentRound === 0) return 0;

  return currentScore + currentRound * eliminatedSuspectsCount;
};

/**
 * Calculates and returns player achievements based on game statistics
 * @param store - The Firebase store data containing achievement counters
 * @param witnessId - The ID of the player who was the witness
 */
export const getAchievements = (store: FirebaseStoreData, witnessId: UID) => {
  const achievements: Achievement<TestemunhaOcularAchievement>[] = [];

  // Witness:
  const { most } = utils.achievements.getMostAndLeastOf(store, 'witness');
  if (most) {
    achievements.push({
      type: TESTEMUNHA_OCULAR_ACHIEVEMENTS.PLAYED_AS_WITNESS,
      playerId: most.playerId,
      value: most.value,
    });
  }

  // Releases:
  const { most: mostReleases, least: fewerReleases } = utils.achievements.getMostAndLeastOfAverage(
    store,
    'releases',
    [witnessId],
  );
  if (mostReleases) {
    achievements.push({
      type: TESTEMUNHA_OCULAR_ACHIEVEMENTS.BEST_QUESTIONS,
      playerId: mostReleases.playerId,
      value: mostReleases.value,
    });
  }

  if (fewerReleases) {
    achievements.push({
      type: TESTEMUNHA_OCULAR_ACHIEVEMENTS.MOST_USELESS_QUESTIONS,
      playerId: fewerReleases.playerId,
      value: fewerReleases.value,
    });
  }

  const playersWithFoundThePerpetrator = utils.achievements.getPlayersWithTruthyAchievement(
    store,
    'foundThePerpetrator',
  );

  playersWithFoundThePerpetrator.forEach((playerId) => {
    achievements.push({
      type: TESTEMUNHA_OCULAR_ACHIEVEMENTS.FOUND_THE_PERPETRATOR,
      playerId,
      value: 1,
    });
  });

  return achievements;
};
