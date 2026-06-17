// Constants
import { CARDS_PER_ROUND, LABIRINTO_SECRETO_PHASES, MULLIGAN_HAND } from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { orderBy } from 'lodash';
// Types
import type {
  ExtendedTextCard,
  FirebaseStateData,
  FirebaseStoreData,
  MapSegment,
  ResourceData,
} from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildForest,
  buildPaths,
  distributeCards,
  getAllCompletePlayerIds,
  getIsPlayerMapComplete,
  getPlayersWhoHaveNotCompletedTheirMaps,
  getRankingAndProcessScoring,
  updateMaps,
} from './helpers';
import { getAchievements, increaseAchievement, setupAchievements } from './achievements';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Build forest
  const forest = buildForest(resourceData.forestCards, !!store?.options?.itemTreeType);

  // Build player paths
  buildPaths(players);

  // Build player hands
  distributeCards(store, players, resourceData.allCards);

  const { gameOrder } = utils.turnOrder.create(players);

  const playerIds = utils.players.getListOfPlayers(players).map((player) => player.id);
  store.achievements = setupAchievements(playerIds);

  utils.players.addPropertiesToPlayers(players, { mulliganAvailable: true });

  const listOfPlayers = utils.players.getListOfPlayers(players);
  listOfPlayers.forEach((player) => {
    player.history = {};
    listOfPlayers.forEach((otherPlayer) => {
      if (player.id !== otherPlayer.id) {
        player.history[otherPlayer.id] = { 0: [otherPlayer.map[0].treeId] };
      }
    });
  });

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.SETUP,
        players,
        forest,
        turnOrder: gameOrder,
      },
    },
  };
};

/**
 * Map Building phase - players build their maze maps with word cards
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareMapBuildingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Change hands for all players who chose to mulligan
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.mulliganReceived) {
      delete player.mulliganReceived;
    }

    if (player.wantsToMulligan && player.mulliganAvailable) {
      player.mulliganAvailable = false;
      const currentHand: number = player.hand.length;
      player.hand = [];
      utils.deck.deal(store, players, Math.min(MULLIGAN_HAND, currentHand), [player.id]);
      player.mulliganReceived = true;
      delete player.wantsToMulligan;
    }
  });

  // Deal cards
  utils.deck.deal(store, players, CARDS_PER_ROUND);

  updateMaps(players);

  // Unready players who have completed their maps
  getAllCompletePlayerIds(players).forEach((playerId) => {
    players[playerId].ready = true;
  });

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.MAP_BUILDING,
        players,
        round: utils.game.increaseRound(state?.round),
      },
      stateCleanup: ['turnOrder', 'activePlayerId', 'ranking'],
    },
  };
};

/**
 * Path Following phase - players follow paths through the maze
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePathFollowingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Build game order based oh the players updated time
  let turnOrder = state.turnOrder;
  if (!turnOrder) {
    const notCompletePlayers = getPlayersWhoHaveNotCompletedTheirMaps(players);
    turnOrder = orderBy(notCompletePlayers, 'updatedAt', 'asc').map((p) => p.id);
  }

  // Get active player
  const activePlayerId = utils.turnOrder.getNextPlayerId(turnOrder, state.activePlayerId);

  // Unready players
  utils.players.unReadyPlayers(players, activePlayerId);

  if (!state.activePlayerId) {
    // Update players maps and hands
    listOfPlayers.forEach((player) => {
      if (getIsPlayerMapComplete(player)) {
        player.map.forEach((segment: MapSegment) => {
          segment.active = false;
        });
        return;
      }
      const mapIndex = player.map.findIndex((segment: MapSegment) => !segment.passed);
      player.newMap.forEach((entry: ExtendedTextCard | null, index: number) => {
        // Add new clue to the map segment
        if (entry) {
          utils.deck.discard(store, players, player.id, entry.id);
          player.map[mapIndex + index].clues.push({ ...entry });
        }
        // Make that segment active if it has any clues at all
        if (player.map[mapIndex + index].clues.length > 0) {
          player.map[mapIndex + index].active = true;
        }
      });

      // Update full map so players are only placed in the latest active segment
      player.map.forEach((segment: MapSegment, index: number) => {
        if (index < mapIndex) {
          segment.active = false;
        } else if (index === mapIndex) {
          segment.active = true;
        }
      });
    });
    utils.players.removePropertiesFromPlayers(players, ['newMap']);
  }

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING,
        players,
        activePlayerId,
        turnOrder,
      },
    },
  };
};

/**
 * Results phase - calculates scores and rankings
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const ranking = getRankingAndProcessScoring(players, store);
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store,
      state: {
        phase: LABIRINTO_SECRETO_PHASES.RESULTS,
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

  // Achievements: Count how many cards used by each player
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.map.forEach((segment: MapSegment) => {
      const clueCount = segment.clues.length;
      increaseAchievement(store.achievements, player.id, 'adjectives', clueCount);
      // Negatives
      const negatives = segment.clues.filter((clue) => clue.negate).length;
      increaseAchievement(store.achievements, player.id, 'negatives', negatives);
    });
  });

  const achievements = getAchievements(store.achievements, undefined, players);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.LABIRINTO_SECRETO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, ['map']);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: LABIRINTO_SECRETO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        forest: state.forest,
        achievements,
      },
    },
  };
};
