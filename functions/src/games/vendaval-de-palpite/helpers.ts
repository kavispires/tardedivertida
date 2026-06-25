import { orderBy } from 'lodash';
// Types
import type { Board, BoardEntry, Clue, Clues } from './types';
// Constants
import { VENDAVAL_DE_PALPITE_PHASES } from './constants';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Determine the next phase based on the current one
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param outcome - The outcome of the clue evaluation
 */
export const determineNextPhase = (currentPhase: string, round: Round, outcome?: string): string => {
  const { SETUP, BOSS_SELECTION, SECRET_WORD_SELECTION, PLAYERS_CLUES, CLUE_EVALUATIONS, GAME_OVER } =
    VENDAVAL_DE_PALPITE_PHASES;
  const order = [SETUP, BOSS_SELECTION, SECRET_WORD_SELECTION, PLAYERS_CLUES, CLUE_EVALUATIONS, GAME_OVER];
  if (outcome && outcome !== 'CONTINUE') return GAME_OVER;

  if (currentPhase === CLUE_EVALUATIONS) {
    return round.forceLastRound || round.current === round.total ? GAME_OVER : PLAYERS_CLUES;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

const buildClueId = (playerId: UID, currentRound: number, index: number, guess = '') => {
  return `${playerId}:${currentRound}:${index}${guess}`;
};

/**
 * Gathers all player clues and guesses into a structured format
 * @param clues - The dictionary of all clues
 * @param board - The game board object
 * @param players - The collection of players in the game
 * @param currentRound - The current round number
 */
export const gatherClues = (
  clues: Clues,
  board: Board,
  players: Players,
  currentRound: number,
): { clues: Clues; board: Board } => {
  let newBoardEntry: Clue[] = [];

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (!player.isBoss) {
      player.clues.forEach((clue: string, index: number) => {
        const clueId = buildClueId(player.id, currentRound, index);

        clues[clueId] = {
          id: clueId,
          playerId: player.id,
          clue: clue.toLowerCase(),
        };
        newBoardEntry.push(clues[clueId]);
      });

      (player.guesses ?? []).forEach((clue: string, index: number) => {
        const guessId = buildClueId(player.id, currentRound, index, ':g');

        clues[guessId] = {
          id: guessId,
          playerId: player.id,
          clue: clue.toLowerCase(),
          isGuess: true,
        };
        newBoardEntry.push(clues[guessId]);
      });
    }
  });

  // Remove duplicated clues
  newBoardEntry = newBoardEntry.filter(
    (entry, index, self) => index === self.findIndex((c) => c.clue === entry.clue),
  );

  // Sort alphabetically
  const sortedCluesIds = orderBy(newBoardEntry, ['clue'], ['asc']).map((clue) => clue.id);

  board[currentRound] = { clues: sortedCluesIds };

  return { clues, board };
};

/**
 * Verifies if any guesses match the secret word and determines outcome
 * @param clues - The dictionary of all clues
 * @param latestBoardEntry - The latest board entry with clues
 * @param finalAnswersLeft - The number of final answer attempts remaining
 * @param secretWord - The secret word to guess
 */
export const verifyGuesses = (
  clues: Clues,
  latestBoardEntry: BoardEntry,
  finalAnswersLeft: number,
  secretWord: string,
): { outcome: string; finalAnswersLeft: number } => {
  const newAnswerCount = latestBoardEntry.clues.filter((clueId) => clues[clueId].isGuess).length;
  const newAnswersLeft = finalAnswersLeft - newAnswerCount;

  // FAIL if players used more answer guesses than they could
  if (newAnswerCount > finalAnswersLeft) {
    return {
      outcome: 'FAIL',
      finalAnswersLeft: newAnswersLeft,
    };
  }

  // FAIL if player wrote answer in regular clue
  const someoneGotItWrong = latestBoardEntry.clues.some(
    (clueId) =>
      clues[clueId].clue.trim().toUpperCase() === secretWord.toUpperCase() && !clues[clueId].isGuess,
  );
  if (someoneGotItWrong) {
    return {
      outcome: 'FAIL',
      finalAnswersLeft: newAnswersLeft,
    };
  }

  // WIN if one of the answers is the secret word
  const someoneGotIt = latestBoardEntry.clues.some(
    (clueId) => clues[clueId].clue.trim().toUpperCase() === secretWord.toUpperCase() && clues[clueId].isGuess,
  );
  if (someoneGotIt) {
    return {
      outcome: 'WIN',
      finalAnswersLeft: newAnswersLeft,
    };
  }

  // FAIL nobody got it and now there are 0 final answers
  if (newAnswersLeft === 0) {
    return {
      outcome: 'FAIL',
      finalAnswersLeft: newAnswersLeft,
    };
  }

  return {
    outcome: 'CONTINUE',
    finalAnswersLeft: newAnswersLeft,
  };
};
