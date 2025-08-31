// Types
import type { TextCard } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
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
import { GAME_NAMES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
// Internal
import {
  buildCurrentWords,
  buildDeck,
  countAchievements,
  determineSecretWord,
  determineSuggestionsNumber,
  getAchievements,
  groupSuggestions,
  tallyVotes,
  validateSuggestions,
} from './helpers';
import { saveData } from './data';
import { orderBy } from 'lodash';

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
  allWords: TextCard[],
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.players.buildGameOrder(players);

  // Build deck
  const deck = buildDeck(
    allWords,
    MAX_ROUNDS,
    store.options.fewerCards ? WORDS_PER_CARD - 2 : WORDS_PER_CARD,
  );

  const achievements = utils.achievements.setup(players, {
    eliminatedClues: 0,
    clueLength: 0,
    passes: 0,
    correctGuesses: [],
    wrongGuesses: [],
  });

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

export const prepareWordSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);

  // Determine guesser based on round and gameOrder
  const guesserId = utils.players.getActivePlayer(state.gameOrder, round.current);
  const controllerId = utils.players.getActivePlayer(state.gameOrder, round.current + 1);

  // Get current words
  const currentWords = buildCurrentWords(JSON.parse(store.deck[round.current - 1]));

  // Unready players and remove any previously used game keys
  utils.players.unReadyPlayers(players, guesserId);
  utils.players.removePropertiesFromPlayers(players, ['suggestions', 'votes']);

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

export const prepareSuggestPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const currentWords = tallyVotes(store.currentWords, players);

  const secretWord = determineSecretWord(currentWords);

  const suggestionsNumber = determineSuggestionsNumber(players);

  utils.players.unReadyPlayers(players, state.guesserId);

  utils.players.removePropertiesFromPlayers(players, ['votes']);

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

export const prepareComparePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const currentSuggestions = groupSuggestions(players);

  const suggestionsArray = validateSuggestions(currentSuggestions);

  const shuffledSuggestions = utils.game.shuffle(suggestionsArray);

  utils.players.readyPlayers(players, state.controllerId);

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

export const prepareGuessPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players, state.guesserId);

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

export const prepareVerifyGuessPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players, state.controllerId);

  // Check guess, if correct, build result, if incorrect, idk
  const { group, guess, secretWord } = state;
  const index = state.round.current - 1;
  const cleanGuess = utils.helpers.stringRemoveAccents(guess).toLowerCase().trim();
  const cleanWord = utils.helpers.stringRemoveAccents(secretWord.text).toLowerCase().trim();
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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Count points if any:
  players[state.guesserId].score += state.group.score;

  if (state.group.outcome === OUTCOME.CONTINUE) {
    state.group.outcome = OUTCOME.LOSE;
  }

  const winners = state.win ? utils.players.getListOfPlayers(players) : [];

  // Handle achievements
  countAchievements(store);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
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

  utils.players.cleanup(players, []);

  // Save
  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
