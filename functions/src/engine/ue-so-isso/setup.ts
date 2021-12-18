// Types
import { Players, SaveGamePayload } from '../../utils/types';
import { FirebaseStateData, FirebaseStoreData, AllWords } from './types';
// Constants
import { DOUBLE_ROUNDS_THRESHOLD, UE_SO_ISSO_PHASES } from './constants';
// Helpers
import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import * as utils from '../../utils/helpers';
// Internal
import {
  buildCurrentWords,
  buildDeck,
  determineGroupScore,
  determineScore,
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
  state: FirebaseStateData,
  players: Players,
  allWords: AllWords
): Promise<SaveGamePayload> => {
  // Determine turn order
  const gameOrder = gameUtils.shuffle(Object.keys(players));
  const turnOrder = gameOrder.length <= DOUBLE_ROUNDS_THRESHOLD ? [...gameOrder, ...gameOrder] : gameOrder;

  // Build deck
  const numberOfRounds = turnOrder.length;
  const deck = buildDeck(allWords, numberOfRounds);

  // Save
  return {
    update: {
      store: {
        deck,
        turnOrder,
        gameOrder,
        currentWords: [],
        currentSuggestions: [],
        currentWord: firebaseUtils.deleteValue(),
        guess: firebaseUtils.deleteValue(),
        validSuggestions: {},
      },
      state: {
        phase: UE_SO_ISSO_PHASES.SETUP,
        round: {
          current: 0,
          total: turnOrder.length,
        },
        gameOrder: store.gameOrder,
      },
    },
  };
};

export const prepareWordSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Count points if an outcome was given:
  if (state.guesserId && store.outcome) {
    players[state.guesserId].score += determineScore(store.outcome);
  }

  const roundIndex = state.round.current;
  // Determine guesser based on round and turnOrder
  const guesserId = store.turnOrder[roundIndex];
  const controllerId = store.turnOrder?.[roundIndex + 1] ?? store.turnOrder?.[0];

  // Get current words
  const currentWords = buildCurrentWords(JSON.parse(store.deck[roundIndex]));

  // Unready players and remove any previously used game keys
  const unReadiedPlayers = utils.unReadyPlayers(players, guesserId);
  const removedPropsPlayers = utils.removePropertiesFromPlayers(unReadiedPlayers, ['suggestions', 'votes']);

  const groupScore = determineGroupScore(players, state.round.total);

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
        round: utils.increaseRound(state.round),
        gameOrder: store.gameOrder,
        groupScore,
        guesserId,
        controllerId,
        words: Object.values(currentWords),
        guess: firebaseUtils.deleteValue(),
      },
    },
    set: {
      players: removedPropsPlayers,
    },
  };
};

export const prepareSuggestPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const currentWords = tallyVotes(store.currentWords, players);

  const secretWord = determineSecretWord(currentWords);

  const suggestionsNumber = determineSuggestionsNumber(players);

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
        secretWord,
        suggestionsNumber,
        words: firebaseUtils.deleteValue(),
      },
    },
    set: {
      players: utils.unReadyPlayers(players, state.guesserId),
    },
  };
};

export const prepareComparePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const currentSuggestions = groupSuggestions(players);

  const suggestionsArray = validateSuggestions(currentSuggestions);

  const shuffledSuggestions = gameUtils.shuffle(suggestionsArray);

  // Save
  return {
    update: {
      // TODO: save suggestions to store then to global
      // store: {},
      state: {
        phase: UE_SO_ISSO_PHASES.COMPARE,
        suggestions: shuffledSuggestions,
        suggestionsNumber: firebaseUtils.deleteValue(),
      },
    },
  };
};

export const prepareGuessPhase = async (store: FirebaseStoreData): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: UE_SO_ISSO_PHASES.GUESS,
        validSuggestions: store.validSuggestions,
        suggestions: firebaseUtils.deleteValue(),
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Count points if any:
  if (state.guesserId && store.outcome) {
    players[state.guesserId].score += determineScore(store.outcome);
  }

  const groupScore = determineGroupScore(players, state.round.total);

  // Save
  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      state: {
        phase: UE_SO_ISSO_PHASES.GAME_OVER,
        gameEndedAt: Date.now(),
        group: {
          score: groupScore,
          victory: groupScore > 70,
        },
      },
    },
  };
};
