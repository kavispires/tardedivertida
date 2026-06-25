import { sample, sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../constants/general';
import { SCENARIOS_PER_ROUND, FILEIRA_DE_FATOS_PHASES, ROUND_TYPES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { buildRanking } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const { gameOrder, playerIds: turnOrder } = utils.turnOrder.create(players, DOUBLE_ROUNDS_THRESHOLD);

  // Build deck
  const deck = sampleSize(resourceData.scenarios, gameOrder.length * SCENARIOS_PER_ROUND);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

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

/**
 * Scenario Ordering phase - players order scenarios chronologically
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareScenarioOrderingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['currentOrder']);

  const round = utils.game.increaseRound(state.round);
  const activePlayerId = utils.turnOrder.getActivePlayerId(state.turnOrder, round.current);
  const deck: TextCardData[] = store.deck;
  const scenarios = deck.splice(0, SCENARIOS_PER_ROUND);

  const roundType = round.current === 1 ? ROUND_TYPES[0] : sample(ROUND_TYPES);

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

/**
 * Results phase - reveals correct order and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const ranking = buildRanking(players, state.activePlayerId, state.roundType, store);

  const pastScenarios = [
    ...store.pastScenarios,
    {
      scenarios: state.scenarios,
      playerId: state.activePlayerId,
    },
  ];

  // Unready players
  utils.players.unReadyPlayers(players);

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

/**
 * Game Over phase - determines winners and saves game data
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.FILEIRA_DE_FATOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
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
