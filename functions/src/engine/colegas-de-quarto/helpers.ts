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
import { COLEGAS_DE_QUARTO_PHASES, POINTS, TARGET_ID } from './constants';
// Utils
import utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const { LOBBY, SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER } =
    COLEGAS_DE_QUARTO_PHASES;
  const order = [LOBBY, SETUP, WORDS_SELECTION, CLUE_WRITING, GUESSING, REVEAL, GAME_OVER];

  if (currentPhase === REVEAL) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total)
      ? GAME_OVER
      : WORDS_SELECTION;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return WORDS_SELECTION;
};

export function buildRanking(
  _store: FirebaseStoreData,
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
      let atLeastOneGuessed = false;
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
          atLeastOneGuessed = true;
        } else {
          result.misses.push({ guesserId: guesser.id, guesses: sortedGuess });
        }
      });

      if (atLeastOneGuessed) {
        gainedHappiness += 1;
      }

      gallery.push(result);
    });
  });

  // If the target
  const targetId = board.find((entry) => entry.playerId === TARGET_ID)?.id ?? 'ERROR';
  const foundTarget: PlayerId[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    const guesses: string[] = Object.values<string[]>(player.guesses).flat();
    if (!guesses.includes(targetId)) {
      scores.add(player.id, POINTS.CORRECT_TARGET, 2);
      gainedHappiness += POINTS.CORRECT_TARGET;
      foundTarget.push(player.id);
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
  console.log(store);

  return achievements;
};
