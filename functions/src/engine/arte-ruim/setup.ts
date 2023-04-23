// Types
import type { ResourceData, FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { ARTE_RUIM_PHASES, REGULAR_GAME_LEVELS, SHORT_GAME_LEVELS } from './constants';
// Helpers
import utils from '../../utils';
import {
  buildDeck,
  buildGallery,
  buildRanking,
  dealCards,
  getAchievements,
  getNewPastDrawings,
  getTheTwoLevel5Cards,
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
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Get number of cards per level
  const playerCount = Object.keys(players).length;

  // Build deck
  const deck = buildDeck(resourceData, playerCount, store.options?.shortGame ?? false);

  const achievements = utils.achievements.setup(players, store, {
    solitaryFail: 0,
    artistPoints: 0,
    solitaryWin: 0,
    worstArtist: 0,
    tableVotes: 0,
  });

  // Save
  return {
    update: {
      store: {
        deck,
        pastDrawings: [],
        currentCards: [],
        achievements,
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

  // Update rounds
  const maxRounds = store.options?.shortGame ? SHORT_GAME_LEVELS.length : REGULAR_GAME_LEVELS.length;

  return {
    update: {
      store: {
        ...store,
      },
      state: {
        phase: ARTE_RUIM_PHASES.DRAW,
        round: utils.helpers.increaseRound(state?.round, maxRounds),
        level: Object.values(players)?.[0]?.currentCard?.level ?? 0,
        players,
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

  const level = store.currentCards?.[0]?.level ?? 1;

  // Shuffle cards
  const shuffledCards: ArteRuimCard[] =
    level === 5 ? getTheTwoLevel5Cards(store.currentCards) : utils.game.shuffle(store.currentCards);

  // Shuffle drawings
  const shuffledDrawings = utils.game.shuffle(Object.values(players).map((player) => player.currentCard));

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

  const finalGallery = utils.helpers.orderBy(store.pastDrawings, 'successRate', 'desc');

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ARTE_RUIM,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
  });

  return {
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
