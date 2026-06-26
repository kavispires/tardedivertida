import { keyBy, sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { DESCRIPTORS_PER_PLAYER, MEDIDAS_NAO_EXATAS_PHASES, WORDS_PER_PLAYER } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  setPlayersReadyState,
  getListOfPlayersIds,
  removePropertiesFromPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Utils
import { makeArray } from '../../utils';
// Internal
import { dealItems } from '../../legacy-utils/legacy';
import { calculateAchievements, setupAchievements } from './achievements';
import { determineResults } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(getListOfPlayersIds(players));

  const { playerIds: turnOrder, gameOrder } = turnOrderUtils.create(players, 4);

  const wordsDeck = sampleSize(additionalData.allWords, WORDS_PER_PLAYER * gameOrder.length);
  const descriptorsDeck = sampleSize(
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

/**
 * [Metrics Building Phase] - The presenter builds metrics for their secret word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareMetricsBuildingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  removePropertiesFromPlayers(players, ['guesses']);

  const round = increaseRound(state.round);
  const presenterId = turnOrderUtils.getActivePlayerId(state.turnOrder, round.current);

  // Unready presenter only
  setPlayersReadyState(players, true, { excludeIds: [presenterId] });

  const wordsDeck: TextCardData[] = store.wordsDeck;
  // Get active words and other in the pool
  const roundCards = dealItems(wordsDeck, WORDS_PER_PLAYER);
  const wordsDict = keyBy(roundCards, 'id');
  const roundCardsIds = Object.keys(wordsDict);

  const secretCardsOptionsIds = roundCardsIds.slice(0, 4);
  const availablePoolCardsIds = roundCardsIds.slice(4);

  // Build descriptions
  const descriptorsDeck: TextCardData[] = store.descriptorsDeck || [];
  const metricsDescriptors = {
    0: dealItems(descriptorsDeck, 2),
    1: dealItems(descriptorsDeck, 2),
    2: dealItems(descriptorsDeck, 2),
    3: dealItems(descriptorsDeck, 2),
    4: dealItems(descriptorsDeck, 2),
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

/**
 * [Guessing Phase] - Players guess which word matches the metrics
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready everyone
  const presenterId: UID = state.presenterId;
  setPlayersReadyState(players, false, { excludeIds: [presenterId] });

  // Remove any words in the wordsDict that are not in the pool
  const poolIds: UID[] = state.poolIds;
  const wordsDict: Dictionary<TextCardData> = state.wordsDict;

  Object.keys(wordsDict).forEach((wordId) => {
    if (!poolIds.includes(wordId as UID)) {
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

/**
 * [Results Phase] - Calculate and display round results
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

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
  // Unready players
  setPlayersReadyState(players, false);

  const winners = determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
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
      storeCleanup: cleanupStore(store, []),
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
