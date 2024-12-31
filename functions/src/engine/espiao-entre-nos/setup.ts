// Constants
import {
  ESPIAO_ENTRE_NOS_PHASES,
  GAME_DURATION,
  LOCATIONS_USED_IN_A_ROUND,
  RESOLUTIONS,
  TIMER_STATUS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { SpyLocation } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, Outcome, Resolution, ResourceData } from './types';
// Utils
import utils from '../../utils';
import {
  calculateScore,
  calculateTimeRemaining,
  createRolesPool,
  determineFinalAssessmentPlayerOrder,
  distributeRoles,
} from './helpers';

/**
 * Setup
 * Save locations to store
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = utils.players.buildGameOrder(players);

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
  const availableLocations: SpyLocation[] = utils.game.getRandomItems(
    store.allLocations,
    LOCATIONS_USED_IN_A_ROUND,
  );

  const locations = utils.helpers.orderBy(
    availableLocations.map((location) => ({
      id: location.id,
      name: location.name,
    })),
    'name',
    'asc',
  );

  const currentLocation = utils.game.getRandomItem(availableLocations);

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
        round: utils.helpers.increaseRound(state.round),
        locations,
        currentSpyId,
        startingPlayerId: store.gameOrder[0],
      },
      storeCleanup: ['guess', 'lastPlayerId'],
      stateCleanup: ['resolution', 'timer', 'outcome', 'targetId', 'accuserId', 'finalAssessment'],
    },
  };
};

export const prepareInvestigationPhase = async (
  store: FirebaseStoreData,
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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

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
