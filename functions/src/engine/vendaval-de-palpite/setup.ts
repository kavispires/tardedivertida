// Constants
import { CLUES_PER_PLAYER, FINAL_ANSWER_COUNT, MAX_ROUNDS, VENDAVAL_DE_PALPITE_PHASES } from './constants';
// Types
import { Board, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils';
import { gatherClues, verifyGuesses } from './helpers';
// Internal

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      store: {
        words: resourceData.words,
        categories: resourceData.categories,
      },
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
      },
      players,
    },
  };
};

export const prepareMasterPlayerSelection = async (): Promise<SaveGamePayload> => {
  // Save
  return {
    set: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.MASTER_PLAYER_SELECTION,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
      },
    },
  };
};

export const prepareSecretWordSelection = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayer(players, state.masterId);

  players[state.masterId].isMaster = true;

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION,
        words: store.words,
        categories: store.categories,
        finalAnswersLeft: FINAL_ANSWER_COUNT,
        cluesPerPlayer: CLUES_PER_PLAYER[Object.keys(players).length],
      },
      players,
    },
  };
};

export const preparePlayersClues = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players, state.masterId);

  // Added master result if any
  const board: Board = { ...(state?.board ?? {}) };
  if (state.round.current > 0) {
    board[state.round.current].evaluation = state.currentEvaluation;
  }

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES,
        round: utils.helpers.increaseRound(state.round),
        words: utils.firebase.deleteValue(),
        outcome: utils.firebase.deleteValue(),
        board,
      },
      players,
    },
  };
};

export const prepareClueEvaluations = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players, state.masterId);

  // Gather clues
  const board = gatherClues(state.board, players, state.round.current);

  const latestBoardEntry = board[state.round.current];
  const { outcome, finalAnswersLeft } = verifyGuesses(
    latestBoardEntry,
    state.finalAnswersLeft,
    state.secretWord
  );

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS,
        board,
        outcome,
        finalAnswersLeft,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  /**
   * Players win if
   * - They found the Secret Word using a Red Card
   * Players lose if
   * - Used all their Red Cards without getting it correctly
   * - Wrote the Secret Word during guesses
   * - Did not guess within 7 rounds
   */

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        board: state.board,
        secretWord: state.secretWord,
        finalAnswersLeft: state.finalAnswersLeft,
        categories: state.categories,
        outcome: state.outcome ?? 'FAIL',
      },
    },
  };
};
