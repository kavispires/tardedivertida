// Types
import type { GroupQuestionCardData } from '../../types/tdr';
import type { ExtendedPlayerAnswerEntry, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { AVATAR_SPRITE_LIBRARIES } from '../../constants/sprites';
import {
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
  SHORT_PASTURE_GAME_OVER_THRESHOLD,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { calculateAchievements, increaseAchievement, setupAchievements } from './achievements';
import { saveData } from './data';
import {
  buildDeck,
  buildListOfAnswers,
  buildPastureChange,
  buildRanking,
  determineGameOver,
  determineHighestScores,
  determineLowestScores,
  determineRoundType,
  extendPlayerAnswers,
  updateLevelsForPlayers,
  gatherAllAnswers,
  recalculateLastPasture,
  shouldSaveSheep,
  calculateSheepTravelDistance,
  getMostFrequentAnswers,
} from './helpers';

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
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.turnOrder.create(players);

  // Build deck
  const deck = buildDeck(additionalData.allQuestions);

  // Add level to players
  utils.players.addPropertiesToPlayers(players, {
    level: 0,
    answers: {},
  });

  utils.players.distributeNumberIds(players, 0, AVATAR_SPRITE_LIBRARIES.SHEEP - 1, 'sheepId');

  // Setup achievements
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck,
        gameOrder,
        pastQuestions: [],
        deckIndex: 0,
        achievements,
        gallery: [],
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.SETUP,
        players,
        gameOrder,
        pastureSize: store.options?.shortPasture
          ? SHORT_PASTURE_GAME_OVER_THRESHOLD
          : PASTURE_GAME_OVER_THRESHOLD,
      },
    },
  };
};

/**
 * [Question Selection Phase] - Active player selects a question
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const activePlayerId = utils.turnOrder.getActivePlayerId(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.players.addPropertiesToPlayers(players, {
    score: 0,
    answers: {},
  });
  utils.players.unReadyPlayer(players, activePlayerId);

  // Get questions
  const currentQuestions = Array(QUESTIONS_PER_ROUND)
    .fill(store.deckIndex)
    .map((deckIndex, index) => store.deck[deckIndex + index]);

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + QUESTIONS_PER_ROUND,
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.QUESTION_SELECTION,
        round: utils.game.increaseRound(state.round),
        players,
        roundType: determineRoundType(store.gameOrder.length, state.round.current + 1, players),
        activePlayerId,
        currentQuestions,
      },
      stateCleanup: ['ranking', 'pastureChangeStr'],
    },
  };
};

/**
 * [Everybody Writes Phase] - All players write their answers
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const prepareEverybodyWritesPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Modify players
  utils.players.unReadyPlayers(players);

  const currentQuestion = store.customQuestion
    ? store.customQuestion
    : store.deck.find((question: GroupQuestionCardData) => question.id === store.questionId);

  const pastQuestions = store.currentQuestion
    ? store.pastQuestions
    : [...store.pastQuestions, currentQuestion.id];

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.EVERYBODY_WRITES,
        currentQuestion,
        players,
      },
      store: {
        pastQuestions,
      },
      stateCleanup: ['currentQuestions'],
      storeCleanup: ['customQuestion', 'questionId'],
    },
  };
};

/**
 * [Compare Phase] - Players compare and match their answers
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareComparePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const allAnswers = gatherAllAnswers(players);
  const answersList = buildListOfAnswers(allAnswers);

  // Transform player answers into objects
  extendPlayerAnswers(players);

  // Save gallery, the answer(s) with most matches for the question
  store.gallery.push(getMostFrequentAnswers(answersList, state.currentQuestion));

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        gallery: store.gallery,
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.COMPARE,
        players,
        answersList,
        allAnswers,
      },
    },
  };
};

/**
 * [Resolution Phase] - Calculate scores and pasture changes
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Add up score
  utils.players.getListOfPlayers(players).forEach((player) => {
    Object.values<ExtendedPlayerAnswerEntry>(player.answers).forEach((playerAnswer) => {
      player.score += playerAnswer.score;
    });
  });

  // Determine ranking
  const ranking = buildRanking(players, store);

  const lowestScores = determineLowestScores(ranking, state.roundType);

  const highestScores = determineHighestScores(ranking, state.roundType);

  const pastureChange = buildPastureChange(players, lowestScores, highestScores ?? []);

  // Fixed up level based on pastureChange
  updateLevelsForPlayers(players, pastureChange[2]);

  const threshold = store.options?.shortPasture
    ? SHORT_PASTURE_GAME_OVER_THRESHOLD
    : PASTURE_GAME_OVER_THRESHOLD;

  const isGameOver = determineGameOver(players, store.options?.shortPasture);
  const shouldSave = shouldSaveSheep(
    isGameOver,
    threshold,
    pastureChange,
    state?.round.forceLastRound,
    state?.usedSave,
  );

  if (shouldSave) {
    recalculateLastPasture(pastureChange, state.pastureSize);
    updateLevelsForPlayers(players, pastureChange[2]);
  }

  // Calculate distance
  calculateSheepTravelDistance(store, pastureChange);

  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: MENTE_COLETIVA_PHASES.RESOLUTION,
        players,
        ranking,
        pastureChangeStr: JSON.stringify(pastureChange),
        usedSave: Boolean(state?.usedSave) || shouldSave,
        announceSave: shouldSave,
      },
      stateCleanup: ['currentQuestion', 'answersList', 'allAnswers'],
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
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
  const farthestPasturePosition = utils.players.getListOfPlayers(players).reduce((acc, player) => {
    if (player.level > acc) {
      return player.level;
    }
    return acc;
  }, 0);

  const listOfPlayers = utils.players.getListOfPlayers(players);

  // Deal scores:
  listOfPlayers.forEach((player) => {
    player.score = farthestPasturePosition - player.level;
  });

  const winners = listOfPlayers.filter((player) => player.level < farthestPasturePosition);

  const losers = listOfPlayers.filter((player) => player.level === farthestPasturePosition);

  // Figure out final achievements
  const pasturesCount: UID[][] = [];
  listOfPlayers.forEach((player) => {
    if (pasturesCount[player.level]) {
      pasturesCount[player.level].push(player.id);
    } else {
      pasturesCount[player.level] = [player.id];
    }
  });
  // Most dead: died alone
  const lastPasture = pasturesCount[pasturesCount.length - 1];
  if (lastPasture.length === 1) {
    increaseAchievement(store.achievements, lastPasture[0], 'dead', 1);
  }

  // Most lonely: it's the only one alone in a pasture
  const loners = pasturesCount.filter(
    (pastureCount, index, arr) => pastureCount.length === 1 && index !== arr.length - 1,
  );
  if (loners.length === 1) {
    increaseAchievement(store.achievements, loners[0][0], 'lonely', 1);
  }

  // Get achievements
  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.MENTE_COLETIVA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save usedMenteColetivaQuestions to global
  await saveData(store.pastQuestions);

  const gallery = store.gallery ?? [];

  utils.players.cleanup(players, ['sheepId', 'level']);

  // Save
  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: MENTE_COLETIVA_PHASES.GAME_OVER,
        round: state.round,
        players,
        gameEndedAt: Date.now(),
        winners,
        losers,
        achievements,
        gallery,
      },
    },
  };
};
