// Types
import type { FirebaseStateData, FirebaseStoreData, AllWords } from './types';
// Constants
import { UE_SO_ISSO_PHASES } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Helpers
import utils from '../../utils';
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
  const { gameOrder: turnOrder, playerIds: gameOrder } = utils.players.buildGameOrder(
    players,
    DOUBLE_ROUNDS_THRESHOLD
  );

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
      storeCleanup: ['currentWord', 'guess'],
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
  utils.players.unReadyPlayers(players, guesserId);
  utils.players.removePropertiesFromPlayers(players, ['suggestions', 'votes']);

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
        players,
        round: utils.helpers.increaseRound(state.round),
        gameOrder: store.gameOrder,
        groupScore,
        guesserId,
        controllerId,
        words: Object.values(currentWords),
      },
      stateCleanup: ['guess'],
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

  utils.players.unReadyPlayers(players, state.guesserId);

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
      stateCleanup: ['words'],
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

  const shuffledSuggestions = utils.game.shuffle(suggestionsArray);

  utils.players.readyPlayers(players, state.controllerId);
  // Save
  return {
    update: {
      // TODO: save suggestions to store then to global
      // store: {},
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
  players: Players
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
      stateCleanup: ['suggestions'],
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Count points if any:
  if (state.guesserId && store.outcome) {
    players[state.guesserId].score += determineScore(store.outcome);
  }

  const groupScore = determineGroupScore(players, state.round.total);

  const winners = groupScore > 70 ? utils.players.getListOfPlayers(players) : [];

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.UE_SO_ISSO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  // Save
  return {
    set: {
      state: {
        phase: UE_SO_ISSO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        group: {
          score: groupScore,
          victory: groupScore > 70,
        },
      },
    },
  };
};
