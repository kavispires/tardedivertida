// Types
import type { Board, ClueId, Clues, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { CLUES_PER_PLAYER, FINAL_ANSWER_COUNT, MAX_ROUNDS, VENDAVAL_DE_PALPITE_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import { setPlayersReadyState, getPlayerCount } from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
// Internal
import { gatherClues, verifyGuesses } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @param _store - Unused server-side game data
 * @param _state - Unused current game state
 * @param players - The players participating in this game step
 * @param resourceData - The resources loaded for game setup
 * @returns The state and store changes for this phase
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
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

/**
 * Resets the round counter and enters the boss-selection phase.
 * @returns The state changes for boss selection
 */
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

/**
 * Marks the selected boss and exposes the words, categories, and guessing limits for secret-word selection.
 * @param store - The server-side game data used for this step
 * @param state - The current game state
 * @param players - The players participating in this game step
 * @returns The state changes for secret-word selection
 */
export const prepareSecretWordSelection = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false, { excludeIds: [state.bossId] });

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
        cluesPerPlayer: CLUES_PER_PLAYER[getPlayerCount(players)],
      },
    },
  };
};

/**
 * Archives the previous boss evaluation and starts a new round of player clues.
 * @param _store - Unused server-side game data
 * @param state - The current game state
 * @param players - The players participating in this game step
 * @returns The state changes for clue submission
 */
export const preparePlayersClues = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, false, { excludeIds: [state.bossId] });

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
        round: increaseRound(state.round),
        board,
        clues,
      },
      stateCleanup: ['words', 'outcome', 'currentClues'],
    },
  };
};

/**
 * Gathers the round's clues and resolves final guesses before requesting the boss's evaluations.
 * @param gameId - The identifier of the game session
 * @param store - The server-side game data used for this step
 * @param state - The current game state
 * @param players - The players participating in this game step
 * @returns The clue-evaluation changes, or game-over changes when the guesses finish the game
 */
export const prepareClueEvaluations = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Ready players, but boss
  setPlayersReadyState(players, true, { excludeIds: [state.bossId] });

  // Gather clues
  const { clues, board } = gatherClues(state.clues, state.board, players, state.round.current);

  const latestBoardEntry = board[state.round.current];
  const { outcome, finalAnswersLeft } = verifyGuesses(
    clues,
    latestBoardEntry,
    state.finalAnswersLeft,
    state.secretWord,
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

/**
 * [Game Over Phase] - Finalize game and save results
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  /**
   * Players win if
   * - They found the Secret Word using a Red Card
   * Players lose if
   * - Used all their Red Cards without getting it correctly
   * - Wrote the Secret Word during guesses
   * - Did not guess within 7 rounds
   */

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.VENDAVAL_DE_PALPITE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners: [],
    achievements: [],
    language: store.language,
  });

  return {
    update: {
      store: cleanupStore(store, []),
    },
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
