// Types
import { PlainObject, Player, Players, SaveGamePayload } from '../../utils/types';
import { FirebaseStateData, FirebaseStoreData, Results } from './types';
// Constants
import { COUNTS_BY_PLAYER, SONHOS_PESADELOS_PHASES, TOTAL_ROUNDS } from './constants';
// Helpers
import * as gameUtils from '../../utils/game-utils';
import * as imageCardsUtils from '../../utils/image-cards';
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
  cards: PlainObject
): Promise<SaveGamePayload> => {
  // Get a theme for each round
  const themes = gameUtils.getRandomItems(Object.values(cards), TOTAL_ROUNDS);

  const playerCount = Object.keys(players).length;
  const counts = COUNTS_BY_PLAYER[playerCount];
  const allImages = await imageCardsUtils.getImageCards(counts.cards);
  const table = buildTable(allImages, counts.cards);

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
        round: utils.increaseRound(state?.round, TOTAL_ROUNDS),
        isLastChance: true,
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
    winners = utils.determineWinners(players);
  } else {
    winners = Object.values(results)
      .filter((result) => result.win)
      .map(({ playerId }) => players[playerId]);
  }

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
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
