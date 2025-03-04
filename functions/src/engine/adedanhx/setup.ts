// Constants
import {
  ADEDANHX_PHASES,
  LETTERS_PER_ROUND,
  SHORT_GAME_ROUNDS,
  TOPICS_PER_ROUND,
  TOTAL_ROUNDS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildGrid,
  evaluateAnswers,
  getAchievements,
  getCurrentGrid,
  groupAnswers,
  storeGalleryData,
} from './helpers';
import { cloneDeep } from 'lodash';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Gather topics and letters for the entire game 5x4 grid
  const { allTopics, allLetters } = resourceData;
  const options = store.options;
  const roundsCount = options.shorterGame ? SHORT_GAME_ROUNDS : TOTAL_ROUNDS;
  const { letters, topics } = buildGrid(
    allTopics,
    allLetters,
    Number(options.columnSize ?? TOPICS_PER_ROUND),
    Number(options.rowSize ?? LETTERS_PER_ROUND),
    roundsCount,
    !!options.nsfw,
  );

  const achievements = utils.achievements.setup(players, store, {
    stop: 0,
    first: 0,
    cells: 0,
    badClues: 0,
    autoReject: 0,
  });

  // Save
  return {
    update: {
      store: {
        achievements,
        letters,
        topics,
        topAnswers: [],
        noAnswers: [],
      },
      state: {
        phase: ADEDANHX_PHASES.SETUP,
        round: {
          current: 0,
          total: roundsCount,
          forceLastRound: false,
        },
      },
    },
  };
};

export const prepareAnsweringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['evaluations', 'answers']);

  const round = utils.helpers.increaseRound(state.round);
  const options = store.options;

  // Get current grid
  const grid = getCurrentGrid(
    store.topics,
    store.letters,
    round.current,
    Number(options.columnSize ?? TOPICS_PER_ROUND),
    Number(options.rowSize ?? LETTERS_PER_ROUND),
  );

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
      stateCleanup: ['ranking', 'answersGroups', 'answerGroupIndex', 'answerGrid', 'stop'],
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.addPropertiesToPlayers(players, { evaluations: {} });

  // Gather answers per player per cell, and auto-verify them
  const answersGroups = groupAnswers(players, state.grid.xHeaders, state.grid.yHeaders, store);

  if (state.stop) {
    // Achievement: stop
    utils.achievements.increase(store, state.stop, 'stop', 1);
  }

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: ADEDANHX_PHASES.EVALUATION,
        players,
        answersGroups,
        answersGroupIndex: 0,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather votes
  const { answersGrid, ranking } = evaluateAnswers(players, state.answersGroups, store);

  storeGalleryData(store, state.grid.xHeaders, state.grid.yHeaders, answersGrid);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        topAnswers: store.topAnswers,
        noAnswers: store.noAnswers,
      },
      state: {
        phase: ADEDANHX_PHASES.RESULTS,
        ranking,
        players,
        answersGrid,
        answersGroups: state.answersGroups,
      },
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

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ADEDANHX,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const topAnswers = cloneDeep(store.topAnswers);
  const noAnswers = cloneDeep(store.noAnswers);

  // Save data
  // await saveData(store.language, store.pastClues, store.options.imageGrid);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: ADEDANHX_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        topAnswers,
        noAnswers,
      },
    },
  };
};
