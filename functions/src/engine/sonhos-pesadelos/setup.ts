// Interfaces
import { Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
// Constants
import { COUNTS_BY_PLAYER, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import * as imageCards from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import { buildTable, determineDreams, determineNightmares } from './helpers';

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
  cards: string[]
): Promise<SaveGamePayload> => {
  // Get 4 themes
  const themes = gameUtils.getRandomItems(cards, 4);

  const playerCount = Object.keys(players).length;
  const counts = COUNTS_BY_PLAYER[playerCount];
  const allImages = gameUtils.getRandomItems(imageCards.getImageCards(1), counts.cards);
  const table = buildTable(allImages);

  // Determine players dreams
  determineDreams(players, table, counts.dreams);

  // Determine players nightmares
  determineNightmares(players, table, counts.nightmares);

  // Save
  return {
    update: {
      store: {
        themes,
      },
      state: {
        phase: SONHOS_PESADELOS_PHASES.SETUP,
        table,
      },
      players,
    },
  };
};

export const prepareTellDreamPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(players);

  const theme = store.themes[state.round.current];

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.TELL_DREAM,
        updatedAt: Date.now(),
        round: utils.increaseRound(state?.round, TOTAL_ROUNDS),
        theme,
      },
    },
  };
};

export const prepareMatchPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.MATCH,
        updatedAt: Date.now(),
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.RESOLUTION,
        updatedAt: Date.now(),
      },
    },
  };
};

export const prepareLastChancePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.LAST_CHANCE,
        updatedAt: Date.now(),
      },
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  console.log(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.GAME_OVER,
        updatedAt: Date.now(),
      },
    },
  };
};
