// Types
import type { ResourceData, FirebaseStateData, FirebaseStoreData, ArteRuimGameOptions } from './types';
import type { ArteRuimCard } from '../../types/tdr';
import { cloneDeep, orderBy, shuffle } from 'lodash';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ARTE_RUIM_PHASES, GAME_OVER_SCORE_THRESHOLD } from './constants';
// Helpers
import utils from '../../utils';
import {
  buildDeck,
  buildGallery,
  buildRanking,
  dealCards,
  determineLevelType,
  getGameSettings,
  getNewPastDrawings,
  getTwoUniquePairCards,
} from './helpers';
import { saveUsedCards } from './data';
import { setupAchievements, calculateAchievements } from './achievements';

/**
 * Setup phase - builds the card deck and initializes game settings
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data containing cards and themes
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Get number of cards per level
  const playerCount = utils.players.getPlayerCount(players);

  // Update rounds
  const options = store.options as ArteRuimGameOptions;
  const { MAX_ROUNDS, LEVELS } = getGameSettings(options);

  // Build deck
  const deck = buildDeck(resourceData, playerCount, LEVELS);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  const threshold = options.forPoints ? (GAME_OVER_SCORE_THRESHOLD?.[playerCount] ?? 100) : 0;

  // Save
  return {
    update: {
      store: {
        deck,
        pastDrawings: [],
        currentCards: [],
        achievements,
        levels: LEVELS,
        specialLevels: resourceData.specialLevels?.types ?? [],
      },
      state: {
        round: {
          ...state.round,
          total: MAX_ROUNDS,
        },
        threshold,
      },
    },
  };
};

/**
 * Draw phase - deals cards to players for the current round
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDrawPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Remove previous 'votes' from players
  utils.players.removePropertiesFromPlayers(players, ['votes']);

  // Deal cards
  dealCards(players, store);

  const level = store.levels[state.round.current];
  const levelType = determineLevelType(level, store.specialLevels, store.levels, state.round.current);

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.DRAW,
        round: utils.game.increaseRound(state?.round),
        players,
        level,
        levelType,
      },
    },
  };
};

/**
 * Evaluation phase - prepares players to vote on which drawing matches which card
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['choseRandomly']);

  const level = store.currentCards?.[0]?.level ?? 1;

  // Shuffle cards
  const shuffledCards: ArteRuimCard[] =
    level === 4 ? getTwoUniquePairCards(store.currentCards) : shuffle(store.currentCards);

  // Shuffle drawings
  const shuffledDrawings = shuffle(
    utils.players.getListOfPlayers(players).map((player) => player.currentCard),
  );

  return {
    update: {
      state: {
        phase: ARTE_RUIM_PHASES.EVALUATION,
        players,
        cards: shuffledCards,
        drawings: shuffledDrawings,
        level,
      },
    },
  };
};

/**
 * Gallery phase - builds the gallery of drawings and calculates scores and rankings
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGalleryPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const playersCardsIds = utils.players.getListOfPlayers(players).map((player) => player.currentCard.id);
  const tableCardsIds = store.currentCards
    .filter((card) => !playersCardsIds.includes(card.id))
    .map((card) => card.id);

  // Build gallery
  const gallery = shuffle(buildGallery(state.drawings, players, store, tableCardsIds));

  const ranking = buildRanking(state.drawings, players);

  const pastDrawings = getNewPastDrawings(players, gallery);

  return {
    update: {
      store: {
        ...store,
        pastDrawings: [...store.pastDrawings, ...pastDrawings],
      },
      state: {
        phase: ARTE_RUIM_PHASES.GALLERY,
        players,
        round: state.round,
        gallery,
        cards: store.currentCards,
        ranking,
      },
      stateCleanup: ['drawings'],
    },
  };
};

/**
 * Game Over phase - determines winners, calculates achievements, and saves game data
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

  const finalGallery = orderBy(cloneDeep(store.pastDrawings), 'successRate', 'desc');

  const achievements = calculateAchievements(store.achievements);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ARTE_RUIM,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data (drawings, usedArteRuimCards)
  await saveUsedCards(store.pastDrawings, store.language);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ARTE_RUIM_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        drawings: finalGallery,
        achievements,
      },
    },
  };
};
