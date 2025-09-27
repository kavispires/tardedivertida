// Constants
import { MAX_ROUNDS, GRID_SIZE, TA_NA_CARA_PHASES, CUSTOM_QUESTION_ID } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData } from './types';
// Utils
import utils from '../../utils';
import type { TestimonyQuestionCard } from '../../types/tdr';
import { keyBy } from 'lodash';
import { addQuestionToDictionary, buildGalleryAndRanking } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder: turnOrder, playerCount } = utils.players.buildGameOrder(players);

  const characters = utils.game.getRandomItems(
    additionalData.allSuspects,
    playerCount * MAX_ROUNDS * 2 + GRID_SIZE,
  );

  // Make activePlayer the last in the turn order so we can always use the next player function
  const activePlayerId = turnOrder.at(-1);

  const achievements = utils.achievements.setup(players, {
    true: 0,
    false: 0,
    voteInOthers: 0,
    tableVotes: 0,
    senior: 0,
    young: 0,
    // auto-adds: gender, build, height, ethnicity
  });

  const identitiesDict = keyBy(characters, 'id');
  const unusedIdentityIds = Object.keys(identitiesDict);

  // To start add one character from the unused to each player
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.availableIdentities = [unusedIdentityIds.pop() as string];
  });

  // Save
  return {
    update: {
      store: {
        usedCharacters: [],
        questions: additionalData.allCards,
        unusedIdentityIds,
        achievements,
      },
      state: {
        phase: TA_NA_CARA_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        turnOrder,
        identitiesDict,
        activePlayerId,
        grid: [],
      },
    },
  };
};

export const prepareIdentitySelectionPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const unusedIdentityIds: CardId[] = store.unusedIdentityIds;
  let grid: CardId[] = [];

  // Give 1 additional character to each player
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.availableIdentities.push(unusedIdentityIds.pop() as string);
  });

  // TODO: Removed used identities from grid first

  // Add new identities the grid, remove duplicates and shuffle
  grid.push(...utils.players.getListOfPlayers(players).flatMap((player) => player.availableIdentities));

  grid = utils.game.shuffle(utils.game.removeDuplicates(grid));

  // Fill the rest of the grid with random identities until the grid is full
  while (grid.length < GRID_SIZE && unusedIdentityIds.length > 0) {
    grid.push(unusedIdentityIds.pop() as string);
  }

  return {
    update: {
      store: {
        unusedIdentityIds,
      },
      state: {
        phase: TA_NA_CARA_PHASES.IDENTITY_SELECTION,
        players,
        grid,
        // Indicate that a new round needs to start
        newRound: true,
      },
      stateCleanup: ['gallery', 'ranking'],
    },
  };
};

export const preparePromptingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = state.newRound ? utils.helpers.increaseRound(state.round) : state.round;
  const questionCount = state.newRound ? 0 : state.questionCount || 0;
  const listOfPlayers = utils.players.getListOfPlayers(players);
  // If players have new identities, apply them
  if (listOfPlayers.some((p) => p.newIdentityId)) {
    listOfPlayers.forEach((player) => {
      if (player.newIdentityId) {
        player.identity = {
          identityId: player.newIdentityId,
          answers: {},
          votes: [], // TODO: verify if needed
        };
      }
      player.availableIdentities = player.availableIdentities.filter(
        (id: string) => id !== player.newIdentityId,
      );
    });

    utils.players.removePropertiesFromPlayers(players, ['newIdentityId']);
  }

  const activePlayerId = utils.players.getNextPlayer(state.turnOrder, state.activePlayerId);
  utils.players.readyPlayers(players, activePlayerId);

  // Get two questions
  const vibesRound = store.options.vibesMode || round.current === MAX_ROUNDS;
  const questions: TestimonyQuestionCard[] = store.questions;
  // In a vibes round, always have 1 question for the non-creative people
  const turnQuestions = utils.game.getRandomItems(questions, vibesRound ? 1 : 2);
  const questionsDict = keyBy(turnQuestions, 'id');

  return {
    update: {
      store: {
        questions: questions.filter((q) => !questionsDict[q.id]),
      },
      state: {
        phase: TA_NA_CARA_PHASES.PROMPTING,
        players,
        round,
        activePlayerId,
        turnQuestions,
        questionCount,
        vibesRound,
      },
      stateCleanup: ['currentQuestionId'],
    },
  };
};

export const prepareAnsweringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  const questionsDict: Dictionary<TestimonyQuestionCard> = state.questionsDict ?? {};
  const activePlayerId: PlayerId = state.activePlayerId;

  // Get the chosen song by the active player
  const turnQuestions: TestimonyQuestionCard[] = state.turnQuestions;
  const currentQuestionId: string = store.currentQuestionId;

  let currentQuestion: TestimonyQuestionCard | undefined;

  if (currentQuestionId.startsWith(CUSTOM_QUESTION_ID)) {
    currentQuestion = {
      id: CUSTOM_QUESTION_ID,
      question: store.customQuestion,
      answer: store.customAnswer || store.currentQuestion,
    };
    // Add question to questions dict
    const newId = addQuestionToDictionary(
      questionsDict,
      activePlayerId,
      state.round.current,
      currentQuestion,
    );
    currentQuestion.id = newId;
  } else {
    currentQuestion = turnQuestions.find((q) => q.id === currentQuestionId);
  }

  // If everything fails
  if (!currentQuestion) {
    currentQuestion = utils.game.getRandomItem(turnQuestions);
  }

  questionsDict[currentQuestion.id] = currentQuestion;
  const questionCount = (state.questionCount || 0) + 1;

  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.ANSWERING,
        players,
        currentQuestionId,
        questionsDict,
        questionCount,
      },
      stateCleanup: ['turnQuestions', 'newRound'],
      storeCleanup: ['currentQuestionId'],
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  utils.players.getListOfPlayers(players).forEach((player) => {
    const answers = player.identity?.answers || {};
    const trueCount = Object.values(answers).filter((a) => a === true).length;
    const falseCount = Object.values(answers).filter((a) => a === false).length;
    utils.achievements.increase(store, player.id, 'true', trueCount);
    utils.achievements.increase(store, player.id, 'false', falseCount);
  });

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: TA_NA_CARA_PHASES.GUESSING,
        players,
      },
      stateCleanup: ['turnQuestion'],
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const { gallery, ranking } = buildGalleryAndRanking(players, state.identitiesDict, store);

  return {
    update: {
      store: {
        achievements: store.achievements,
        gallery: [...((store.gallery as GalleryEntry[]) || []), ...gallery],
      },
      state: {
        phase: TA_NA_CARA_PHASES.REVEAL,
        players,
        questionCount: 0,
        gallery,
        ranking,
      },
      stateCleanup: ['currentQuestionId'],
    },
  };
};
export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // TODO: Implement game over phase

  // TODO: Save data based on gallery

  return {
    update: {
      store: {},
      state: {
        phase: TA_NA_CARA_PHASES.GAME_OVER,
        players,
      },
    },
  };
};
