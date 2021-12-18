// Constants
import {
  MAX_ROUNDS,
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
} from './constants';
// Types
import { PlainObject, PlayerId, Players } from '../../utils/types';
import { AllQuestions, AnswerEntry, Deck } from './types';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean
): string => {
  const {
    RULES,
    SETUP,
    QUESTION_SELECTION,
    EVERYBODY_WRITES,
    COMPARE,
    RESOLUTION,
    GAME_OVER,
  } = MENTE_COLETIVA_PHASES;
  const order = [RULES, SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION];

  if (isGameOver || currentRound === MAX_ROUNDS) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return QUESTION_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return QUESTION_SELECTION;
};

/**
 * Determines the round type based on player count and current round number
 * @param playerCount
 * @param currentRound
 * @returns
 */
export const determineRoundType = (playerCount: number, currentRound: number): number => {
  if (currentRound < 3) return 1;

  if (currentRound > 11) {
    return gameUtils.getRandomItem([2, 2, 3]);
  }

  if (playerCount < 3) {
    return gameUtils.getRandomItem([1, 1, 1, 1, 1, 2, 0]);
  }

  return gameUtils.getRandomItem([1, 1, 1, 1, 2, 2, 3, 0]);
};

/**
 * Gets 3 unique questions per round
 * @param allQuestions
 * @param pastQuestionsIds
 * @returns
 */
export const buildDeck = (allQuestions: AllQuestions, pastQuestionsIds: string[]): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * QUESTIONS_PER_ROUND;

  const filteredQuestions = Object.values(allQuestions).filter(({ id }) => !pastQuestionsIds.includes(id));

  const availableQuestions =
    filteredQuestions.length > neededQuestionsAmount ? filteredQuestions : Object.values(allQuestions);

  const shuffledQuestions = gameUtils.shuffle(availableQuestions);

  return shuffledQuestions.slice(0, neededQuestionsAmount + 1);
};

/**
 * Gather all answers into an array
 * @param players
 * @returns
 */
export const gatherAllAnswers = (players: Players): AnswerEntry[] => {
  const answersObj: any[] = [];
  Object.values(players).forEach((player) => {
    const answers: PlainObject = player.answers;
    Object.entries(answers).forEach(([key, answer]) => {
      answersObj.push({
        id: key,
        playerId: player.id,
        answer,
        parsedAnswer: utils.stringRemoveAccents(answer),
        isLocked: false,
        score: 0,
      });
    });
  });
  return answersObj;
};

/**
 *
 * @param players
 * @returns
 */
export const extendPlayerAnswers = (players: Players) => {
  Object.values(players).forEach((player) => {
    const answers: PlainObject = player.answers;
    Object.entries(answers).forEach(([key, answer]) => {
      player.answers[key] = {
        parsedAnswer: utils.stringRemoveAccents(answer),
        answer,
        isLocked: false,
      };
    });
  });

  return players;
};

/**
 * Group equal entries
 * @param allAnswers
 * @returns
 */
export const buildListOfAnswers = (allAnswers: PlainObject) => {
  // Group by equality
  const groupedAnswers = allAnswers.reduce((acc, entry: AnswerEntry) => {
    if (entry?.isLocked) {
      return acc;
    }

    if (acc[entry.parsedAnswer] === undefined) {
      acc[entry.parsedAnswer] = {
        parsedAnswer: entry.parsedAnswer,
        answer: entry.answer,
        entries: [],
      };
    }

    acc[entry.parsedAnswer].entries.push(entry);
    acc[entry.parsedAnswer].score = acc[entry.parsedAnswer].entries.length;
    return acc;
  }, {});

  if (!Object.values(groupedAnswers).length) {
    return [];
  }

  // Sort by most matches
  return utils.orderBy(Object.values(groupedAnswers), ['score', 'answer'], ['desc', 'asc']);
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @returns
 */
export const buildRanking = (players: Players): PlainObject[] => {
  // Format <player>: [<old score>, <addition points>, <new score>]
  // Build score array
  const ranking = Object.values(players)
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      previousScore: 0,
      newScore: player.score,
    }))
    .sort((a, b) => (a.newScore > b.newScore ? 1 : -1));

  return ranking;
};

/**
 * Determines array of player ids with the lowest scores
 * @param ranking
 * @param roundType
 * @returns
 */
