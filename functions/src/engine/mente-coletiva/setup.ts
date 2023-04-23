// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import {
  MENTE_COLETIVA_PHASES,
  PASTURE_GAME_OVER_THRESHOLD,
  QUESTIONS_PER_ROUND,
  SHORT_PASTURE_GAME_OVER_THRESHOLD,
} from './constants';
// Utils
import utils from '../../utils';
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
  getAchievements,
  calculateSheepTravelDistance,
} from './helpers';
import { GAME_NAMES } from '../../utils/constants';

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
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine turn order
  const { gameOrder } = utils.players.buildGameOrder(players);

  // Build deck
  const deck = buildDeck(additionalData.allQuestions);

  // Add level to players
  utils.players.addPropertiesToPlayers(players, {
    level: 0,
    answers: [],
  });

  utils.players.distributeNumberIds(players, 0, 24, 'sheepId');

  // Setup achievements
  const achievements = utils.achievements.setup(players, store, { secretScore: 0, distance: 0 });

  // Save
  return {
    update: {
      store: {
        deck,
        gameOrder,
        pastQuestions: [],
        deckIndex: 0,
        achievements,
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

export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine active player based on current round
  const activePlayerId = utils.players.getActivePlayer(store.gameOrder, state.round.current + 1);

  // Modify player
  utils.players.addPropertiesToPlayers(players, {
    score: 0,
    answers: [],
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
        round: utils.helpers.increaseRound(state.round),
        players,
        roundType: determineRoundType(store.gameOrder.length, state.round.current + 1, players),
        activePlayerId,
        currentQuestions,
      },
    },
  };
};

export const prepareEverybodyWritesPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Modify players
  utils.players.unReadyPlayers(players);

  const currentQuestion = store.customQuestion
    ? store.customQuestion
    : store.deck.find((question: GroupQuestionCard) => question.id === store.questionId);

  const pastQuestions = store.currentQuestion
    ? store.pastQuestions
    : [...store.pastQuestions, currentQuestion.id];

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.EVERYBODY_WRITES,
        currentQuestion,
        currentQuestions: utils.firebase.deleteValue(),
        players,
      },
      store: {
        pastQuestions,
        customQuestion: utils.firebase.deleteValue(),
        questionId: utils.firebase.deleteValue(),
      },
    },
  };
};

export const prepareComparePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const allAnswers = gatherAllAnswers(players);
  const answersList = buildListOfAnswers(allAnswers);

  // Transform player answers into objects
  extendPlayerAnswers(players);

  // Save
  return {
    update: {
      state: {
        phase: MENTE_COLETIVA_PHASES.COMPARE,
        players,
        answersList,
        allAnswers,
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Add up score
  Object.values(players).forEach((player) => {
    Object.values(player.answers).forEach((playerAnswer: any) => {
      player.score += playerAnswer.score;
    });
  });

  // Determine ranking
  const ranking = buildRanking(players, store);

  const lowestScores = determineLowestScores(ranking, state.roundType);

  const highestScores = determineHighestScores(ranking, state.roundType);

  const pastureChange = buildPastureChange(players, lowestScores, highestScores);

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
    state?.usedSave
  );

  if (shouldSave) {
    recalculateLastPasture(pastureChange, state.pastureSize);
    updateLevelsForPlayers(players, pastureChange[2]);
  }

  // Calculate distance
  calculateSheepTravelDistance(store, players, pastureChange);

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
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const farthestPasturePosition = Object.values(players).reduce((acc, player) => {
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

  // Get achievements
  const achievements = getAchievements(players, store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.MENTE_COLETIVA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
  });

  // Save
  return {
    set: {
      state: {
        phase: MENTE_COLETIVA_PHASES.GAME_OVER,
        round: state.round,
        players,
        gameEndedAt: Date.now(),
        winners,
        losers,
        achievements,
      },
    },
  };
};
