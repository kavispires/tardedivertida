// Constants
import { MEDIDAS_NAO_EXATAS_ACHIEVEMENTS, MEDIDAS_NAO_EXATAS_PHASES } from './constants';
// Utils
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import type { FirebaseStoreData, GalleryEntry, Guess, MedidasNaoExatasAchievement } from './types';
import { removeDuplicates } from '../../utils/game-utils';
import { orderBy } from 'lodash';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER } = MEDIDAS_NAO_EXATAS_PHASES;
  const order = [LOBBY, SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : METRICS_BUILDING;
  }

  const currentPhaseIndex = order.indexOf(currentPhase as keyof typeof MEDIDAS_NAO_EXATAS_PHASES);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return METRICS_BUILDING;
};

export const determineResults = (
  players: Players,
  presenterId: PlayerId,
  secretWordId: CardId,
  wordsDict: Dictionary<TextCard>,
  store: FirebaseStoreData,
  metricsDescriptors: Record<string, TextCard[]>,
  metrics: Record<CardId, number>,
  pointsBrackets: number[],
) => {
  // Gained points: [correct, levels, presenter]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  const result: GalleryEntry = {
    secretWordId,
    cards: wordsDict,
    metricsDescriptors,
    metrics,
    brackets: pointsBrackets.map((score) => ({
      score,
      playersIds: [],
      wrongGuesses: [],
    })),
  };

  const guessesByTimestamp: Record<number, Guess[]> = {};
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.id !== presenterId) {
      const guesses: Guess[] = removeDuplicates(player.guesses);

      guesses.forEach((guess, index) => {
        // Normalize timestamp to 3 seconds intervals
        const normalizedTimestamp = Math.floor(guess.timestamp / 3) * 3;
        if (!guessesByTimestamp[normalizedTimestamp]) {
          guessesByTimestamp[normalizedTimestamp] = [];
        }
        guessesByTimestamp[normalizedTimestamp].push({
          cardId: guess.cardId,
          level: guess.level,
          timestamp: normalizedTimestamp,
          playerId: player.id,
          used: index === guesses.length - 1, // Only the last guess is considered used
          retry: guesses.length > 1,
        });
      });
    }
  });

  // Sort guesses by timestamp
  const orderedTimestamps = orderBy(Object.keys(guessesByTimestamp), (key) => Number(key)).map(
    (timestamp) => guessesByTimestamp[Number(timestamp)],
  );

  const maxLength = pointsBrackets.length;
  const finalBracketOrder = orderedTimestamps.slice(0, maxLength);
  // Add the rest to the last bracket
  if (orderedTimestamps.length > maxLength) {
    finalBracketOrder.push(...orderedTimestamps.slice(maxLength));
  }

  let correctCount = 0;

  // Sort guesses by timestamp
  finalBracketOrder.forEach((guesses, index) => {
    // Process sorted guesses
    guesses.forEach((guess) => {
      const { playerId, level, cardId, used, retry } = guess;

      const bracket = result.brackets[index];

      if (!playerId || !bracket) return;

      if (!used) {
        // If the guess is not used, it means it's a retry or an invalid guess
        bracket.wrongGuesses.push({ playerId, cardId, invalid: true });
        return;
      }

      const isCorrect = cardId === secretWordId;
      if (isCorrect) {
        scores.add(playerId, pointsBrackets[index] || 2, 0);
        // Reduce points by level
        if (retry) {
          scores.add(playerId, -1, 1);
        }
        // Give points to the presenter
        scores.add(presenterId, 2, 2);
        bracket.playersIds.push(playerId);
        correctCount++;
      } else {
        bracket.wrongGuesses.push({ playerId, cardId });
      }

      // Achievements
      if (guesses.length > 1) {
        utils.achievements.increase(store, playerId, 'doubleGuesses', 1);
      }

      switch (level) {
        case 1:
          utils.achievements.increase(store, playerId, 'level1', 1);
          break;
        case 2:
          utils.achievements.increase(store, playerId, 'level2', 1);
          break;
        case 3:
          utils.achievements.increase(store, playerId, 'level3', 1);
          break;
        case 4:
          utils.achievements.increase(store, playerId, 'level4', 1);
          break;
        case 5:
          utils.achievements.increase(store, playerId, 'level5', 1);
          break;
        default:
        // do nothing
      }
    });
  });

  if (correctCount === 0) {
    utils.achievements.increase(store, presenterId, 'badMetrics', 1);
  }
  if (correctCount === utils.players.getPlayerCount(players) - 1) {
    utils.achievements.increase(store, presenterId, 'bestMetrics', 1);
  }

  return {
    ranking: scores.rank(players),
    result,
  };
};

export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<MedidasNaoExatasAchievement>[] = [];

  // Most/Fewest double guesses
  const { most: mostDoubleGuesses, least: leastDoubleGuesses } = utils.achievements.getMostAndLeastOf(
    store,
    'doubleGuesses',
  );

  if (mostDoubleGuesses) {
    achievements.push({
      playerId: mostDoubleGuesses.playerId,
      type: MEDIDAS_NAO_EXATAS_ACHIEVEMENTS.MOST_DOUBLE_GUESSES,
      value: mostDoubleGuesses.value,
    });
  }

  if (leastDoubleGuesses) {
    achievements.push({
      playerId: leastDoubleGuesses.playerId,
      type: MEDIDAS_NAO_EXATAS_ACHIEVEMENTS.FEWEST_DOUBLE_GUESSES,
      value: leastDoubleGuesses.value,
    });
  }

  // Worst Metrics
  const { most: worstMetrics } = utils.achievements.getMostAndLeastOf(store, 'badMetrics');

  if (worstMetrics) {
    achievements.push({
      playerId: worstMetrics.playerId,
      type: MEDIDAS_NAO_EXATAS_ACHIEVEMENTS.WORST_METRICS,
      value: worstMetrics.value,
    });
  }
  // Best Metrics
  const { most: bestMetrics } = utils.achievements.getMostAndLeastOf(store, 'bestMetrics');
  if (bestMetrics) {
    achievements.push({
      playerId: bestMetrics.playerId,
      type: MEDIDAS_NAO_EXATAS_ACHIEVEMENTS.BEST_METRICS,
      value: bestMetrics.value,
    });
  }

  // Most guesses by level
  const levels = ['level1', 'level2', 'level3', 'level4', 'level5'] as const;
  levels.forEach((level) => {
    const { most } = utils.achievements.getMostAndLeastOf(store, level);
    if (most) {
      achievements.push({
        playerId: most.playerId,
        type: MEDIDAS_NAO_EXATAS_ACHIEVEMENTS[`MOST_LEVEL_${level[level.length - 1]}_GUESSES`],
        value: most.value,
      });
    }
  });

  return achievements;
};
