import { orderBy, sample, shuffle } from 'lodash';
// Types
import type { GroupQuestionCardData } from '../../types/tdr';
import type {
  AllQuestions,
  AnswerEntry,
  AnswerGroupEntry,
  Deck,
  GalleryEntry,
  PastureChangeEntry,
  SheepAnimation,
} from './types';
// Constants
import {
  MAX_ROUNDS,
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
  SHORT_PASTURE_GAME_OVER_THRESHOLD,
} from './constants';
// Mechanics
import { getListOfPlayers } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Utils
import { stringRemoveAccents } from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION, GAME_OVER } =
    MENTE_COLETIVA_PHASES;
  const order = [SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION];

  if (isGameOver || round.current === MAX_ROUNDS) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return round.forceLastRound ? GAME_OVER : QUESTION_SELECTION;
  }

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Determines the round type based on player count and current round number
 * @param playerCount - The number of players in the session
 * @param currentRound - The current round number
 * @param players - The players participating in this game step
 * @returns The round-rule index selected for the player count and pasture progress
 */
export const determineRoundType = (playerCount: number, currentRound: number, players: Players): number => {
  const isSmallGame = playerCount <= 4;

  // For the first 2 rounds, always 1
  if (currentRound < 3) return 1;

  // When the farthest player is too far from the others
  if (isLevelDifferenceGreaterThanOne(players)) {
    return isSmallGame ? 2 : sample([2, 2, 2, 3]);
  }

  // If the game is going for too long
  if (currentRound > 9) {
    return isSmallGame ? sample([1, 2, 2]) : sample([2, 2, 3]);
  }

  return isSmallGame ? sample([1, 1, 1, 1, 1, 2, 0]) : sample([1, 1, 1, 1, 2, 2, 3, 0]);
};

/**
 * Gets 3 unique questions per round
 * @param allQuestions - Question resources available for selection
 * @returns The selected cards in deck order
 */
export const buildDeck = (allQuestions: AllQuestions): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * QUESTIONS_PER_ROUND;

  const shuffledQuestions = shuffle(Object.values(allQuestions));

  return shuffledQuestions.slice(0, neededQuestionsAmount + 1);
};

/**
 * Gather all answers into an array
 * @param players - The players participating in this game step
 * @returns The normalized player submissions collected into one answer list
 */
export const gatherAllAnswers = (players: Players): AnswerEntry[] => {
  const answersArr: AnswerEntry[] = [];
  getListOfPlayers(players).forEach((player) => {
    const answers: Dictionary<string> = player.answers;
    Object.entries(answers).forEach(([key, answer]) => {
      answersArr.push({
        id: key,
        playerId: player.id,
        answer,
        parsedAnswer: stringRemoveAccents(answer),
        isLocked: false,
        score: 0,
      });
    });
  });
  return answersArr;
};

/**
 * Expands player answer strings into normalized records with their initial locking state.
 * @param players - The players participating in this game step
 * @returns The players with their answers expanded into normalized answer records
 */
export const extendPlayerAnswers = (players: Players) => {
  getListOfPlayers(players).forEach((player) => {
    const answers: PlainObject = player.answers;
    Object.entries(answers).forEach(([key, answer]) => {
      player.answers[key] = {
        parsedAnswer: stringRemoveAccents(answer),
        answer,
        isLocked: false,
      };
    });
  });

  return players;
};

/**
 * Group equal entries
 * @param allAnswers - The player answers to normalize and group
 * @returns Unlocked answers grouped by normalized text and ordered by matching count
 */
