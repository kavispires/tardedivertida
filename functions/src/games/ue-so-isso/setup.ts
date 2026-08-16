import { orderBy, shuffle } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  ALLOWED_MISTAKES,
  CORRECT_GUESS_SCORE,
  GOAL,
  INCORRECT_GUESS_SCORE,
  MAX_ROUNDS,
  OUTCOME,
  UE_SO_ISSO_PHASES,
  WORDS_PER_CARD,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  removePropertiesFromPlayers,
  setPlayersReadyState,
  getListOfPlayers,
  getListOfPlayersIds,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Utils
import { stringRemoveAccents } from '../../utils';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { saveData } from './data';
import {
  buildCurrentWords,
  buildDeck,
  countAchievements,
  determineSecretWord,
  determineSuggestionsNumber,
  groupSuggestions,
  tallyVotes,
  validateSuggestions,
} from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  allWords: TextCardData[],
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = turnOrderUtils.create(players);

  // Build deck
  const deck = buildDeck(
    allWords,
    MAX_ROUNDS,
    store.options.fewerCards ? WORDS_PER_CARD - 2 : WORDS_PER_CARD,
  );

  const achievements = setupAchievements(getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck,
        gameOrder,
        achievements,
        currentWords: [],
        currentSuggestions: [],
        validSuggestions: {},
        pastSuggestions: [],
      },
      state: {
        phase: UE_SO_ISSO_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        group: {
          correct: 0,
          mistakes: 0,
          outcome: OUTCOME.CONTINUE,
          attempts: [],
          score: 0,
          goal: GOAL,
        },
        gameOrder,
      },
      storeCleanup: ['currentWord', 'guess'],
    },
  };
};

