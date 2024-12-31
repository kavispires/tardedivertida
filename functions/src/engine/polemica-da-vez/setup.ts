// Constants
import { CUSTOM_TOPICS_PER_ROUND, MAX_ROUNDS, POLEMICA_DA_VEZ_PHASES, TOPICS_PER_ROUND } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Utils
import utils from '../../utils';
import { buildDeck, countLikes, getAchievements, getRanking } from './helpers';

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
  allTweets: PlainObject,
): Promise<SaveGamePayload> => {
  // Determine turn order
  // Determine turn order
  const { gameOrder, playerIds } = utils.players.buildGameOrder(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined,
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;

  // Build deck
  const { deck, customDeck } = buildDeck(allTweets);

  const achievements = utils.achievements.setup(players, store, {
    likes: 0,
    exactGuesses: 0,
    almostGuesses: 0,
    guessDistance: 0,
  });

  // Save
  return {
    update: {
      store: {
        gameOrder,
        deck,
        customDeck,
        deckIndex: 0,
        customDeckIndex: 0,
        pastTweets: [],
        achievements,
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

export const prepareTweetSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
  const currentTweets = Array(TOPICS_PER_ROUND)
    .fill(store.deckIndex)
    .map((deckIndex, index) => store.deck[deckIndex + index]);

  const currentCustomTweet = store.customDeck[store.customDeckIndex];

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
        players,
        activePlayerId,
        currentTweets,
        currentCustomTweet,
      },
      stateCleanup: ['currentTweet', 'totalLikes', 'ranking'],
    },
  };
};

export const prepareReactPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Modify players
  utils.players.unReadyPlayers(players);

  let currentTweet = {};
  const customTweet = store.customTweet ?? null;
  if (customTweet) {
    currentTweet = store.customDeck.find((tweet) => tweet.id === store.tweetId);
  } else {
    currentTweet = store.deck.find((tweet) => tweet.id === store.tweetId);
  }

  // Save
  return {
    update: {
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.REACT,
        players,
        currentTweet,
        customTweet,
      },
      stateCleanup: ['currentTweets', 'currentCustomTweet'],
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather all reactions
  const totalLikes = countLikes(players, store);

  utils.players.unReadyPlayers(players);

  // Score players
  const ranking = getRanking(players, totalLikes, store);

  const pastTweets = [
    ...store.pastTweets,
    state.customTweet
      ? { text: state.customTweet, id: `custom-${state.customTweet}`, likes: totalLikes }
      : { ...state.currentTweet, likes: totalLikes },
  ];

  // Save
  return {
    update: {
      store: {
        pastTweets,
        achievements: store.achievements,
      },
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.RESOLUTION,
        players,
        totalLikes,
        ranking,
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
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

  const achievements = getAchievements(store);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.POLEMICA_DA_VEZ,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: POLEMICA_DA_VEZ_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        allTweets: store.pastTweets,
        achievements,
      },
    },
  };
};
