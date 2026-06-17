// Constants
import { MEDIDAS_NAO_EXATAS_PHASES } from './constants';
import { orderBy, uniq } from 'lodash';
// Utils
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import type { FirebaseStoreData, GalleryEntry, Guess } from './types';
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER } = MEDIDAS_NAO_EXATAS_PHASES;
  const order = [SETUP, METRICS_BUILDING, GUESSING, RESULTS, GAME_OVER];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : METRICS_BUILDING;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Determines results by scoring player guesses and categorizing them into brackets
 * @param players - The collection of players in the game
 * @param presenterId - The ID of the presenter player
 * @param secretWordId - The ID of the secret word
 * @param wordsDict - The dictionary of all word cards
 * @param store - The Firebase store data for tracking achievements
 * @param metricsDescriptors - The dictionary of metric descriptors for each metric ID
 * @param metrics - The dictionary of metric values for each metric ID
 * @param pointsBrackets - The array of point values for each bracket
 */
export const determineResults = (
  players: Players,
  presenterId: UID,
  secretWordId: UID,
  wordsDict: Dictionary<TextCard>,
  store: FirebaseStoreData,
  metricsDescriptors: Record<string, TextCard[]>,
  metrics: Record<UID, number>,
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
      const guesses: Guess[] = uniq(player.guesses);

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
        increaseAchievement(store.achievements, playerId, 'doubleGuesses', 1);
      }

      switch (level) {
        case 1:
          increaseAchievement(store.achievements, playerId, 'level1', 1);
          break;
        case 2:
          increaseAchievement(store.achievements, playerId, 'level2', 1);
          break;
        case 3:
          increaseAchievement(store.achievements, playerId, 'level3', 1);
          break;
        case 4:
          increaseAchievement(store.achievements, playerId, 'level4', 1);
          break;
        case 5:
          increaseAchievement(store.achievements, playerId, 'level5', 1);
          break;
        default:
        // do nothing
      }
    });
  });

  if (correctCount === 0) {
    increaseAchievement(store.achievements, presenterId, 'badMetrics', 1);
  }
  if (correctCount === utils.players.getPlayerCount(players) - 1) {
    increaseAchievement(store.achievements, presenterId, 'bestMetrics', 1);
  }

  return {
    ranking: scores.rank(players),
    result,
  };
};
