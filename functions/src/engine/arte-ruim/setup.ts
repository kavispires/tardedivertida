// Types
import type { ResourceData, FirebaseStateData, FirebaseStoreData, ArteRuimGameOptions } from './types';
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
  getAchievements,
  getGameSettings,
  getNewPastDrawings,
  getTheTwoLevel5Cards,
} from './helpers';
import { saveUsedCards } from './data';

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
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Get number of cards per level
  const playerCount = utils.players.getPlayerCount(players);

  // Update rounds
  const options = store.options as ArteRuimGameOptions;
  const { MAX_ROUNDS, LEVELS } = getGameSettings(options);

  // Build deck
  const deck = buildDeck(resourceData, playerCount, store.options as ArteRuimGameOptions, LEVELS);

  const achievements = utils.achievements.setup(players, store, {
    solitaryFail: 0,
    artistPoints: 0,
    solitaryWin: 0,
    worstArtist: 0,
    tableVotes: 0,
    chooseForMe: 0,
  });

  const threshold = options.forPoints ? GAME_OVER_SCORE_THRESHOLD?.[playerCount] ?? 100 : 0;

  // Save
  return {
    update: {
      state: {
        round: {
          ...state.round,
          total: MAX_ROUNDS,
        },
        threshold,
      },
      store: {
        deck,
        pastDrawings: [],
        currentCards: [],
        achievements,
        levels: LEVELS,
        specialLevels: resourceData.specialLevels.types,
      },
    },
  };
};

export const prepareDrawPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
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
        round: utils.helpers.increaseRound(state?.round),
        players,
        level,
        levelType,
      },
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['choseRandomly']);

  const level = store.currentCards?.[0]?.level ?? 1;

  // Shuffle cards
  const shuffledCards: ArteRuimCard[] =
    level === 5 ? getTheTwoLevel5Cards(store.currentCards) : utils.game.shuffle(store.currentCards);

  // Shuffle drawings
  const shuffledDrawings = utils.game.shuffle(
    utils.players.getListOfPlayers(players).map((player) => player.currentCard)
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

export const prepareGalleryPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const playersCardsIds = utils.players.getListOfPlayers(players).map((player) => player.currentCard.id);
  const tableCardsIds = store.currentCards
    .filter((card) => !playersCardsIds.includes(card.id))
    .map((card) => card.id);

  // Build gallery
  const gallery = utils.game.shuffle(buildGallery(state.drawings, players, store, tableCardsIds));

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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const finalGallery = utils.helpers.orderBy(
    utils.helpers.deepCopy(store.pastDrawings),
    'successRate',
    'desc'
  );

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

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
      storeCleanup: utils.firebase.cleanupStore(store, []),
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
