import utils from '../../utils';
import { MEGAMIX_PHASES } from './constants';
import { getMostMatching, getMostVotes, getRanking } from './helpers';
import { FirebaseStateData, FirebaseStoreData, ResourceData, Task } from './types';

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
  utils.players.addPropertiesToPlayers(players, { team: 'L' });

  // Save
  return {
    update: {
      store: {
        tasks: resourceData.tasks,
      },
      state: {
        phase: MEGAMIX_PHASES.SETUP,
        round: {
          current: 0,
          total: resourceData.tasks.length,
        },
      },
      players,
    },
  };
};

export const prepareSeedingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      players,
      state: {
        phase: MEGAMIX_PHASES.SEEDING,
      },
    },
  };
};

export const prepareTaskPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      players,
      state: {
        phase: MEGAMIX_PHASES.TASK,
        task: store.tasks[state.round.current],
        round: utils.helpers.increaseRound(state.round),
      },
    },
  };
};

export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const task: Task = state.task;

  const scoring =
    task.condition === 'mostVoted' ? getMostVotes(players, 'cardId') : getMostMatching(players, 'clue', 0.6);

  const ranking = getRanking(players, scoring);

  // Save
  return {
    update: {
      players,
      state: {
        phase: MEGAMIX_PHASES.RESULT,
        ...scoring,
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

  return {
    set: {
      players,
      state: {
        phase: MEGAMIX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        // achievements,
      },
    },
  };
};
