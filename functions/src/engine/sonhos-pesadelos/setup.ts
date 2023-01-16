// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import utils from '../../utils';
import {
  buildGallery,
  buildRanking,
  buildTable,
  determineDreamsNightmaresAndThemes,
  gatherDreams,
  getThemeDeck,
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
  data: ResourceData
): Promise<SaveGamePayload> => {
  // Distribute themes for each round
  const themesDeck = getThemeDeck(data.cards);

  // Save
  return {
    update: {
      store: {
        imageDeck: data.images,
        imagesDeckIndex: -1,
        themesDeck,
      },
      state: {
        phase: SONHOS_PESADELOS_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
      players,
    },
  };
};

export const prepareDreamTellingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state?.round);

  // Unready players
  utils.players.unReadyPlayers(players);

  // Build table
  const { imageDeck, themesDeck } = store;
  const table = buildTable(imageDeck);

  // Determine player stuff
  determineDreamsNightmaresAndThemes(players, themesDeck, table, round.current);

  // Save
  return {
    update: {
      store: {
        themesDeck,
        imageDeck,
      },
      state: {
        phase: SONHOS_PESADELOS_PHASES.DREAM_TELLING,
        round,
        table,
      },
      players,
    },
  };
};

export const prepareMatchingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  // Remove votes
  utils.players.removePropertiesFromPlayers(players, ['votes']);

  // Gather dream clues
  const dreams = gatherDreams(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.MATCHING,
        dreams,
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
  const gallery = buildGallery(players, state.table);
  const ranking = buildRanking(players);
  const correctGuessPoints = Object.values(players)[0]?.theme?.level ?? 2;

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.RESOLUTION,
        gallery,
        ranking,
        correctGuessPoints,
      },
      players,
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

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: SONHOS_PESADELOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
