// Constants
import { WORDS_PER_PLAYER_COUNT, CRUZA_PALAVRAS_PHASES } from './constants';
// Interfaces
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
import * as firebaseUtils from '../../utils/firebase';
// Internal
import { buildDeck, buildGrid, buildRanking, distributeCoordinates, getPlayerClues } from './helpers';

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
  // Build deck
  const deck = buildDeck(resourceData.allWords, Object.keys(players).length);

  // Save
  return {
    update: {
      store: {
        deck,
        playersClues: [],
        availableCoordinates: {},
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
  const coordinateLength = WORDS_PER_PLAYER_COUNT[playerCount] / 2;

  // Build grid if rounds 1 or 4
  const shouldBuildGrid = round.current === 1 || round.current === 4;
  const grid = shouldBuildGrid
    ? buildGrid(store.deck, store.playersClues, coordinateLength, round.current)
    : state.grid;

  // Remove clues before the distribution of coordinates
  if (round.current === 4) {
    utils.removePropertiesFromPlayers(players, ['clue', 'guesses']);
  }

  const updatedGrid = distributeCoordinates(players, grid, round.current);

  utils.removePropertiesFromPlayers(players, ['clue', 'guesses']);

  // Save
  return {
    update: {
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
