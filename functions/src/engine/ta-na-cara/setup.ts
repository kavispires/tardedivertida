// Constants
import {
  BASE_POINTS,
  MINIMUM_POINTS,
  MINIMUM_SUSPECTS,
  QUESTIONS_PER_PLAYER,
  TA_NA_CARA_PHASES,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { CharacterFace, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { buildRankingAndOutcome } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder: turnOrder, playerCount } = utils.players.buildGameOrder(players);

  // Build characters list
  const charactersCount = Math.max(playerCount * 2, MINIMUM_SUSPECTS);

  const selectedCharacters: CharacterFace[] = utils.game
    .getRandomItems(additionalData.allSuspects, charactersCount)
    .map((character) => ({
      ...character,
      revealed: false,
    }));

  const charactersDict = utils.helpers.buildObjectFromList(selectedCharacters, 'id');

  const gameQuestions = utils.game.getRandomItems(
    additionalData.allCards,
    playerCount * QUESTIONS_PER_PLAYER
  );

  const questionsDict = utils.helpers.buildObjectFromList(gameQuestions, 'id');

  // Deal questions to players
  utils.game.dealList(Object.keys(questionsDict), players, QUESTIONS_PER_PLAYER, 'questions');

  // Assign a random character to each player
  let charactersIds = utils.game.shuffle(Object.keys(charactersDict));

  utils.players.getListOfPlayers(players).forEach((player, index) => {
    const cardId = charactersIds[index];
    charactersDict[cardId].playerId = player.id;
    player.characterId = cardId;
  });

  // Order characters by name for easy UI
  charactersIds = charactersIds.sort((a, b) => {
    const nameA = charactersDict[a].name[store.language].toLowerCase();
    const nameB = charactersDict[b].name[store.language].toLowerCase();
    return nameA.localeCompare(nameB);
  });

  utils.players.addPropertiesToPlayers(players, { answers: [], history: {} });

  // Save
  return {
    update: {
      store: {
        usedCharacters: [],
      },
      state: {
        phase: TA_NA_CARA_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: playerCount * QUESTIONS_PER_PLAYER + charactersCount - playerCount,
        },
        turnOrder,
        charactersDict,
        questionsDict,
        charactersIds,
      },
    },
  };
};

export const preparePromptPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const activePlayerId = utils.players.getNextPlayer(state.turnOrder, state.activePlayerId);

  utils.players.readyPlayers(players, activePlayerId);

  // Gather answers if any
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.currentAnswer !== undefined) {
      player.answers.unshift({ [store.currentQuestionId]: player.currentAnswer });
      delete player.currentAnswer;
    }
  });

  utils.players.removePropertiesFromPlayers(players, ['guess', 'currentAnswer']);

  // Save
  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.PROMPT,
        players,
        activePlayerId,
        round: activePlayerId === state.turnOrder[0] ? utils.helpers.increaseRound(state.round) : state.round,
      },
      stateCleanup: ['targetId', 'correct', 'ranking', 'result'],
    },
  };
};

export const prepareAnsweringPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Mark question as used for the current player
  players[state.activePlayerId].questions = players[state.activePlayerId].questions.filter(
    (cardId: CardId) => cardId !== store.currentQuestionId
  );

  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.ANSWERING,
        players,
        currentQuestionId: store.currentQuestionId,
      },
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, store.currentTargetId);

  // Possible points: 15 - number of questions answered) with the minimum of 1 point
  const possiblePoints = BASE_POINTS - (players?.[store.currentTargetId]?.answers.length ?? 0);

  // Save
  return {
    update: {
      state: {
        phase: TA_NA_CARA_PHASES.GUESSING,
        players,
        targetId: store.currentTargetId,
        points: Math.max(possiblePoints, MINIMUM_POINTS),
      },
      storeCleanup: ['currentTargetId', 'currentQuestionId'],
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const charactersDict = state.charactersDict;
  // Calculate scores and correct guesses and assign, build ranking
  const { correct, ranking, result } = buildRankingAndOutcome(
    players,
    state.targetId,
    state.points,
    state.charactersDict
  );

  // If a player can't have a character, trigger game over
  const forceLastRound =
    state.forceLastRound ||
    utils.players.getListOfPlayers(players).some((player) => player.characterId === null);

  if (result) {
    const res = result as Partial<Player>;
    store.usedCharacters.push({
      id: res.playerId,
      avatarId: res.avatarId,
      name: res.name,
      characterId: res.characterId,
      answers: res.answers,
    });
  }

  // Save
  return {
    update: {
      store,
      state: {
        phase: TA_NA_CARA_PHASES.REVEAL,
        players,
        correct,
        ranking,
        charactersDict,
        result,
        round: { ...state.round, forceLastRound },
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

  // Get current characters to the usedCharacters list to make the final gallery
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (
      player.characterId &&
      store.usedCharacters.some((c: Partial<Player>) => c.characterId !== player.characterId)
    ) {
      store.usedCharacters.push({
        id: player.id,
        avatarId: player.avatarId,
        name: player.name,
        characterId: player.characterId,
        answers: player.answers,
      });
    }
  });

  utils.players.removePropertiesFromPlayers(players, [
    'answers',
    'history',
    'characterId',
    'guess',
    'questions',
  ]);

  const gallery = store.usedCharacters.reverse();

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TA_NA_CARA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
  });

  return {
    update: {
      store: {
        usedCharacters: gallery,
      },
    },
    set: {
      state: {
        phase: TA_NA_CARA_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        gallery,
        questionsDict: state.questionsDict,
      },
    },
  };
};
