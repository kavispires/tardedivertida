// Constants
import { ADEDANHX_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildGrid, evaluateAnswers, getCurrentGrid, groupAnswers } from './helpers';

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
  // Gather topics and letters for the entire game 5x4 grid
  const { allTopics, allLetters } = resourceData;
  const { letters, topics } = buildGrid(allTopics, allLetters);

  // const achievements = utils.achievements.setup(players, store, {});

  // Save
  return {
    update: {
      store: {
        // achievements,
        letters,
        topics,
      },
      state: {
        phase: ADEDANHX_PHASES.SETUP,
      },
    },
  };
};

export const prepareAnsweringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['evaluations', 'answers']);

  const round = utils.helpers.increaseRound(state.round);

  // Get current grid
  const grid = getCurrentGrid(store.topics, store.letters, round.current);

  // Save
  return {
    update: {
      state: {
        phase: ADEDANHX_PHASES.ANSWERING,
        round,
        grid,
        players,
        stop: false,
      },
      stateCleanup: ['ranking', 'answerGroup', 'answerGroupIndex', 'answerGrid'],
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.addPropertiesToPlayers(players, { evaluations: {} });

  // Gather answers per player per cell, and auto-verify them
  const answerGroups = groupAnswers(players, state.grid.xHeaders, state.grid.yHeaders);

  // Save
  return {
    update: {
      state: {
        phase: ADEDANHX_PHASES.EVALUATION,
        players,
        answerGroups,
        answerGroupIndex: 0,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const { answersGrid, ranking } = evaluateAnswers(players, state.answerGroups);

  // Save
  return {
    update: {
      state: {
        phase: ADEDANHX_PHASES.RESULTS,
        ranking,
        players,
        answersGrid,
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
  const achievements = [];

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ADEDANHX,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastClues, store.options.imageGrid);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ADEDANHX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
      },
    },
  };
};
