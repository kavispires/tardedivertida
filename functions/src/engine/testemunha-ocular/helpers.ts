import type { SuspectCard, TestimonyQuestionCard } from '../../types/tdr';
// Constants
import {
  HARD_MODE_EXTRA_SUSPECT_COUNT,
  MAX_ROUNDS,
  SUSPECT_COUNT,
  TESTEMUNHA_OCULAR_ACHIEVEMENTS,
  TESTEMUNHA_OCULAR_PHASES,
} from './constants';
// Utils
import utils from '../../utils';
import type { FirebaseStoreData, TestemunhaOcularAchievement } from './types';
import { orderBy, random } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @param lose
 * @param win
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  lose?: boolean,
  win?: boolean,
): string => {
  const { LOBBY, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL, GAME_OVER } =
    TESTEMUNHA_OCULAR_PHASES;
  const order = [LOBBY, SETUP, WITNESS_SELECTION, QUESTION_SELECTION, QUESTIONING, TRIAL];

  if (currentPhase === TRIAL && (lose || win)) {
    return GAME_OVER;
  }

  if (currentPhase === TRIAL) {
    return round.forceLastRound || round.current >= MAX_ROUNDS ? GAME_OVER : QUESTION_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return QUESTION_SELECTION;
};

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
      utils.game.getRandomItems(
        allSuspects.filter((s) => s.gbExclusive),
        poolSize,
      ),
      [`name.${language}`],
      ['asc'],
    );
  }

  if (!targetedPool) {
    return orderBy(utils.game.getRandomItems(allSuspects, poolSize), [`name.${language}`], ['asc']);
  }

  const attributeKeys = utils.game.shuffle(['age', 'build', 'race', 'gender']);
  const startIndex = random(1, poolSize);
  const ordering = utils.game.shuffle(['asc', 'desc', 'asc', 'desc']);

  const orderedPool = orderBy(
    allSuspects,
    [`${attributeKeys[0]}`, `${attributeKeys[1]}`, `${attributeKeys[2]}`, `${attributeKeys[3]}`],
    ordering as ('asc' | 'desc')[],
  );

  return orderBy(orderedPool.slice(startIndex, startIndex + poolSize), [`name.${language}`], ['asc']);
};

/**
 * Get two questions from the deck
 * @param questions
 * @param questionIndex
 * @returns
 */
export const getQuestions = (
  questions: TestimonyQuestionCard[],
  questionIndex: number,
): TestimonyQuestionCard[] => {
  return [questions[questionIndex], questions[questionIndex + 1]];
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
 * Get achievements:
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData, witnessId: PlayerId) => {
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

  return achievements;
};
