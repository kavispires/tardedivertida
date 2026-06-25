// Types
import type {
  BoardEntry,
  FirebaseStoreData,
  GalleryEntry,
  HouseHappiness,
  PlayerAssignedPair,
} from './types';
// Constants
import { SEPARATOR } from '../../constants/general';
import { COLEGAS_DE_QUARTO_PHASES, POINTS, TARGET_ID } from './constants';
// Utils
import utils from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase and round
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } = COLEGAS_DE_QUARTO_PHASES;
  const order = [SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORDS_SELECTION;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds ranking, gallery, and happiness data based on player guesses
 * @param store - The Firebase store data containing achievement counters
 * @param players - The collection of players in the game
 * @param board - The array of board entries containing words
 * @param happiness - The current house happiness object
 */
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
      increaseAchievement(store.achievements, player.id, 'guessed', result.correct.length);
      if (result.correct.length > 0) {
        gainedHappiness += 1;
      }
      // Achievement: Solo guessed and solo guess
      if (result.correct.length === 1) {
        increaseAchievement(store.achievements, player.id, 'soloGuessed', 1);
        increaseAchievement(store.achievements, result.correct[0], 'soloGuess', 1);
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
      increaseAchievement(store.achievements, player.id, 'finalItems', 1);
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
