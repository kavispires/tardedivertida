// Interfaces
import { Player, Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData, Results } from './interfaces';
// Constants
import { COUNTS_BY_PLAYER, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import * as imageCards from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
import { buildTable, determineDreams, determineNightmares, gatherClues, tallyScore } from './helpers';

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
  const themes = gameUtils.getRandomItems(cards, TOTAL_ROUNDS);

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
        dreamsCount: counts.dreams,
        nightmaresCount: counts.nightmares,
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
  // Unready players
  utils.unReadyPlayers(players);

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
      players,
    },
  };
};

export const prepareMatchPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);
  // Remove votes
  utils.removePropertiesFromPlayers(players, ['votes']);

  // Gather clues
  const clues = gatherClues(players);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.MATCH,
        updatedAt: Date.now(),
        clues,
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
  // Count votes
  const goal = state.dreamsCount * (Object.keys(players).length - 1);
  const results = tallyScore(players, store?.results ?? {}, goal);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.RESOLUTION,
        updatedAt: Date.now(),
        results,
      },
      store: {
        results,
      },
      players,
    },
  };
};

export const prepareLastChancePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);
  // Remove votes
  utils.removePropertiesFromPlayers(players, ['votes']);

  // Save
  return {
    update: {
      state: {
        phase: SONHOS_PESADELOS_PHASES.LAST_CHANCE,
        updatedAt: Date.now(),
        isLastChance: true,
        round: utils.increaseRound(state?.round, TOTAL_ROUNDS),
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
  const results: Results = store.results;

  let winners: Player[] = [];
  if (state.isLastChance) {
    winners = Object.values(results)
      .filter((result) => result.win)
      .map(({ playerId }) => players[playerId]);
  } else {
    winners = utils.determineWinners(players);
  }

  return {
    update: {
      store: {
        ...store,
      },
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: SONHOS_PESADELOS_PHASES.GAME_OVER,
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
      },
    },
  };
};
