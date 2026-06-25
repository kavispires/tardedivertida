import { orderBy, sampleSize } from 'lodash';
// Types
import type { SpyLocationData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, Outcome, Resolution, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  ESPIAO_ENTRE_NOS_PHASES,
  GAME_DURATION,
  LOCATIONS_USED_IN_A_ROUND,
  RESOLUTIONS,
  TIMER_STATUS,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import {
  calculateScore,
  calculateTimeRemaining,
  createRolesPool,
  determineFinalAssessmentPlayerOrder,
  distributeRoles,
} from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.turnOrder.create(players);

  // Save
  return {
    update: {
      store: {
        gameOrder,
        allLocations: resourceData.allLocations,
        usedLocations: [],
      },
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.SETUP,
        round: {
          current: 0,
          total: gameOrder.length,
        },
      },
    },
  };
};

/**
 * Assign roles to players
 * Determine rounds locations
 * Resets previous changes to the store
 * @returns
 */
export const prepareAssignmentPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Use only 25 locations
  const availableLocations: SpyLocationData[] = sampleSize(store.allLocations, LOCATIONS_USED_IN_A_ROUND);

  const locations = orderBy(
    availableLocations.map((location) => ({
      id: location.id,
      name: location.name,
    })),
    'name',
    'asc',
  );

  const currentLocation = sampleSize(availableLocations, 1)[0];

  const availableRoles = createRolesPool(currentLocation.roles, utils.players.getPlayerCount(players));

  const currentSpyId = distributeRoles(availableRoles, currentLocation.name, players);

  // Save
  return {
    update: {
      store: {
        usedLocations: [...store.usedLocations, currentLocation.id],
        currentLocation: {
          id: currentLocation.id,
          name: currentLocation.name,
        },
      },
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT,
        players,
        round: utils.game.increaseRound(state.round),
        locations,
        currentSpyId,
        startingPlayerId: store.gameOrder[0],
      },
      storeCleanup: ['guess', 'lastPlayerId'],
      stateCleanup: ['resolution', 'timer', 'outcome', 'targetId', 'accuserId', 'finalAssessment'],
    },
  };
};

/**
 * Investigation phase - players ask and answer questions to find the spy
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareInvestigationPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome,
): Promise<SaveGamePayload> => {
  const timerUpdate: PlainObject = {};

  // If new round (current phase is Assignment), start timer
  if (state.phase === ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT) {
    timerUpdate.timeRemaining = GAME_DURATION;
  } else {
    timerUpdate.timeRemaining = calculateTimeRemaining(state.timer.timeRemaining, state.timer.updatedAt);
  }

  // Save
  return {
    update: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.INVESTIGATION,
        players,
        timer: {
          updatedAt: Date.now(),
          status: TIMER_STATUS.RUNNING,
          ...timerUpdate,
        },
        outcome,
      },
      stateCleanup: ['targetId', 'accuserId'],
    },
  };
};
/**
 * Assignment phase - assigns roles and locations to players
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 *//**
 * Assessment phase - players vote on who they think is the spy
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareAssessmentPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Pause Timer
  const timeRemaining = calculateTimeRemaining(state.timer.timeRemaining, state.timer.updatedAt);

  const { targetId, accuserId, pausedAt } = store;

  // Update players
  utils.players.addPropertiesToPlayers(players, { vote: false });
  utils.players.unReadyPlayers(players);
  // Ready the players who won't need to vote
  players[targetId].ready = true;
  players[accuserId].ready = true;
  players[accuserId].usedAccusation = true;
  players[accuserId].vote = true;

  // Save
  return {
    update: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT,
        players,
        targetId: targetId,
        accuserId: accuserId,
        timer: {
          updatedAt: pausedAt,
          status: TIMER_STATUS.PAUSED,
          timeRemaining,
        },
      },
      storeCleanup: ['targetId', 'accuserId', 'pausedAt'],
      stateCleanup: ['outcome'],
    },
  };
};

/**
 * Final Assessment phase - final vote to identify the spy
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareFinalAssessmentPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome,
): Promise<SaveGamePayload> => {
  const playerOrder =
    state?.finalAssessment?.playerOrder ??
    determineFinalAssessmentPlayerOrder(store.lastPlayerId, store.gameOrder);

  // Save
  return {
    update: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT,
        players,
        timer: {
          status: TIMER_STATUS.STOPPED,
        },
        finalAssessment: {
          playerOrder,
          playerOrderIndex:
            state.finalAssessment?.playerOrderIndex !== undefined
              ? state.finalAssessment.playerOrderIndex + 1
              : 0,
        },
        outcome,
      },
      storeCleanup: ['lastPlayerId'],
      stateCleanup: ['targetId', 'accuserId'],
    },
  };
};

/**
 * Resolution phase - reveals the spy and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const resolutionType = store.guess ? RESOLUTIONS.SPY_GUESS : RESOLUTIONS.SPY_FOUND;
  const isSpyGuess = resolutionType === RESOLUTIONS.SPY_GUESS;

  const resolution: Resolution = {
    type: resolutionType,
    isSpyGuess,
    isSpyWin: false,
  };

  // Determine if spy guessed correctly
  if (isSpyGuess) {
    resolution.guess = store.guess;
    resolution.currentLocation = store.currentLocation;
    resolution.isSpyWin = store.guess === store.currentLocation.id;
  } else {
    resolution.isSpyWin = (store.targetId ?? state.targetId) !== state.currentSpyId;
  }

  calculateScore(
    players,
    isSpyGuess,
    resolution.isSpyWin,
    state.currentSpyId,
    store.targetId ?? state.targetId,
  );

  // Save
  return {
    update: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.RESOLUTION,
        players,
        timer: {
          status: TIMER_STATUS.STOPPED,
        },
        resolution,
      },
      stateCleanup: ['outcome', 'finalAssessment'],
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

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ESPIAO_ENTRE_NOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
