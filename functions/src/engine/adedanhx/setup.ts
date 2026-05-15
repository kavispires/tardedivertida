// Constants
import {
  ADEDANHX_PHASES,
  LETTERS_PER_ROUND,
  SHORT_GAME_ROUNDS,
  TOPICS_PER_ROUND,
  TOTAL_ROUNDS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
import { cloneDeep } from 'lodash';
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

/**
 * Setup phase - builds the card deck and resets previous changes to the store
 * @param store - The Firebase store data
 * @param _state - The Firebase state data (unused)
 * @param players - The players object
 * @param resourceData - Resource data containing topics and letters
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

  const achievements = utils.achievements.setup(players, {
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

/**
 * Answering phase - sets up the grid for the current round and prepares players to submit answers
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareAnsweringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  // Reset values related to answers and evaluations
  utils.players.addPropertiesToPlayers(players, { evaluations: {}, answers: {} });

  const round = utils.game.increaseRound(state.round);
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
      stateCleanup: ['ranking', 'answersGroups', 'answerGrid', 'stop'],
    },
  };
};

/**
 * Evaluation phase - groups answers and prepares them for player evaluation
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
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
      },
    },
  };
};

/**
 * Results phase - evaluates answers and calculates scores and rankings
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * Game Over phase - determines winners, calculates achievements, and saves game data
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