export const determineLowestScores = (ranking, roundType: number) => {
  const scores = ranking.reduce((acc, entry) => {
    if (acc[entry.newScore] === undefined) {
      acc[entry.newScore] = [];
    }
    acc[entry.newScore].push(entry.playerId);
    return acc;
  }, []);

  const ascendingScores = scores.filter((e) => e);

  if (roundType <= 1) {
    return ascendingScores[0];
  }

  if (roundType === 2) {
    return [...ascendingScores[0], ...(ascendingScores?.[1] ?? [])];
  }

  if (roundType === 3) {
    return [...ascendingScores[0], ...(ascendingScores?.[1] ?? []), ...(ascendingScores?.[2] ?? [])];
  }

  return [];
};

/**
 * Determines array of player ids with the highest scores
 * @param ranking
 * @param roundType
 * @returns
 */
export const determineHighestScores = (ranking, roundType: number) => {
  if (roundType > 0) return [];

  const scores = ranking.reduce((acc, entry) => {
    if (acc[entry.newScore] === undefined) {
      acc[entry.newScore] = [];
    }
    acc[entry.newScore].push(entry.playerId);
    return acc;
  }, []);

  return scores.pop();
};

/**
 * Builds pasture change arrays used in the pasture resolution animation
 * @param players
 * @param lowestScores
 * @param highestScores
 * @returns
 */
export const buildPastureChange = (players: Players, lowestScores: PlayerId[], highestScores: PlayerId[]) => {
  const change: PlainObject[] = [];

  // First change: previous levels
  change.push(
    Object.values(players).map((player) => ({
      id: player.id,
      avatarId: player.avatarId,
      name: player.name,
      level: player.level,
    }))
  );

  // Second change, the ones that should animate
  change.push(
    change[0].map((player) => ({
      ...player,
      ...determineAnimation(player.id, lowestScores, highestScores, player.level),
    }))
  );

  change.push(
    change[0].map((player) => ({
      ...player,
      level: getNewLevel(player.id, lowestScores, highestScores, player.level),
    }))
  );

  return change;
};

/**
 * Recalculate pasture change if player is given a second chance
 * @param pastureChange
 */
export const recalculateLastPasture = (pastureChange) => {
  pastureChange[2].forEach((player, index) => {
    if (player.level === 5) {
      player.level = 4;
      pastureChange[1][index].animateRight = false;
      pastureChange[1][index].animateRebound = true;
    }
  });
};

/**
 * Determine what animation a player should receive based on score
 * @param playerId
 * @param lowestScores
 * @param highestScores
 * @param level
 * @returns
 */
const determineAnimation = (
  playerId: PlayerId,
  lowestScores: PlayerId[],
  highestScores: PlayerId[],
  level: number
): PlainObject => {
  const isLowest = lowestScores.includes(playerId);
  const isHighest = highestScores.includes(playerId);

  if (isLowest && isHighest) return {};

  if (isLowest) {
    return {
      animateRight: true,
    };
  }

  if (isHighest)
    return level > 0
      ? {
          animateLeft: true,
        }
      : {};

  return {};
};

/**
 * Determine level based on movement (lowest/highest scores)
 * @param playerId
 * @param lowestScores
 * @param highestScores
 * @param level
 * @returns
 */
const getNewLevel = (
  playerId: PlayerId,
  lowestScores: PlayerId[],
  highestScores: PlayerId[],
  level: number
): number => {
  const isLowest = lowestScores.includes(playerId);
  const isHighest = highestScores.includes(playerId);

  if (isLowest && isHighest) return level;

  if (isLowest) return level + 1;

  if (isHighest) return level > 0 ? level - 1 : 0;

  return level;
};

/**
 * Updates players scores
 * @param players
 * @param pastureChange
 * @returns
 */
export const updateLevelsForPlayers = (players: Players, pastureChange) => {
  pastureChange.forEach((change) => {
    players[change.id].level = change.level;
  });
  return players;
};

/**
 * Determine if a player has passed level 4 and it should be game over
 * @param players
 * @returns
 */
export const determineGameOver = (players: Players) => {
  return Object.values(players).some((player) => player.level >= PASTURE_GAME_OVER_THRESHOLD);
};

/**
 * Transform a list of ids into an object of id=true pairs
 * @param pastQuestions
 * @returns
 */
export const buildUsedQuestionIdsDict = (pastQuestions: string[]): PlainObject => {
  return pastQuestions.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});
};