export const buildListOfAnswers = (allAnswers: AnswerEntry[]): AnswerGroupEntry[] => {
  // Group by equality
  const groupedAnswers = allAnswers.reduce((acc: Record<string, AnswerGroupEntry>, entry: AnswerEntry) => {
    if (entry?.isLocked) {
      return acc;
    }

    if (acc[entry.parsedAnswer] === undefined) {
      acc[entry.parsedAnswer] = {
        parsedAnswer: entry.parsedAnswer,
        answer: entry.answer,
        entries: [],
        score: 0,
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
  return orderBy(Object.values(groupedAnswers), ['score', 'answer'], ['desc', 'asc']);
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @param store - The server-side game data used for this step
 * @returns The ranking after resolving player scores
 */
export const buildRanking = (players: Players, store: PlainObject): RankingEntry[] => {
  // Gained points: [matches]
  const scores = new Scores(players, [0]);
  scores.reset();

  getListOfPlayers(players).forEach((player) => {
    scores.add(player.id, player.score, 0);

    increaseAchievement(store.achievements, player.id, 'secretScore', player.score);
  });

  return scores.rank(players);
};

/**
 * Determines array of player ids with the lowest scores
 * @param ranking - The ranking produced after resolving player scores
 * @param roundType - The resource category or rule variant used for this round
 * @returns Player identifiers in the lowest-scoring groups selected by the round rule
 */
export const determineLowestScores = (ranking: RankingEntry[], roundType: number) => {
  const scores = ranking.reduce((acc: UID[][], entry) => {
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
 * @param ranking - The ranking produced after resolving player scores
 * @param roundType - The resource category or rule variant used for this round
 * @returns The highest-scoring player identifiers for a one-in-one-out round, or an empty list
 */
export const determineHighestScores = (ranking: RankingEntry[], roundType: number) => {
  if (roundType > 0) return [];

  const scores = ranking.reduce((acc: UID[][], entry) => {
    if (acc[entry.newScore] === undefined) {
      acc[entry.newScore] = [];
    }
    acc[entry.newScore].push(entry.playerId);
    return acc;
  }, []);

  return scores.pop() ?? [];
};

/**
 * Builds pasture change arrays used in the pasture resolution animation
 * @param players - The players participating in this game step
 * @param lowestScores - Identifiers of players in the lowest-scoring groups
 * @param highestScores - Identifiers of players in the highest-scoring group
 * @returns The initial positions, animation flags, and final positions for the pasture transition
 */
export const buildPastureChange = (players: Players, lowestScores: UID[], highestScores: UID[]) => {
  const change: PastureChangeEntry[][] = [];

  // First change: previous levels
  change.push(
    getListOfPlayers(players).map((player) => ({
      id: player.id,
      avatarId: player.avatarId,
      name: player.name,
      level: player.level,
      sheepId: player.sheepId,
    })),
  );

  // Second change, the ones that should animate
  change.push(
    change[0].map((player) => ({
      ...player,
      ...determineAnimation(player.id, lowestScores, highestScores, player.level),
    })),
  );

  change.push(
    change[0].map((player) => ({
      ...player,
      level: getNewLevel(player.id, lowestScores, highestScores, player.level),
    })),
  );

  return change;
};

/**
 * Recalculate pasture change if player is given a second chance
 * @param pastureChange - The player positions and animation flags for a pasture transition
 * @param pastureSize - The level at which a sheep would leave the pasture
 */
export const recalculateLastPasture = (pastureChange: PastureChangeEntry[][], pastureSize: number) => {
  pastureChange[2].forEach((player, index) => {
    if (player.level === pastureSize) {
      player.level = pastureSize - 1;
      pastureChange[1][index].animateRight = false;
      pastureChange[1][index].animateRebound = true;
    }
  });
};

/**
 * Determine what animation a player should receive based on score
 * @param playerId - The identifier of the player submitting or receiving the update
 * @param lowestScores - Identifiers of players in the lowest-scoring groups
 * @param highestScores - Identifiers of players in the highest-scoring group
 * @param level - The player's current pasture level
 * @returns The directional animation flags for this player's pasture change
 */
const determineAnimation = (
  playerId: UID,
  lowestScores: UID[],
  highestScores: UID[],
  level: number,
): SheepAnimation => {
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
 * @param playerId - The identifier of the player submitting or receiving the update
 * @param lowestScores - Identifiers of players in the lowest-scoring groups
 * @param highestScores - Identifiers of players in the highest-scoring group
 * @param level - The player's current pasture level
 * @returns The player's pasture level after applying the scoring-group movement
 */
const getNewLevel = (playerId: UID, lowestScores: UID[], highestScores: UID[], level: number): number => {
  const isLowest = lowestScores.includes(playerId);
  const isHighest = highestScores.includes(playerId);

  if (isLowest && isHighest) return level;

  if (isLowest) return level + 1;

  if (isHighest) return level > 0 ? level - 1 : 0;

  return level;
};

/**
 * Updates players' pasture levels from the resolved movement
 * @param players - The players participating in this game step
 * @param pastureChange - The player positions and animation flags for a pasture transition
 * @returns The players with their pasture levels updated
 */
export const updateLevelsForPlayers = (players: Players, pastureChange: PastureChangeEntry[]) => {
  pastureChange.forEach((change) => {
    players[change.id].level = change.level;
  });
  return players;
};

/**
 * Checks whether any sheep has reached the configured pasture boundary
 * @param players - The players participating in this game step
 * @param isShortPasture - Whether to use the shorter pasture ending threshold
 * @returns Whether the game has reached its ending condition
 */
export const determineGameOver = (players: Players, isShortPasture: boolean) => {
  return getListOfPlayers(players).some(
    (player) =>
      player.level >= (isShortPasture ? SHORT_PASTURE_GAME_OVER_THRESHOLD : PASTURE_GAME_OVER_THRESHOLD),
  );
};

/**
 * Determine if a lonely sheep should be saved
 * @param isGameOver - Whether the game has reached an ending condition
 * @param pastureSize - The level at which a sheep would leave the pasture
 * @param pastureChange - The player positions and animation flags for a pasture transition
 * @param lastRound - Whether the game is being forced to end this round
 * @param usedSave - Whether the one-time sheep rescue has already been used
 * @returns Whether the remaining one-time rescue should prevent a lone sheep from leaving the pasture
 */
export const shouldSaveSheep = (
  isGameOver: boolean,
  pastureSize: number,
  pastureChange: PastureChangeEntry[][],
  lastRound?: boolean,
  usedSave?: boolean,
) => {
  if (lastRound || usedSave || !isGameOver) return false;

  // Only save if whoever is dying is by themselves in the last pasture
  const howManyInLastPasture = pastureChange[0].filter((entry) => entry.level === pastureSize - 1).length;

  return howManyInLastPasture <= 1;
};

/**
 * Adds the distance the sheep moved during the pasture change (for achievement)
 * @param pastureChange - The player positions and animation flags for a pasture transition
 * @param store - The server-side game data used for this step
 */
export const calculateSheepTravelDistance = (store: PlainObject, pastureChange: PastureChangeEntry[][]) => {
  pastureChange[0].forEach((pastureChangeEntry, index) => {
    increaseAchievement(
      store.achievements,
      pastureChangeEntry.id,
      'distance',
      Math.abs(pastureChange[2][index].level - pastureChangeEntry.level),
    );
  });
};

/**
 * Compares the two highest player levels to detect a lead greater than one pasture space.
 * @param players - The players participating in this game step
 * @returns Whether the leading player is more than one level ahead
 */
export function isLevelDifferenceGreaterThanOne(players: Players): boolean {
  // Sort the players by level in descending order
  const sortedPlayers = getListOfPlayers(players).sort((a, b) => b.level - a.level);

  // Calculate the difference between the highest level and the second highest level
  const highestLevel = sortedPlayers[0].level;
  const secondHighestLevel = sortedPlayers[1].level;
  const difference = highestLevel - secondHighestLevel;

  // Return true if the difference is greater than 1, otherwise false
  return difference > 1;
}

/**
 * Builds a question gallery from the leading answer groups tied for the largest entry count.
 * @param answersList - Answer groups ordered with the most frequent groups first
 * @param question - The question associated with the grouped answers
 * @returns The question and its most frequent answers
 */
export function getMostFrequentAnswers(
  answersList: AnswerGroupEntry[],
  question: GroupQuestionCardData,
): GalleryEntry {
  const result: GalleryEntry = {
    question,
    answers: [],
  };

  for (let i = 0; i < answersList.length; i++) {
    if (i === 0 || answersList[0].entries.length === answersList[i].entries.length) {
      result.answers.push({
        answer: answersList[i].answer,
        playerIds: answersList[i].entries.map((e) => e.playerId),
      });
    }
  }

  return result;
}
