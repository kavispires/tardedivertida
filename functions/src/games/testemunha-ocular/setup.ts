import { difference, keyBy, sampleSize } from 'lodash';
// Types
import type { TestimonyQuestionCardData } from '../../types/tdr';
import type {
  FirebaseStateData,
  FirebaseStoreData,
  ResourceData,
  TestemunhaOcularHistoryEntry,
} from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import { MAX_ROUNDS, OUTCOME, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import {
  setupAchievements,
  calculateAchievements,
  pushAchievement,
  setTruthyAchievement,
} from './achievements';
import { saveData } from './data';
import { buildQuestionsDeck, calculateScore, getNewQuestions, getPoolOfSuspects } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Build suspects grid
  const isLargePool = store.options?.largePool ?? false;
  const isTargetedPool = store.options?.targetedPool ?? false;

  const suspects = getPoolOfSuspects(additionalData.allSuspects, store.language, isLargePool, isTargetedPool);

  const suspectsIds = suspects.map((s) => s.id);
  const suspectsDict = keyBy(suspects, 'id');

  const perpetratorId = sampleSize(suspects, 1)[0].id;

  // Build deck
  const deck = buildQuestionsDeck(additionalData.allCards);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Determine the reason
  const perpetratorGender = suspectsDict[perpetratorId].gender;
  const reason = sampleSize(
    Object.values(additionalData.allReasons).filter((reason) => {
      if (perpetratorGender === 'male' && reason.feature === 'female') return false;
      if (perpetratorGender === 'female' && reason.feature === 'male') return false;
      return true;
    }),
    1,
  )[0];

  // Save
  return {
    update: {
      store: {
        deck,
        questionerIndex: -1,
        turnOrder: [],
        gameOrder: [],
        achievements,
        reason,
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        suspectsDict,
        suspectsIds,
        perpetratorId,
        status: {
          questions: 0,
          totalTime: MAX_ROUNDS,
          suspects: suspectsIds.length,
          released: 0,
          score: 0,
        },
        questions: [],
        history: [],
      },
    },
  };
};

/**
 * [Witness Selection Phase] - Select the witness for the round
 * @param players - The players object
 */
export const prepareWitnessSelectionPhase = async (players: Players): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION,
        players,
      },
    },
  };
};

