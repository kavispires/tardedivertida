// Constants
import { DESCRIPTORS_PER_PLAYER, MEDIDAS_NAO_EXATAS_PHASES, WORDS_PER_PLAYER } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData } from './types';
// Utils
import utils from '../../utils';
import type { TextCard } from '../../types/tdr';
import { GAME_NAMES } from '../../utils/constants';
import { determineResults, getAchievements } from './helpers';
import { keyBy } from 'lodash';
import { makeArray } from '../../utils/game-utils';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, {
    doubleGuesses: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    badMetrics: 0,
    bestMetrics: 0,
  });

  const { playerIds: turnOrder, gameOrder } = utils.players.buildGameOrder(players, 4);

  const wordsDeck = utils.game.getRandomItems(additionalData.allWords, WORDS_PER_PLAYER * gameOrder.length);
  const descriptorsDeck = utils.game.getRandomItems(
    additionalData.allDescriptors,
    DESCRIPTORS_PER_PLAYER * gameOrder.length,
  );

  const pointsBrackets = makeArray(Math.min(Math.floor(turnOrder.length * 1.5), 10), 2).reverse();
  if (pointsBrackets.length < 5) {
    pointsBrackets.push(...makeArray(5 - pointsBrackets.length, 2));
  }

  // Save
  return {
    update: {
      store: {
        wordsDeck,
        descriptorsDeck,
        achievements,
      },
      state: {
        phase: MEDIDAS_NAO_EXATAS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: gameOrder.length,
        },
        turnOrder,
        pointsBrackets,
      },
    },
  };
};

export const prepareMetricsBuildingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['guesses']);

  const round = utils.helpers.increaseRound(state.round);
  const presenterId = utils.players.getActivePlayer(state.turnOrder, round.current);

  // Unready presenter only
  utils.players.readyPlayers(players, presenterId);

  const wordsDeck: TextCard[] = store.wordsDeck;
  // Get active words and other in the pool
  const roundCards = utils.game.dealItems(wordsDeck, WORDS_PER_PLAYER);
  const wordsDict = keyBy(roundCards, 'id');
  const roundCardsIds = Object.keys(wordsDict);

  const secretCardsOptionsIds = roundCardsIds.slice(0, 2);
  const availablePoolCardsIds = roundCardsIds.slice(2);

  // Build descriptions
  const descriptorsDeck: TextCard[] = store.descriptorsDeck || [];
  const metricsDescriptors = {
    0: utils.game.dealItems(descriptorsDeck, 2),
    1: utils.game.dealItems(descriptorsDeck, 2),
    2: utils.game.dealItems(descriptorsDeck, 2),
    3: utils.game.dealItems(descriptorsDeck, 2),
    4: utils.game.dealItems(descriptorsDeck, 2),
  };

  // Save
  return {
    update: {
      store: {
        wordsDeck,
        descriptorsDeck,
      },
      state: {
        phase: MEDIDAS_NAO_EXATAS_PHASES.METRICS_BUILDING,
        players,
        round,
        presenterId,
        wordsDict,
        secretCardsOptionsIds,
        availablePoolCardsIds,
        metricsDescriptors,
      },
      stateCleanup: ['result', 'ranking'],
    },
  };
};

export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready everyone
  const presenterId: PlayerId = state.presenterId;
  utils.players.unReadyPlayers(players, presenterId);

  // Remove any words in the wordsDict that are not in the pool
  const poolIds: CardId[] = state.poolIds;
  const wordsDict: Dictionary<TextCard> = state.wordsDict;

  Object.keys(wordsDict).forEach((wordId) => {
    if (!poolIds.includes(wordId as CardId)) {
      delete wordsDict[wordId];
    }
  });

  // Save
  return {
    update: {
      state: {
        phase: MEDIDAS_NAO_EXATAS_PHASES.GUESSING,
        players,
        wordsDict,
      },
      stateCleanup: ['secretCardsOptionsIds', 'availablePoolCardsIds'],
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const { result, ranking } = determineResults(
    players,
    state.presenterId,
    state.secretWordId,
    state.wordsDict,
    store,
    state.metricsDescriptors,
    state.metrics,
    state.pointsBrackets,
  );

  const gallery: GalleryEntry[] = store.gallery || [];
  gallery.push(result);

  // Save
  return {
    update: {
      store: {
        gallery,
        achievements: store.achievements,
      },
      state: {
        phase: MEDIDAS_NAO_EXATAS_PHASES.RESULTS,
        players,
        result,
        ranking,
      },
      stateCleanup: ['metricsDescriptors', 'metrics', 'wordsDict', 'poolIds', 'secretWordId'],
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.MEDIDAS_NAO_EXATAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  // Save
  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: MEDIDAS_NAO_EXATAS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
      },
    },
  };
};
