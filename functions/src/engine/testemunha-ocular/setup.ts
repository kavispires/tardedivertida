// Types
import type { TestimonyQuestionCard } from '../../types/tdr';
import type {
  FirebaseStateData,
  FirebaseStoreData,
  ResourceData,
  TestemunhaOcularHistoryEntry,
} from './types';
// Constants
import { MAX_ROUNDS, QUESTION_COUNT, TESTEMUNHA_OCULAR_PHASES } from './constants';
// Helpers
import utils from '../../utils';
import { calculateScore, getAchievements, getPoolOfSuspects, getQuestions } from './helpers';
import { GAME_NAMES } from '../../utils/constants';
import { difference, keyBy } from 'lodash';
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

  const shuffledAvailableCards = utils.game.shuffle(additionalData.allCards);

  // Build deck
  const deck = utils.game.getRandomItems(shuffledAvailableCards, QUESTION_COUNT);

  const achievements = utils.achievements.setup(players, {
    witness: 0,
    releases: [],
  });

  // Save
  return {
    update: {
      store: {
        deck,
        questionIndex: -2,
        questionerIndex: -1,
        turnOrder: [],
        gameOrder: [],
        achievements,
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
  additionalPayload: PlainObject,
): Promise<SaveGamePayload> => {
  const witnessId = additionalPayload?.witnessId ?? state.witnessId;

  utils.achievements.increase(store, witnessId, 'witness', 1);

  const newTurnOrder = utils.players.buildGameOrder(players).gameOrder.filter((id) => id !== witnessId);

  const turnOrder = store.turnOrder.length > 0 ? store.turnOrder : newTurnOrder;

  const eliminatedSuspects: CardId[] = state?.eliminatedSuspects ?? [];

  if (state.questionerId) {
    utils.achievements.push(store, state.questionerId, 'releases', eliminatedSuspects.length);
  }

  // Determine questioner player
  const questionerIndex = (store.questionerIndex ?? -1) + 1;
  const questionerId = turnOrder[questionerIndex % turnOrder.length];
  // Determine questions
  const questionIndex = (store.questionIndex ?? -2) + 2;
  const questions = getQuestions(store.deck, questionIndex);

  // Calculate score and move eliminated suspects
  const previouslyEliminatedSuspects: CardId[] = [
    ...(state?.previouslyEliminatedSuspects ?? []),
    ...(state?.eliminatedSuspects ?? []),
  ];
  const suspectsIds: CardId[] = state.suspectsIds ?? [];

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
        questionIndex,
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
      },
      stateCleanup: ['question', 'testimony', 'eliminatedSuspects'],
    },
  };
};

export const prepareQuestioningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject,
): Promise<SaveGamePayload> => {
  const question = store.deck.find((card: TestimonyQuestionCard) => card.id === additionalPayload.questionId);

  utils.players.readyPlayers(players, state.witnessId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.QUESTIONING,
        players,
        question,
      },
      stateCleanup: ['questions'],
    },
  };
};

export const prepareTrialPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject,
): Promise<SaveGamePayload> => {
  const testimony = additionalPayload?.testimony ?? state.testimony;

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

  utils.players.readyPlayers(players, state.questionerId);

  // Save
  return {
    update: {
      state: {
        phase: TESTEMUNHA_OCULAR_PHASES.TRIAL,
        players,
        testimony: additionalPayload?.testimony ?? state.testimony,
        history,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalPayload: PlainObject,
): Promise<SaveGamePayload> => {
  await utils.firestore.markGameAsComplete(gameId);

  const isWin = additionalPayload?.win ?? false;

  const previouslyEliminatedSuspects: CardId[] = [
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

  const winners = additionalPayload?.win ? utils.players.getListOfPlayers(players) : [];

  const achievements = getAchievements(store, state.witnessId ?? '');

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TESTEMUNHA_OCULAR,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const perpetratorId = state.perpetratorId ?? '';

  // Save Data (usedSuspects, usedQuestions, relationships)
  await saveData(gameId, history, isWin, perpetratorId, utils.players.getPlayerCount(players));

  utils.players.cleanup(players, []);

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
        outcome: isWin ? 'WIN' : 'LOSE',
        history,
        suspectsDict: state.suspectsDict,
        suspectsIds: state.suspectsIds,
        perpetratorId: state.perpetratorId,
        achievements,
        witnessId: state.witnessId,
        previouslyEliminatedSuspects: previouslyEliminatedSuspects,
      },
    },
  };
};
