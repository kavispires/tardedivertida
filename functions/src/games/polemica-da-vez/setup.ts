// Types
import type { CustomDeck, FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
import { CUSTOM_TOPICS_PER_ROUND, MAX_ROUNDS, POLEMICA_DA_VEZ_PHASES, TOPICS_PER_ROUND } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { buildDeck, countLikes, getRanking } from './helpers';

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
  allTweets: CustomDeck,
): Promise<SaveGamePayload> => {
  // Determine turn order
  // Determine turn order
  const { gameOrder, playerIds } = utils.turnOrder.create(
    players,
    store.options.fixedRounds ? DOUBLE_ROUNDS_THRESHOLD : undefined,
  );
  const totalRounds = store.options.fixedRounds ? gameOrder.length : MAX_ROUNDS;

  // Build deck
  const { deck, customDeck } = buildDeck(allTweets);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

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

/**
 * [TweetCardData Selection Phase] - Active player selects a tweet to react to
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareTweetSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const activePlayerId = utils.turnOrder.getActivePlayerId(store.gameOrder, state.round.current + 1);

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
        round: utils.game.increaseRound(state.round),
        players,
        activePlayerId,
        currentTweets,
        currentCustomTweet,
      },
      stateCleanup: ['currentTweet', 'totalLikes', 'ranking'],
    },
  };
};

/**
 * [React Phase] - Players react to the selected tweet
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareReactPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
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

/**
 * [Resolution Phase] - Calculate total likes and update scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
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
  const winners = utils.players.determineWinners(players);

  await markGameAsComplete(gameId);

  const achievements = calculateAchievements(store.achievements);

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
      storeCleanup: cleanupStore(store, []),
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
