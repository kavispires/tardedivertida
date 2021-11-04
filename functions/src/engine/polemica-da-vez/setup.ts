// Constants
import { CUSTOM_TOPICS_PER_ROUND, MAX_ROUNDS, POLEMICA_DA_VEZ_PHASES, TOPICS_PER_ROUND } from './constants';
// Interfaces
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
// Utils
import * as firebaseUtils from '../../utils/firebase';
import * as utils from '../../utils/helpers';
import * as gameUtils from '../../utils/game-utils';
import { buildDeck, countLikes, rankAndScore } from './helpers';

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
  additionalData: PlainObject
): Promise<SaveGamePayload> => {
  // Determine turn order
  const gameOrder = gameUtils.shuffle(Object.keys(players));

  // Build deck
  const { deck, customDeck } = buildDeck(additionalData.allTopics);

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
        updatedAt: Date.now(),
        gameOrder,
        round: {
          current: 0,
          total: MAX_ROUNDS,
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
  const activePlayer = utils.getActivePlayer(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.addPropertiesFromPlayers(players, {
    reaction: null,
    likesGuess: null,
  });
  utils.unReadyPlayer(players, activePlayer);

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
        updatedAt: Date.now(),
        round: utils.increaseRound(state.round),
        activePlayer,
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
  utils.unReadyPlayers(players);

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
        updatedAt: Date.now(),
        currentTopic,
        customTopic,
        currentTopics: firebaseUtils.deleteValue(),
        currentCustomTopic: firebaseUtils.deleteValue(),
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

  // Save
  return {
    update: {
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.RESOLUTION,
        updatedAt: Date.now(),
        currentTopics: firebaseUtils.deleteValue(),
        currentCustomTopic: firebaseUtils.deleteValue(),
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
  const winners = utils.determineWinners(players);

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
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
      },
    },
  };
};
