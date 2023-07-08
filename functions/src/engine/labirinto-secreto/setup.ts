// Constants
import { CARDS_PER_ROUND, LABIRINTO_SECRETO_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
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
  // Build forest
  const forest = buildForest(resourceData.forestCards);

  // Build player paths
  buildPaths(players);

  // Build player hands
  distributeCards(store, players, resourceData.allCards);

  const { gameOrder } = utils.players.buildGameOrder(players);

  // const achievements = utils.achievements.setup(players, store, {
  //   // matches: 0,
  // });

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

export const prepareMapBuildingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

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
        round: utils.helpers.increaseRound(state?.round),
      },
      stateCleanup: ['turnOrder', 'activePlayerId', 'ranking'],
    },
  };
};

export const preparePathFollowingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // Build game order based oh the players updated time
  let turnOrder = state.turnOrder;
  if (!turnOrder) {
    const notCompletePlayers = getPlayersWhoHaveNotCompletedTheirMaps(players);
    turnOrder = utils.helpers.orderBy(notCompletePlayers, 'updatedAt', 'asc').map((p) => p.id);
  }

  // Get active player
  const activePlayerId = utils.players.getNextPlayer(turnOrder, state.activePlayerId);

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

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const ranking = getRankingAndProcessScoring(players);

  // Save
  return {
    update: {
      state: {
        phase: LABIRINTO_SECRETO_PHASES.RESULTS,
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

  // const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.LABIRINTO_SECRETO,
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
        phase: LABIRINTO_SECRETO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        // achievements,
      },
    },
  };
};
