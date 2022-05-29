// Types
import { Players } from '../../utils/types';
import { Board, BoardEntry } from './types';
// Constants
import { VENDAVAL_DE_PALPITE_PHASES } from './constants';
// Utilities
import * as utils from '../../utils';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param roundsToEndGame
 * @param outcome
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  roundsToEndGame: number,
  outcome?: string,
  triggerLastRound?: boolean
): string => {
  const {
    RULES,
    SETUP,
    MASTER_PLAYER_SELECTION,
    SECRET_WORD_SELECTION,
    PLAYERS_CLUES,
    CLUE_EVALUATIONS,
    GAME_OVER,
  } = VENDAVAL_DE_PALPITE_PHASES;
  const order = [
    RULES,
    SETUP,
    MASTER_PLAYER_SELECTION,
    SECRET_WORD_SELECTION,
    PLAYERS_CLUES,
    CLUE_EVALUATIONS,
    GAME_OVER,
  ];
  if (outcome && outcome !== 'CONTINUE') return GAME_OVER;

  if (currentPhase === CLUE_EVALUATIONS) {
    return triggerLastRound || roundsToEndGame <= 0 ? GAME_OVER : PLAYERS_CLUES;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return PLAYERS_CLUES;
};

export const gatherClues = (board: Board, players: Players, currentRound: number): Board => {
  const newBoardEntry: BoardEntry = {
    clues: [],
  };

  Object.values(players).forEach((player) => {
    if (!player.isMaster) {
      player.clues.forEach((clue: string) => {
        newBoardEntry.clues.push({
          playerId: player.id,
          clue,
        });
      });
      (player.guesses ?? []).forEach((clue: string) => {
        newBoardEntry.clues.push({
          playerId: player.id,
          clue,
          isGuess: true,
        });
      });
    }
  });

  board[currentRound] = { clues: utils.helpers.orderBy(newBoardEntry.clues, ['clue'], ['asc']) };

  return board;
};

export const verifyGuesses = (
  latestBoardEntry: BoardEntry,
  finalAnswersLeft: number,
  secretWord: string
): { outcome: string; finalAnswersLeft: number } => {
  const newAnswerCount = latestBoardEntry.clues.filter((clue) => clue.isGuess).length;
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
    (clue) => clue.clue.trim().toUpperCase() === secretWord.toUpperCase() && !clue.isGuess
  );
  if (someoneGotItWrong) {
    return {
      outcome: 'FAIL',
      finalAnswersLeft: newAnswersLeft,
    };
  }

  // WIN if one of the answers is the secret word
  const someoneGotIt = latestBoardEntry.clues.some(
    (clue) => clue.clue.trim().toUpperCase() === secretWord.toUpperCase() && clue.isGuess
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
