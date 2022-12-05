// Constants
import {
  MAX_ROUNDS,
  MENTE_COLETIVA_ACHIEVEMENTS,
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
  SHORT_PASTURE_GAME_OVER_THRESHOLD,
} from './constants';
// Types
import type {
  AllQuestions,
  AnswerEntry,
  AnswerGroupEntry,
  Deck,
  FirebaseStoreData,
  MenteColetivaAchievement,
  PastureChangeEntry,
  SheepAnimation,
} from './types';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param currentRound
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  currentRound: number,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION, GAME_OVER } =
    MENTE_COLETIVA_PHASES;
  const order = [RULES, SETUP, QUESTION_SELECTION, EVERYBODY_WRITES, COMPARE, RESOLUTION];

  if (isGameOver || currentRound === MAX_ROUNDS) {
    return GAME_OVER;
  }

  if (currentPhase === RESOLUTION) {
    return triggerLastRound ? GAME_OVER : QUESTION_SELECTION;
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
    return utils.game.getRandomItem([2, 2, 3]);
  }

  if (playerCount < 3) {
    return utils.game.getRandomItem([1, 1, 1, 1, 1, 2, 0]);
  }

  return utils.game.getRandomItem([1, 1, 1, 1, 2, 2, 3, 0]);
};

/**
 * Gets 3 unique questions per round
 * @param allQuestions
 * @returns
 */
export const buildDeck = (allQuestions: AllQuestions): Deck => {
  const neededQuestionsAmount = MAX_ROUNDS * QUESTIONS_PER_ROUND;

  const shuffledQuestions = utils.game.shuffle(Object.values(allQuestions));

  return shuffledQuestions.slice(0, neededQuestionsAmount + 1);
};

/**
 * Gather all answers into an array
 * @param players
 * @returns
 */
export const gatherAllAnswers = (players: Players): AnswerEntry[] => {
  const answersArr: AnswerEntry[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    const answers: StringDictionary = player.answers;
    Object.entries(answers).forEach(([key, answer]) => {
      answersArr.push({
        id: key,
        playerId: player.id,
        answer,
        parsedAnswer: utils.helpers.stringRemoveAccents(answer),
        isLocked: false,
        score: 0,
      });
    });
  });
  return answersArr;
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
        parsedAnswer: utils.helpers.stringRemoveAccents(answer),
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
  return utils.helpers.orderBy(Object.values(groupedAnswers), ['score', 'answer'], ['desc', 'asc']);
};

/**
 * Build round ranking
 * @param players - it modifies players
 * @returns
 */
export const buildRanking = (players: Players, store: PlainObject): RankingEntry[] => {
  // Gained points: [matches]
  const scores = new utils.players.Scores(players, [0]);
  scores.reset();

  utils.players.getListOfPlayers(players).forEach((player) => {
    scores.add(player.id, player.score, 0);

    utils.achievements.increase(store, player.id, 'secretScore', player.score);
  });

  return scores.rank(players);
};

/**
 * Determines array of player ids with the lowest scores
 * @param ranking
 * @param roundType
 * @returns
 */
export const determineLowestScores = (ranking: RankingEntry[], roundType: number) => {
  const scores = ranking.reduce((acc: any[], entry) => {
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
export const determineHighestScores = (ranking: RankingEntry[], roundType: number) => {
  if (roundType > 0) return [];

  const scores = ranking.reduce((acc: any, entry) => {
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
  const change: PastureChangeEntry[][] = [];

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
 * @param pastureSize
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
export const updateLevelsForPlayers = (players: Players, pastureChange: PastureChangeEntry[]) => {
  pastureChange.forEach((change) => {
    players[change.id].level = change.level;
  });
  return players;
};

/**
 * Determine if a player has passed level 4 and it should be game over
 * @param players
 * @param isShortPasture
 * @returns
 */
export const determineGameOver = (players: Players, isShortPasture: boolean) => {
  return Object.values(players).some(
    (player) =>
      player.level >= (isShortPasture ? SHORT_PASTURE_GAME_OVER_THRESHOLD : PASTURE_GAME_OVER_THRESHOLD)
  );
};

/**
 * Determine if a lonely sheep should be saved
 * @param isGameOver
 * @param pastureSize
 * @param pastureChange
 * @param lastRound
 * @param usedSave
 * @returns
 */
export const shouldSaveSheep = (
  isGameOver: boolean,
  pastureSize: number,
  pastureChange: PastureChangeEntry[][],
  lastRound?: boolean,
  usedSave?: boolean
) => {
  if (lastRound || usedSave || !isGameOver) return false;

  // Only save if whoever is dying is by themselves in the last pasture
  const howManyInLastPasture = pastureChange[0].filter((entry) => entry.level === pastureSize - 1).length;

  return howManyInLastPasture <= 1;
};

/**
 * Get achievements:
 * Most dead - if only one sheep died
 * Most matches - highest final score
 * Least matches - lowest final score
 * Most lonely - is the only one in a pasture
 * @param players
 */
export const getAchievements = (players: Players, store: FirebaseStoreData) => {
  const pasturesCount: PlayerId[][] = [];

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (pasturesCount[player.level]) {
      pasturesCount[player.level].push(player.id);
    } else {
      pasturesCount[player.level] = [player.id];
    }
  });

  const achievements: Achievement<MenteColetivaAchievement>[] = [];

  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'secretScore');
  // Most friendly / most matches - highest final score
  if (most) {
    achievements.push({
      type: MENTE_COLETIVA_ACHIEVEMENTS.MOST_MATCHES,
      playerId: most.playerId,
      value: most.secretScore,
    });
  }

  // Least friendly / least matches - highest final score
  if (least) {
    achievements.push({
      type: MENTE_COLETIVA_ACHIEVEMENTS.LEAST_MATCHES,
      playerId: least.playerId,
      value: least.secretScore,
    });
  }

  const { most: mostTravel } = utils.achievements.getMostAndLeastOf(store, 'distance');

  // Best traveler: a player alone move left or right the most
  if (mostTravel) {
    achievements.push({
      type: MENTE_COLETIVA_ACHIEVEMENTS.BEST_TRAVELER,
      playerId: mostTravel.playerId,
      value: mostTravel.distance,
    });
  }

  // Most dead: died alone
  const lastPasture = pasturesCount[pasturesCount.length - 1];
  if (lastPasture.length === 1) {
    achievements.push({
      type: MENTE_COLETIVA_ACHIEVEMENTS.MOST_DEAD,
      playerId: lastPasture[0],
      value: null,
    });
  }

  // Most lonely: it's the only one alone in a pasture
  const loners = pasturesCount.filter(
    (pastureCount, index, arr) => pastureCount.length === 1 && index !== arr.length - 1
  );
  if (loners.length === 1) {
    achievements.push({
      type: MENTE_COLETIVA_ACHIEVEMENTS.MOST_LONELY,
      playerId: loners[0][0],
      value: null,
    });
  }

  return achievements;
};

/**
 * Adds the distance the sheep moved during the pasture change (for achievement)
 * @param players
 * @param pastureChange
 */
export const calculateSheepTravelDistance = (
  store: PlainObject,
  players: Players,
  pastureChange: PastureChangeEntry[][]
) => {
  pastureChange[0].forEach((pastureChangeEntry, index) => {
    utils.achievements.increase(
      store,
      pastureChangeEntry.id,
      'distance',
      pastureChange[2][index].level - pastureChangeEntry.level
    );
  });
};
