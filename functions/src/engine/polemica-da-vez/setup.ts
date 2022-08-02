// Constants
import { CUSTOM_TOPICS_PER_ROUND, MAX_ROUNDS, POLEMICA_DA_VEZ_PHASES, TOPICS_PER_ROUND } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Utils
import * as utils from '../../utils';
import { buildDeck, countLikes, rankAndScore } from './helpers';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';

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
  allTopics: PlainObject
): Promise<SaveGamePayload> => {
  // Determine turn order
  // Determine turn order
  const { gameOrder, playerIds } = utils.helpers.buildGameOrder(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;

  // Build deck
  const { deck, customDeck } = buildDeck(allTopics);

  // Save
  return {
    update: {
      store: {
        gameOrder,
        deck,
        customDeck,
        deckIndex: 0,
        customDeckIndex: 0,
        pastTopics: [],
      },
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.SETUP,
        gameOrder: playerIds,
        round: {
          current: 0,
          total: totalRounds,
        },
      },
    },
  };
};

export const prepareTopicSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const activePlayerId = utils.players.getActivePlayer(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.players.addPropertiesToPlayers(players, {
    reaction: null,
    likesGuess: null,
  });
  utils.players.unReadyPlayer(players, activePlayerId);

  // Get questions
  const currentTopics = Array(TOPICS_PER_ROUND)
    .fill(store.deckIndex)
    .map((deckIndex, index) => store.deck[deckIndex + index]);

  const currentCustomTopic = store.customDeck[store.customDeckIndex];

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + TOPICS_PER_ROUND,
        customDeckIndex: store.customDeckIndex + CUSTOM_TOPICS_PER_ROUND,
      },
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.TOPIC_SELECTION,
        round: utils.helpers.increaseRound(state.round),
        activePlayerId,
        currentTopics,
        currentCustomTopic,
      },
      players,
    },
  };
};

export const prepareReactPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Modify players
  utils.players.unReadyPlayers(players);

  let currentTopic = {};
  const customTopic = store.customTopic ?? null;
  if (customTopic) {
    currentTopic = store.customDeck.find((topic) => topic.id === store.topicId);
  } else {
    currentTopic = store.deck.find((topic) => topic.id === store.topicId);
  }

  // Save
  return {
    update: {
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.REACT,
        currentTopic,
        customTopic,
        currentTopics: utils.firebase.deleteValue(),
        currentCustomTopic: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather all reactions
  const totalLikes = countLikes(players);

  // Score players
  const ranking = rankAndScore(players, totalLikes);

  const pastTopics = [
    ...store.pastTopics,
    state.customTopic
      ? { ...state.customTopic, likes: totalLikes }
      : { ...state.currentTopic, likes: totalLikes },
  ];

  // Save
  return {
    update: {
      store: {
        pastTopics,
      },
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.RESOLUTION,
        totalLikes,
        ranking,
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
  const winners = utils.players.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        allTopics: store.pastTopics,
      },
    },
  };
};
