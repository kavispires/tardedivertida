// Constants
import { CLUES_PER_PLAYER, FINAL_ANSWER_COUNT, MAX_ROUNDS, VENDAVAL_DE_PALPITE_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { Board, ClueId, Clues, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { gatherClues, verifyGuesses } from './helpers';

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
        players,
      },
    },
  };
};

export const prepareBossPlayerSelection = async (): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION,
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
  utils.players.unReadyPlayer(players, state.bossId);

  players[state.bossId].isBoss = true;

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION,
        players,
        words: store.words,
        categories: store.categories,
        finalAnswersLeft: FINAL_ANSWER_COUNT,
        cluesPerPlayer: CLUES_PER_PLAYER[utils.players.getPlayerCount(players)],
      },
    },
  };
};

export const preparePlayersClues = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players, state.bossId);

  const board: Board = { ...(state?.board ?? {}) };
  const clues: Clues = { ...(state?.clues ?? {}) };

  if (state.currentClues) {
    const currentClues: Record<ClueId, boolean> = state.currentClues;
    Object.keys(currentClues).forEach((clueId) => {
      clues[clueId].evaluation = currentClues[clueId];
    });
    board[state.round.current].evaluation = state.currentEvaluation;
  }

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES,
        players,
        round: utils.helpers.increaseRound(state.round),
        board,
        clues,
      },
      stateCleanup: ['words', 'outcome', 'currentClues'],
    },
  };
};

export const prepareClueEvaluations = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players, state.bossId);

  // Gather clues
  const { clues, board } = gatherClues(state.clues, state.board, players, state.round.current);

  const latestBoardEntry = board[state.round.current];
  const { outcome, finalAnswersLeft } = verifyGuesses(
    clues,
    latestBoardEntry,
    state.finalAnswersLeft,
    state.secretWord
  );

  if (['WIN', 'FAIL'].includes(outcome)) {
    const newState = {
      ...state,
      clues,
      board,
      outcome,
      finalAnswersLeft,
    };
    return prepareGameOverPhase(gameId, store, newState, players);
  }

  // Save
  return {
    update: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS,
        players,
        clues,
        board,
        outcome,
        finalAnswersLeft,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
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

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.VENDAVAL_DE_PALPITE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners: [],
    achievements: [],
    language: store.language,
  });

  return {
    set: {
      state: {
        phase: VENDAVAL_DE_PALPITE_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        board: state.board,
        clues: state.clues,
        secretWord: state.secretWord,
        finalAnswersLeft: state.finalAnswersLeft,
        categories: state.categories,
        outcome: state.outcome ?? 'FAIL',
      },
    },
  };
};
