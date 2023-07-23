// Constants
import { SCENARIOS_PER_ROUND, FILEIRA_DE_FATOS_PHASES, ROUND_TYPES } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { buildRanking, getAchievements } from './helpers';
// Internal

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
  const { gameOrder, playerIds: turnOrder } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);

  // Build deck
  const deck = utils.game.getRandomItems(resourceData.scenarios, gameOrder.length * SCENARIOS_PER_ROUND);

  const achievements = utils.achievements.setup(players, store, {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
    sense: 0,
    perfect: 0,
  });

  // Save
  return {
    update: {
      store: {
        deck,
        pastScenarios: [],
        achievements,
      },
      state: {
        phase: FILEIRA_DE_FATOS_PHASES.SETUP,
        turnOrder,
        round: {
          ...state.round,
          total: gameOrder.length,
        },
      },
    },
  };
};

export const prepareScenarioOrderingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['currentOrder']);

  const round = utils.helpers.increaseRound(state.round);
  const activePlayerId = utils.players.getActivePlayer(state.turnOrder, round.current);
  const deck: TextCard[] = store.deck;
  const scenarios = deck.splice(0, SCENARIOS_PER_ROUND);

  const roundType = round.current === 1 ? ROUND_TYPES[0] : utils.game.getRandomItem(ROUND_TYPES);

  // Save
  return {
    update: {
      store: {
        deck,
      },
      state: {
        phase: FILEIRA_DE_FATOS_PHASES.ORDERING,
        round,
        players,
        scenarios,
        activePlayerId,
        roundType,
      },
      stateCleanup: ['ranking'],
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const ranking = buildRanking(players, state.activePlayerId, state.roundType, store);

  const pastScenarios = [
    ...store.pastScenarios,
    {
      scenarios: state.scenarios,
      playerId: state.activePlayerId,
    },
  ];

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        pastScenarios,
      },
      state: {
        phase: FILEIRA_DE_FATOS_PHASES.RESULTS,
        players,
        ranking,
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
    gameName: GAME_NAMES.FILEIRA_DE_FATOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: FILEIRA_DE_FATOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        gallery: store.pastScenarios,
        achievements,
      },
    },
  };
};
