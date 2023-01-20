// Constants
import {
  ESPIAO_ENTRE_NOS_PHASES,
  GAME_DURATION,
  LOCATIONS_USED_IN_A_ROUND,
  RESOLUTIONS,
  TIMER_STATUS,
} from './constants';
// Types
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
  resourceData: ResourceData
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
  players: Players
): Promise<SaveGamePayload> => {
  // Use only 25 locations
  const availableLocations: SpyLocation[] = utils.game.getRandomItems(
    store.allLocations,
    LOCATIONS_USED_IN_A_ROUND
  );

  const locations = utils.helpers.orderBy(
    availableLocations.map((location) => ({
      id: location.id,
      name: location.name,
    })),
    'name',
    'asc'
  );

  const currentLocation = utils.game.getRandomItem(availableLocations);

  const availableRoles = createRolesPool(currentLocation.roles, Object.keys(players).length);

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
        guess: utils.firebase.deleteValue(),
        lastPlayerId: utils.firebase.deleteValue(),
      },
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.ASSIGNMENT,
        round: utils.helpers.increaseRound(state.round),
        locations,
        currentSpyId,
        startingPlayerId: store.gameOrder[0],
        // Cleanup
        resolution: utils.firebase.deleteValue(),
        timer: utils.firebase.deleteValue(),
        outcome: utils.firebase.deleteValue(),
        targetId: utils.firebase.deleteValue(),
        accuserId: utils.firebase.deleteValue(),
        finalAssessment: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareInvestigationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome
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
        timer: {
          updatedAt: Date.now(),
          status: TIMER_STATUS.RUNNING,
          ...timerUpdate,
        },
        targetId: utils.firebase.deleteValue(),
        accuserId: utils.firebase.deleteValue(),
        outcome,
      },
      players,
    },
  };
};

export const prepareAssessmentPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
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
      store: {
        targetId: utils.firebase.deleteValue(),
        accuserId: utils.firebase.deleteValue(),
        pausedAt: utils.firebase.deleteValue(),
      },
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.ASSESSMENT,
        targetId: targetId,
        accuserId: accuserId,
        timer: {
          updatedAt: pausedAt,
          status: TIMER_STATUS.PAUSED,
          timeRemaining,
        },
        outcome: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareFinalAssessmentPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome
): Promise<SaveGamePayload> => {
  const playerOrder =
    state?.finalAssessment?.playerOrder ??
    determineFinalAssessmentPlayerOrder(store.lastPlayerId, store.gameOrder);

  // Save
  return {
    update: {
      store: {
        lastPlayerId: utils.firebase.deleteValue(),
      },
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.FINAL_ASSESSMENT,
        targetId: utils.firebase.deleteValue(),
        accuserId: utils.firebase.deleteValue(),
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
      players,
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
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
    store.targetId ?? state.targetId
  );

  // Save
  return {
    update: {
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.RESOLUTION,
        timer: {
          status: TIMER_STATUS.STOPPED,
        },
        outcome: utils.firebase.deleteValue(),
        finalAssessment: utils.firebase.deleteValue(),
        resolution,
      },
      players,
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

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: ESPIAO_ENTRE_NOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
      store: {},
    },
  };
};