/**
 * [Question Selection Phase] - Witness selects questions to answer
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const witnessId = state.witnessId;

  const newTurnOrder = utils.turnOrder.create(players).gameOrder.filter((id) => id !== witnessId);

  const turnOrder = store.turnOrder.length > 0 ? store.turnOrder : newTurnOrder;

  const eliminatedSuspects: UID[] = state?.eliminatedSuspects ?? [];

  if (state.questionerId) {
    pushAchievement(store, state.questionerId, 'releases', eliminatedSuspects.length);
  }

  // Determine questioner player
  const questionerIndex = (store.questionerIndex ?? -1) + 1;
  const questionerId = turnOrder[questionerIndex % turnOrder.length];
  // Determine questions
  const questions = [...getNewQuestions(store.deck, state.status.questions), ...state.questions].slice(0, 4);

  // Calculate score and move eliminated suspects
  const previouslyEliminatedSuspects: UID[] = [
    ...(state?.previouslyEliminatedSuspects ?? []),
    ...(state?.eliminatedSuspects ?? []),
  ];
  const suspectsIds: UID[] = state.suspectsIds ?? [];

  // Calculate score
  const score = calculateScore(state.status.score ?? 0, state.round.current, eliminatedSuspects.length);

  // Add previously eliminated suspects to the testimony history
  const history: TestemunhaOcularHistoryEntry[] = state.history ?? [];
  if (state.question && history[0]) {
    const eliminatedSuspects = state.eliminatedSuspects ?? [];
    const remainingSuspects = difference(suspectsIds, previouslyEliminatedSuspects);
    history[0].eliminated = eliminatedSuspects;
    history[0].remaining = remainingSuspects;
  }

  utils.players.readyPlayers(players, questionerId);

  // Save
  return {
    update: {
      store: {
        turnOrder,
        gameOrder: turnOrder,
        questionerIndex,

        achievements: store.achievements,
      },
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION,
        players,
        round: utils.game.increaseRound(state.round),
        questionerId,
        questions,
        witnessId,
        previouslyEliminatedSuspects: previouslyEliminatedSuspects,
        status: {
          ...state.status,
          score,
          questions: state.status.questions + 1,
          released: previouslyEliminatedSuspects.length,
        },
        history,
        outcome: state.outcome ?? OUTCOME.CONTINUE,
      },
      stateCleanup: ['question', 'questionId', 'testimony', 'eliminatedSuspects'],
    },
  };
};
/**
 * [Questioning Phase] - Players question the witness
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareQuestioningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const question = store.deck.find((card: TestimonyQuestionCardData) => card.id === state.questionId);
  const questions = (state.questions || []).filter(
    (q: TestimonyQuestionCardData) => q.id !== state.questionId,
  );

  utils.players.readyPlayers(players, state.witnessId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTIONING,
        players,
        question,
        questions,
      },
    },
  };
};
/**
 * [Trial Phase] - Players vote on suspect identifications
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareTrialPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const testimony: boolean = state.testimony;

  const history: TestemunhaOcularHistoryEntry[] = state.history ?? [];
  history.unshift({
    id: '',
    question: '',
    answer: '',
    statement: testimony,
    eliminated: [],
    remaining: [],
    ...state.question,
  });

  // In final showdown, skip to FINAL_TRIAL phase
  if (state.outcome === OUTCOME.FINAL_SHOWDOWN) {
    utils.players.unReadyPlayers(players, state.witnessId);

    return {
      update: {
        state: {
          phase: TESTEMUNHA_OCULAR_PHASES.FINAL_TRIAL,
          players,
          testimony,
          history,
        },
        stateCleanup: ['questionerId'],
      },
    };
  }

  utils.players.readyPlayers(players, state.questionerId);
  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.TRIAL,
        players,
        testimony,
        history,
      },
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
  setTruthyAchievement(store.achievements, state.witnessId, 'witness');

  const perpetratorId: UID = state.perpetratorId ?? '';
  const witnessId: UID = state.witnessId;
  const listOfPlayers = utils.players.getListOfPlayers(players);

  // Determine what suspect got the most votes
  const suspectVoteCount: Dictionary<number> = {};
  listOfPlayers.forEach((player) => {
    if (player.suspectId) {
      suspectVoteCount[player.suspectId] = (suspectVoteCount[player.suspectId] || 0) + 1;
    }
  });
  // Find suspect with most votes
  let maxVotes = 0;
  let votedSuspectIds: UID[] = [];
  Object.entries(suspectVoteCount).forEach(([suspectId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      votedSuspectIds = [suspectId];
    } else if (count === maxVotes) {
      votedSuspectIds.push(suspectId);
    }
  });
  // Players lose if it's a tie or the perpetrator is not among the voted suspects
  const isTie = votedSuspectIds.length > 1;
  const isPerpetratorVoted = votedSuspectIds.includes(perpetratorId);
  if (isTie || !isPerpetratorVoted) {
    state.outcome = OUTCOME.LOSE;
  } else {
    state.outcome = OUTCOME.WIN;
  }

  // What's the released suspect (not voted, or least voted)
  const newlyReleasedSuspects: UID[] = difference(state.suspectsIds, [
    ...state.previouslyEliminatedSuspects,
    ...votedSuspectIds,
  ]);

  if (newlyReleasedSuspects.length > 0) {
    state.eliminatedSuspects = newlyReleasedSuspects;
    state.status = {
      ...state.status,
      released: state.status.released + newlyReleasedSuspects.length,
    };
  }

  const isWin = state.outcome === OUTCOME.WIN;
  const previouslyEliminatedSuspects: UID[] = [
    ...(state?.previouslyEliminatedSuspects ?? []),
    ...(state?.eliminatedSuspects ?? []),
  ];

  const history: TestemunhaOcularHistoryEntry[] = state.history ?? [];
  if (isWin && state.question && history[0]) {
    const eliminatedSuspects = state.eliminatedSuspects ?? [];
    const remainingSuspects = difference(state.suspectsIds, previouslyEliminatedSuspects);
    history[0].eliminated = eliminatedSuspects;
    history[0].remaining = remainingSuspects;
  }

  const winners = isWin
    ? listOfPlayers.filter((player) => {
        if (witnessId === player.id) return true;
        return player.suspectId === perpetratorId;
      })
    : [];

  if (!isWin) {
    listOfPlayers.forEach((player) => {
      if (player.suspectId === perpetratorId) {
        setTruthyAchievement(store.achievements, player.id, 'foundThePerpetrator');
      }
    });
  }

  const achievements = calculateAchievements(store.achievements, {
    // The witness does not score for releases
    releases: utils.players.getListOfPlayersIds(players, false, [state.witnessId]),
  });

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TESTEMUNHA_OCULAR,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save Data (usedSuspects, usedQuestions, relationships)
  await saveData(gameId, history, isWin, perpetratorId, utils.players.getPlayerCount(players));

  utils.players.cleanup(players, ['suspectId']);

  markGameAsComplete(gameId);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.GAME_OVER,
        round: state.round,
        players,
        gameEndedAt: Date.now(),
        status: state.status,
        outcome: isWin ? OUTCOME.WIN : OUTCOME.LOSE,
        history,
        suspectsDict: state.suspectsDict,
        suspectsIds: state.suspectsIds,
        perpetratorId,
        achievements,
        witnessId,
        winners,
        previouslyEliminatedSuspects: previouslyEliminatedSuspects,
        reason: store.reason,
      },
    },
  };
};
