// Constants
import { WORDS_PER_PLAYER_COUNT, CRUZA_PALAVRAS_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildDeck,
  buildGrid,
  buildRanking,
  checkForAvailableCells,
  distributeCoordinates,
  getAchievements,
  getPlayerClues,
  updateGridWithPlayersClues,
  updatePastClues,
} from './helpers';
import { saveData } from './data';

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

  const achievements = utils.achievements.setup(players, store, {
    clues: 0,
    badClues: 0,
    guesses: 0,
    chooseForMe: 0,
    wordLength: 0,
    savior: 0,
  });

  // Save
  return {
    update: {
      store: {
        deck,
        playersClues: [],
        availableCoordinates: {},
        gridRebuilds: 0,
        pastClues: {},
        achievements,
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
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['choseRandomly']);

  const round = utils.helpers.increaseRound(state.round);
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
    utils.players.removePropertiesFromPlayers(players, ['clue', 'guesses', 'coordinate']);
  }

  const updatedGrid = distributeCoordinates(players, grid);

  utils.players.removePropertiesFromPlayers(players, ['clue', 'guesses']);

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
        players,
      },
      stateCleanup: ['clues', 'ranking', 'whoGotNoPoints'],
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const clues = getPlayerClues(players);
  // Achievement: wordLength
  clues.forEach((clue) => {
    utils.achievements.increase(store, clue.playerId, 'wordLength', clue.clue.length);
  });

  const playersClues = clues.map((entry) => entry.clue);
  const pastClues = updatePastClues(state.grid, store.pastClues, clues);

  // Save
  return {
    update: {
      store: {
        playersClues: [...(store.playersClues ?? []), ...playersClues],
        pastClues,
        achievements: store.achievements,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.GUESSING,
        players,
        clues,
      },
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, whoGotNoPoints } = buildRanking(players, state.clues, store);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.REVEAL,
        grid: updateGridWithPlayersClues(players, state.grid),
        ranking,
        whoGotNoPoints,
        players,
      },
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

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CRUZA_PALAVRAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  // Save data
  await saveData(store.language, store.pastClues, store.options.imageGrid);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CRUZA_PALAVRAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
      },
    },
  };
};