/**
 * [Word Selection Phase] - Active player selects secret word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareWordSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = increaseRound(state.round);

  // Determine guesser based on round and gameOrder
  const guesserId = turnOrderUtils.getActivePlayerId(state.gameOrder, round.current);
  const controllerId = turnOrderUtils.getActivePlayerId(state.gameOrder, round.current + 1);

  // Get current words
  const currentWords = buildCurrentWords(JSON.parse(store.deck[round.current - 1]));

  // Unready players and remove any previously used game keys
  setPlayersReadyState(players, false, { excludeIds: [guesserId] });
  removePropertiesFromPlayers(players, ['suggestions', 'votes']);

  // Save
  return {
    update: {
      store: {
        currentWords,
        currentSuggestions: {},
        validSuggestions: [],
        outcome: null,
      },
      state: {
        phase: UE_SO_ISSO_PHASES.WORD_SELECTION,
        players,
        round,
        guesserId,
        controllerId,
        words: Object.values(currentWords),
      },
      stateCleanup: ['guess'],
      storeCleanup: ['outcome'],
    },
  };
};

/**
 * [Suggest Phase] - Players suggest clues for the secret word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareSuggestPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const currentWords = tallyVotes(store.currentWords, players);

  const secretWord = determineSecretWord(currentWords);

  const suggestionsNumber = determineSuggestionsNumber(players);

  setPlayersReadyState(players, false, { excludeIds: [state.guesserId] });

  removePropertiesFromPlayers(players, ['votes']);

  // Save
  return {
    update: {
      store: {
        usedWords: {
          ...store.usedWords,
          ...{ [secretWord.id]: secretWord },
        },
        currentWord: secretWord,
      },
      state: {
        phase: UE_SO_ISSO_PHASES.SUGGEST,
        players,
        secretWord,
        suggestionsNumber,
      },
      stateCleanup: ['words', 'suggestions'],
    },
  };
};
/**
 * [Compare Phase] - Players compare and group their clues
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareComparePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const currentSuggestions = groupSuggestions(players);

  const suggestionsArray = validateSuggestions(currentSuggestions);

  const shuffledSuggestions = shuffle(suggestionsArray);

  setPlayersReadyState(players, true, { excludeIds: [state.controllerId] });

  // Save
  return {
    update: {
      state: {
        phase: UE_SO_ISSO_PHASES.COMPARE,
        players,
        suggestions: shuffledSuggestions,
      },
      stateCleanup: ['suggestionsNumber'],
    },
  };
};
/**
 * [Guess Phase] - Active player guesses based on clues
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareGuessPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, true, { excludeIds: [state.guesserId] });

  // Save
  return {
    update: {
      state: {
        phase: UE_SO_ISSO_PHASES.GUESS,
        players,
        validSuggestions: store.validSuggestions,
      },
    },
  };
};
/**
 * [Verify Guess Phase] - Players verify if the guess was correct
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareVerifyGuessPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  setPlayersReadyState(players, true, { excludeIds: [state.controllerId] });

  // Check guess, if correct, build result, if incorrect, idk
  const { group, guess, secretWord } = state;
  const index = state.round.current - 1;
  const cleanGuess = stringRemoveAccents(guess).toLowerCase().trim();
  const cleanWord = stringRemoveAccents(secretWord.text).toLowerCase().trim();
  if (cleanGuess === cleanWord) {
    group.attempts[index] = OUTCOME.CORRECT;
    group.score += CORRECT_GUESS_SCORE;
    group.outcome = OUTCOME.CONTINUE;

    if (group.score >= GOAL) {
      group.outcome = OUTCOME.WIN;
    }
  } else {
    group.attempts[index] = OUTCOME.INCONCLUSIVE;
    group.outcome = OUTCOME.INCONCLUSIVE;
  }

  // If outcome is good, skip verify guess
  if (group.outcome !== OUTCOME.INCONCLUSIVE) {
    return prepareResultPhase(store, state, players);
  }

  // Save
  return {
    update: {
      state: {
        phase: UE_SO_ISSO_PHASES.VERIFY_GUESS,
        players,
        group,
      },
    },
  };
};

/**
 * [Result Phase] - Display round results and update scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const pastSuggestions = [
    ...store.pastSuggestions,
    {
      ...state.secretWord,
      suggestions: orderBy(state.suggestions, ['invalid'], ['asc']),
      guesserId: state.guesserId,
    },
  ];

  // Check guess, if correct, build result, if incorrect, idk
  const { group } = state;
  const index = state.round.current - 1;

  group.outcome = OUTCOME.CONTINUE;

  if (group.attempts[index] === OUTCOME.CORRECT) {
    pastSuggestions[index].outcome = OUTCOME.CORRECT;

    if (group.score >= GOAL) {
      group.outcome = OUTCOME.WIN;
    }
  }

  if (store.outcome === OUTCOME.PASS) {
    group.attempts[index] = OUTCOME.PASS;
    pastSuggestions[index].outcome = OUTCOME.PASS;
  }

  if (store.outcome === OUTCOME.CORRECT) {
    group.attempts[index] = OUTCOME.CORRECT;
    group.score += CORRECT_GUESS_SCORE;
    pastSuggestions[index].outcome = OUTCOME.CORRECT;

    if (group.score >= GOAL) {
      group.outcome = OUTCOME.WIN;
    }
  }

  if (store.outcome === OUTCOME.WRONG) {
    group.attempts[index] = OUTCOME.WRONG;
    group.mistakes += 1;
    group.score += INCORRECT_GUESS_SCORE;
    pastSuggestions[index].outcome = OUTCOME.WRONG;

    if (group.mistakes >= ALLOWED_MISTAKES) {
      group.outcome = OUTCOME.LOSE;
    }
  }

  // Save
  return {
    update: {
      store: {
        pastSuggestions,
      },
      state: {
        phase: UE_SO_ISSO_PHASES.RESULT,
        players,
        group,
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
  // Count points if any:
  players[state.guesserId].score += state.group.score;

  if (state.group.outcome === OUTCOME.CONTINUE) {
    state.group.outcome = OUTCOME.LOSE;
  }

  const winners = state.win ? getListOfPlayers(players) : [];

  // Handle achievements
  countAchievements(store);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.UE_SO_ISSO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  await saveData(store.pastSuggestions, store.language);

  // Create gallery
  const gallery = store.pastSuggestions;

  cleanupPlayers(players, []);

  // Save
  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: UE_SO_ISSO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        group: state.group,
        gallery,
        achievements,
      },
    },
  };
};
