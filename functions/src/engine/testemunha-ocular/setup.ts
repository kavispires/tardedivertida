// Types
import type { TestimonyQuestionCard } from '../../types/tdr';
import type {
  FirebaseStateData,
  FirebaseStoreData,
  ResourceData,
  TestemunhaOcularHistoryEntry,
} from './types';
// Constants
import { MAX_ROUNDS, OUTCOME, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Helpers
import utils from '../../utils';
import {
  buildQuestionsDeck,
  calculateScore,
  getAchievements,
  getNewQuestions,
  getPoolOfSuspects,
} from './helpers';
import { GAME_NAMES } from '../../utils/constants';
import { difference, keyBy, sample } from 'lodash';
import { saveData } from './data';

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
  const isGbExclusive = store.options?.gbExclusive ?? false;
  const suspects = getPoolOfSuspects(
    additionalData.allSuspects,
    store.language,
    isLargePool,
    isTargetedPool,
    isGbExclusive,
  );

  const suspectsIds = suspects.map((s) => s.id);
  const suspectsDict = keyBy(suspects, 'id');

  const perpetratorId = utils.game.getRandomItem(suspects).id;

  // Build deck
  const deck = buildQuestionsDeck(additionalData.allCards);

  const achievements = utils.achievements.setup(players, {
    witness: 0,
    releases: [],
    foundThePerpetrator: 0,
  });

  // Determine the reason
  const perpetratorGender = suspectsDict[perpetratorId].gender;
  const reason = sample(
    Object.values(additionalData.allReasons).filter((reason) => {
      if (perpetratorGender === 'male' && reason.feature === 'female') return false;
      if (perpetratorGender === 'female' && reason.feature === 'male') return false;
      return true;
    }),
  );

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

export const prepareQuestionSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const witnessId = state.witnessId;

  utils.achievements.increase(store, witnessId, 'witness', 1);

  const newTurnOrder = utils.turnOrder.create(players).gameOrder.filter((id) => id !== witnessId);

  const turnOrder = store.turnOrder.length > 0 ? store.turnOrder : newTurnOrder;

  const eliminatedSuspects: UID[] = state?.eliminatedSuspects ?? [];

  if (state.questionerId) {
    utils.achievements.push(store, state.questionerId, 'releases', eliminatedSuspects.length);
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
        round: utils.helpers.increaseRound(state.round),
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

export const prepareQuestioningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const question = store.deck.find((card: TestimonyQuestionCard) => card.id === state.questionId);
  const questions = (state.questions || []).filter((q: TestimonyQuestionCard) => q.id !== state.questionId);

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

export const prepareTrialPhase = async (
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

export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  await utils.firestore.markGameAsComplete(gameId);

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
        utils.achievements.increase(store, player.id, 'foundThePerpetrator', 1);
      }
    });
  }

  const achievements = getAchievements(store, witnessId);

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

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
