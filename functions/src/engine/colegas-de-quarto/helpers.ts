// Types
import type {
  BoardEntry,
  ColegasDeQuartoAchievement,
  FirebaseStoreData,
  GalleryEntry,
  HouseHappiness,
  PlayerAssignedPair,
} from './types';
// Constants
import { SEPARATOR } from '../../utils/constants';
import { COLEGAS_DE_QUARTO_ACHIEVEMENTS, COLEGAS_DE_QUARTO_PHASES, POINTS, TARGET_ID } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } = COLEGAS_DE_QUARTO_PHASES;
  const order = [SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORDS_SELECTION;
  }

  return utils.helpers.nextPhaseDelegator(currentPhase, order);
};

export function buildRanking(
  store: FirebaseStoreData,
  players: Players,
  board: BoardEntry[],
  happiness: HouseHappiness,
) {
  let gainedHappiness = 0;
  // Gained Points: [from guesses, from others, target]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  const gallery: GalleryEntry[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    const assignedPairs: PlayerAssignedPair[] = player.assignedPairs;

    assignedPairs.forEach((pair) => {
      const result: GalleryEntry = {
        id: pair.id,
        ids: pair.ids ?? [],
        words: board.filter((entry) => pair.ids.includes(entry.id)).map((entry) => entry.text),
        playerId: player.id,
        clue: pair.clue || null,
        correct: [],
        misses: [],
      };

      utils.players.getListOfPlayers(players).forEach((guesser) => {
        const guess: string[] | undefined = guesser.guesses[result.id];
        if (!guess) return;

        const sortedGuess = guess.sort();
        const guessId = sortedGuess.join(SEPARATOR);
        // Is correct?
        if (guessId === result.id) {
          result.correct.push(guesser.id);
          scores.add(guesser.id, POINTS.CORRECT_GUESS, 0); // 2 points for correct guess
          scores.add(player.id, POINTS.GUESSED, 1); // 1 point for being guessed
        } else {
          result.misses.push({ guesserId: guesser.id, guesses: sortedGuess });
        }
      });

      // Achievement: Being guessed
      utils.achievements.increase(store, player.id, 'guessed', result.correct.length);
      if (result.correct.length > 0) {
        gainedHappiness += 1;
      }
      // Achievement: Solo guessed and solo guess
      if (result.correct.length === 1) {
        utils.achievements.increase(store, player.id, 'soloGuessed', 1);
        utils.achievements.increase(store, result.correct[0], 'soloGuess', 1);
      }

      gallery.push(result);
    });
  });

  // If the target
  const targetId = board.find((entry) => entry.playerId === TARGET_ID)?.id ?? 'ERROR';
  const foundTarget: UID[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    const guesses: string[] = Object.values<string[]>(player.guesses).flat();
    if (!guesses.includes(targetId)) {
      scores.add(player.id, POINTS.CORRECT_TARGET, 2);
      gainedHappiness += POINTS.CORRECT_TARGET;
      foundTarget.push(player.id);
      utils.achievements.increase(store, player.id, 'finalItems', 1);
    }
  });

  return {
    gallery,
    happiness: {
      ...happiness,
      gained: [...happiness.gained, gainedHappiness],
      total: happiness.total + gainedHappiness,
    },
    ranking: scores.rank(players),
    targetId,
    foundTarget,
  };
}

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<ColegasDeQuartoAchievement>[] = [];

  // Most guessed clues and least guessed clues
  const { most: bestClues, least: worstClues } = utils.achievements.getMostAndLeastOf(store, 'alone');
  if (bestClues) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.BEST_CLUES,
      playerId: bestClues.playerId,
      value: bestClues.value,
    });
  }

  if (worstClues) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.WORST_CLUES,
      playerId: worstClues.playerId,
      value: worstClues.value,
    });
  }

  // Most solo guessed
  const { most: soloGuessed } = utils.achievements.getMostAndLeastOf(store, 'soloGuessed');
  if (soloGuessed) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.SOLO_GUESSED,
      playerId: soloGuessed.playerId,
      value: soloGuessed.value,
    });
  }

  // Most solo guess
  const { most: soloGuess } = utils.achievements.getMostAndLeastOf(store, 'soloGuess');
  if (soloGuess) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.SOLO_GUESSER,
      playerId: soloGuess.playerId,
      value: soloGuess.value,
    });
  }

  // Most final items and fewest final items
  const { most: mostFinalItems, least: fewestFinalItems } = utils.achievements.getMostAndLeastOf(
    store,
    'finalItems',
  );
  if (mostFinalItems) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.MOST_FINAL_ITEMS,
      playerId: mostFinalItems.playerId,
      value: mostFinalItems.value,
    });
  }

  if (fewestFinalItems) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.FEWEST_FINAL_ITEMS,
      playerId: fewestFinalItems.playerId,
      value: fewestFinalItems.value,
    });
  }

  // Shortest words and longest words
  const { most: longestWords, least: shortestWords } = utils.achievements.getMostAndLeastOf(
    store,
    'wordLength',
  );
  if (shortestWords) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.SHORTEST_WORDS,
      playerId: shortestWords.playerId,
      value: shortestWords.value,
    });
  }
  if (longestWords) {
    achievements.push({
      type: COLEGAS_DE_QUARTO_ACHIEVEMENTS.LONGEST_WORDS,
      playerId: longestWords.playerId,
      value: longestWords.value,
    });
  }

  return achievements;
};
