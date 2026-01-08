// Types
import type {
  BoardEntry,
  ColegasDeQuartoAchievement,
  FirebaseStoreData,
  GalleryEntry,
  HouseHappiness,
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

  const gallery: GalleryEntry[] = utils.players.getListOfPlayers(players).map((player) => {
    let atLeastOneGuessed = false;
    const result: GalleryEntry = {
      id: player.assignedPairs.id,
      ids: player.assignedPairs.ids,
      words: board
        .filter((entry) => player.assignedPairs.ids.includes(entry.cardId))
        .map((entry) => entry.text),
      playerId: player.id,
      clue: player.assignedPairs.clue || null,
      correct: [],
      misses: [],
    };

    utils.players.getListOfPlayers(players).forEach((guesser) => {
      const guess: string[] = guesser.guesses[result.id].sort();
      if (!guess) return;

      const guessId = guess.join(SEPARATOR);
      // Is correct?
      if (guessId === result.id) {
        result.correct.push(guesser.id);
        scores.add(guesser.id, POINTS.CORRECT_GUESS, 0); // 2 points for correct guess
        scores.add(player.id, 0, POINTS.GUESSED); // 1 point for being guessed
        atLeastOneGuessed = true;
      } else {
        result.misses.push({ guesserId: guesser.id, guesses: guess });
      }
    });

    if (atLeastOneGuessed) {
      gainedHappiness += 1;
    }

    return result;
  });

  // If the target
  const targetId = board.find((entry) => entry.id === TARGET_ID)?.id ?? 'ERROR';
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
      gained: happiness.gained.push(gainedHappiness),
      total: happiness.total + gainedHappiness,
    },
    ranking: scores.rank(players),
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
