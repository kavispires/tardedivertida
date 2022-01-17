// Constants
import { WORDS_PER_PLAYER_COUNT, CRUZA_PALAVRAS_PHASES } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
import * as firebaseUtils from '../../utils/firebase';
// Internal
import {
  buildDeck,
  buildGrid,
  buildRanking,
  checkForAvailableCells,
  distributeCoordinates,
  getPlayerClues,
  updateGridWithPlayersClues,
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
  const largerGridCount = store.options.largerGrid ? 2 : 0;
  // Build deck
  const deck = buildDeck(resourceData.allWords, Object.keys(players).length, largerGridCount);

  // Save
  return {
    update: {
      store: {
        deck,
        playersClues: [],
        availableCoordinates: {},
        gridRebuilds: 0,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.SETUP,
      },
    },
  };
};

export const prepareClueWritingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  const round = utils.increaseRound(state.round);
  const playerCount = Object.keys(players).length;
  const largerGridCount = store.options.largerGrid ? 1 : 0;
  const coordinateLength = WORDS_PER_PLAYER_COUNT[playerCount] / 2 + store.gridRebuilds + largerGridCount;

  // Build grid if rounds 1 or if there is not enough available cells for all players
  const largerGridAvailability = store.options.largerGrid ? 2 : 0;
  const shouldBuildGrid = !checkForAvailableCells(state.grid, playerCount, largerGridAvailability);
  const grid = shouldBuildGrid
    ? buildGrid(store.deck, store.playersClues, coordinateLength, shouldBuildGrid)
    : state.grid;

  // Remove clues before the distribution of coordinates
  if (shouldBuildGrid) {
    utils.removePropertiesFromPlayers(players, ['clue', 'guesses', 'coordinate']);
  }

  const updatedGrid = distributeCoordinates(players, grid);

  utils.removePropertiesFromPlayers(players, ['clue', 'guesses']);

  // Save
  return {
    update: {
      store: {
        playersClues: shouldBuildGrid ? [] : store.playersClues,
        gridRebuilds: shouldBuildGrid ? store.gridRebuilds + 1 : store.gridRebuilds,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.CLUE_WRITING,
        round,
        grid: updatedGrid,
        clues: firebaseUtils.deleteValue(),
        ranking: firebaseUtils.deleteValue(),
        whoGotNoPoints: firebaseUtils.deleteValue(),
      },
      players,
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  const clues = getPlayerClues(players);
  const playersClues = clues.map((entry) => entry.clue);

  // Save
  return {
    update: {
      store: {
        playersClues: [...(store.playersClues ?? []), ...playersClues],
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.GUESSING,
        clues,
      },
      players,
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, whoGotNoPoints } = buildRanking(players, state.clues);

  // Save
  return {
    update: {
      state: {
        phase: CRUZA_PALAVRAS_PHASES.REVEAL,
        grid: updateGridWithPlayersClues(players, state.grid),
        ranking,
        whoGotNoPoints,
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
        phase: CRUZA_PALAVRAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
