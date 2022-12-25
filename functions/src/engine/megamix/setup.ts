import utils from '../../utils';
import { MEGAMIX_PHASES, WINNING_CONDITION } from './constants';
import { distributeSeeds, getMostMatching, getMostVotes, getRanking, handleSeedingData } from './helpers';
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
  utils.players.addPropertiesToPlayers(players, { team: ['L'] });

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

  // Give each player 5 outfits
  const clubbers = utils.game.shuffle(
    Array(60)
      .fill(0)
      .map((e, i) => String(e + i))
  );

  // Prepare seeds
  distributeSeeds(store.tasks, players, clubbers);

  // Save
  return {
    update: {
      store: {
        tasks: utils.game.shuffle(store.tasks),
      },
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

  if (state.round.current === 0) {
    // Give each player their outfit
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.clubberId = player.data.clubberId;
    });

    // Handle seeding data
    const tasks = handleSeedingData(store.tasks, players);

    const playerData = utils.players.getListOfPlayers(players).reduce((acc, player) => {
      acc[player.id] = {
        seeds: player.seeds,
        data: player.data,
      };
      return acc;
    }, {});

    utils.players.removePropertiesFromPlayers(players, ['data', 'seeds']);

    // Save
    return {
      update: {
        store: {
          tasks,
          playerData,
        },
        players,
        state: {
          phase: MEGAMIX_PHASES.TASK,
          task: tasks[state.round.current],
          round: utils.helpers.increaseRound(state.round),
        },
      },
    };
  }

  utils.players.removePropertiesFromPlayers(players, ['data']);

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
    task.condition === WINNING_CONDITION.MOST_VOTED
      ? getMostVotes(players, 'value')
      : getMostMatching(players, 'value', 0.6);

  const ranking = getRanking(players, scoring, state.round.current);

  // Save
  return {
    update: {
      players,
      state: {
        phase: MEGAMIX_PHASES.RESULT,
        ...scoring,
        ranking: ranking.filter((rankEntry) => players[rankEntry.playerId].team[state.round.current] === 'W'),
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
  const winningPlayers = utils.players
    .getListOfPlayers(players)
    .filter((player) => state.winningTeam.includes(player.id));

  const winners = utils.players.determineWinners(utils.helpers.buildObjectFromList(winningPlayers));
  const fairWinners = utils.players.determineWinners(players);

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: MEGAMIX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        fairWinners,
      },
    },
  };
};
