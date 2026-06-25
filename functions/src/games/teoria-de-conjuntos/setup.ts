import { cloneDeep, shuffle } from 'lodash';
// Types
import type { ItemData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, Guess, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  JUDGE_HAND_QUANTITY,
  OUTCOME,
  ROUNDS_PER_PLAYER,
  STARTING_ITEMS_PER_PLAYER_COUNT,
  TEORIA_DE_CONJUNTOS_PHASES,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { setupAchievements, increaseAchievement, calculateAchievements } from './achievements';
import { createVennDiagram } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  // Make deck dictionary
  const deckIds: UID[] = [];
  const deck = shuffle(additionalData.items).reduce((acc: Dictionary<ItemData>, item) => {
    acc[item.id] = item;
    deckIds.push(item.id);
    return acc;
  }, {});

  const items: Dictionary<ItemData> = {};

  const playerCount = utils.players.getPlayerCount(players);

  // Assign items to players
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.hand = Array(STARTING_ITEMS_PER_PLAYER_COUNT[playerCount])
      .fill('')
      .map(() => deckIds.pop())
      .filter(Boolean);

    player.hand.forEach((cardId: UID) => {
      items[cardId] = deck[cardId];
    });
  });

  // Handle judge cards
  const judgeHand = Array(JUDGE_HAND_QUANTITY)
    .fill('')
    .map(() => deckIds.pop())
    .filter(Boolean);
  judgeHand.forEach((cardId: UID | undefined) => {
    if (cardId) {
      items[cardId] = deck[cardId];
    }
  });

  // Determine diagram type
  const isTripleDiagram = !store.options.easyGame;

  const diagrams = createVennDiagram(isTripleDiagram);

  if (!isTripleDiagram) {
    delete additionalData.diagrams.context;
    delete additionalData.examples.context;
  }

  // Save
  return {
    update: {
      store: {
        deck,
        deckIds,
        judgeHand,
      },
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: STARTING_ITEMS_PER_PLAYER_COUNT[playerCount] + ROUNDS_PER_PLAYER * playerCount,
        },
        items,
        diagrams,
        targetItemsCount: STARTING_ITEMS_PER_PLAYER_COUNT[playerCount],
        solutions: additionalData.diagrams,
        examples: additionalData.examples,
      },
    },
  };
};
/**
 * [Judge Selection Phase] - Select judge and setup diagrams
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */ export const prepareJudgeSelectionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        achievements,
      },
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.JUDGE_SELECTION,
        players,
      },
    },
  };
};

export const prepareItemPlacementPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  currentGuess: Partial<Guess>,
): Promise<SaveGamePayload> => {
  const { items, diagrams, judgeId } = state;
  const { deck, deckIds } = store;

  if (store.judgeHand && judgeId) {
    players[judgeId].hand.push(...store.judgeHand);
  }

  // Create player order in a way that the judge is always the first player
  const getPlayerOrder = () => {
    const po = utils.turnOrder.create(players, undefined, false, [judgeId]);
    return [judgeId, ...po.gameOrder];
  };

  const isNotTheJudge = state.activePlayerId !== judgeId;

  // Determine or get player order
  let turnOrder: string[] = state.turnOrder || getPlayerOrder();

  const isNewRound = currentGuess.outcome !== OUTCOME.CONTINUE;

  // Place item on diagram (and remove it from player)
  if (currentGuess.outcome !== OUTCOME.PENDING) {
    const hand: UID[] = players[state.activePlayerId].hand;

    const itemIndex = hand.indexOf(currentGuess.itemId ?? '-');
    const itemId = hand.splice(itemIndex, 1)[0];

    if (itemId && currentGuess.correctArea && diagrams[currentGuess.correctArea]) {
      diagrams[currentGuess.correctArea].itemsIds.push(itemId);
    }
  }

  // If they got it wrong (WRONG), give them a new item.
  if (currentGuess.outcome === OUTCOME.WRONG && state.activePlayerId && isNotTheJudge) {
    const player = players[state.activePlayerId];
    const newItemId = deckIds.pop();
    const newItem = deck[newItemId];
    items[newItemId] = newItem;
    player.hand.push(newItemId);
  }

  // Score
  if (currentGuess.outcome === OUTCOME.CONTINUE && isNotTheJudge) {
    const player = players[state.activePlayerId];
    player.score += 1;
  }

  const previousActivePlayerId = state.activePlayerId ?? null;
  if (previousActivePlayerId && isNotTheJudge) {
    increaseAchievement(
      store.achievements,
      state.activePlayerId,
      'wrong',
      currentGuess.outcome === OUTCOME.CONTINUE ? 0 : 1,
    );
  }

  // If player got it right (CONTINUE), just continue with the same player.
  const shouldTriggerNewRound = !isNotTheJudge || isNewRound;
  // Determine round if outcome has been wrong or new
  const round: Round = shouldTriggerNewRound ? utils.game.increaseRound(state.round) : state.round;
  let activePlayerId: string = state.activePlayerId;
  // Determine the active player - if it's a new round, get the next player in the order, otherwise keep the same active player
  if (shouldTriggerNewRound) {
    // However, if the current active player is the last player in the order, we need to push the first non-judge player to the end of the order.
    if (activePlayerId === turnOrder[turnOrder.length - 1]) {
      turnOrder = utils.turnOrder.rotate(turnOrder, 1, judgeId);
    }

    activePlayerId = utils.turnOrder.getActivePlayerId(turnOrder, round.current);
  }

  utils.players.readyPlayers(players, activePlayerId);

  const previousGuess = previousActivePlayerId ? cloneDeep(currentGuess) : null;

  const newCurrentGuess = {
    itemId: '',
    playerId: activePlayerId,
    suggestedArea: '',
    correctArea: null,
    outcome: OUTCOME.PENDING,
  };

  return {
    update: {
      store: {
        deck,
        deckIds,
        achievements: store.achievements,
      },
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.ITEM_PLACEMENT,
        players,
        turnOrder,
        round,
        items,
        diagrams,
        activePlayerId,
        currentGuess: newCurrentGuess,
        previousGuess,
        previousActivePlayerId,
      },
      storeCleanup: ['judgeHand'],
    },
  };
};
/**
 * [ItemData Placement Phase] - Players place items in the Venn diagram
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 *//**
 * [Evaluation Phase] - Judge evaluates item placements
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.readyPlayers(players, state.judgeId);

  // Achievements
  const currentGuess: Guess = state.currentGuess;
  const achievementKey = {
    A: 'attributeCircle',
    W: 'wordCircle',
    C: 'contextCircle',
    O: 'outside',
  };

  const isNotTheJudge = state.activePlayerId !== state.judgeId;

  currentGuess.suggestedArea.split('').forEach((area) => {
    if (achievementKey[area] && isNotTheJudge) {
      increaseAchievement(store.achievements, state.activePlayerId, achievementKey[area], 1);
    }
  });

  if (currentGuess.suggestedArea.length > 1 && isNotTheJudge) {
    increaseAchievement(store.achievements, state.currentPlayerId, 'intersection', 1);
  }

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.EVALUATION,
        players,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  currentGuess: Partial<Guess>,
): Promise<SaveGamePayload> => {
  // Cleanup resolution first
  const { items, diagrams } = state;
  const { deck, deckIds } = store;

  // Place item on diagram (and remove it from player)
  if (currentGuess.outcome !== OUTCOME.PENDING) {
    const hand: UID[] = players[state.activePlayerId].hand;

    const itemIndex = hand.indexOf(currentGuess.itemId ?? '-');
    const itemId = hand.splice(itemIndex, 1)[0];

    if (itemId && currentGuess.correctArea && diagrams[currentGuess.correctArea]) {
      diagrams[currentGuess.correctArea].itemsIds.push(itemId);
    }
  }

  // If they got it wrong (WRONG), give them a new item.
  if (currentGuess.outcome === OUTCOME.WRONG && state.activePlayerId) {
    const player = players[state.activePlayerId];
    const newItemId = deckIds.pop();
    const newItem = deck[newItemId];
    items[newItemId] = newItem;
    player.hand.push(newItemId);
  }

  if (currentGuess.outcome === OUTCOME.WIN) {
    const player = players[state.activePlayerId];
    player.score += 1;
  } else {
    increaseAchievement(
      store.achievements,
      state.activePlayerId,
      'wrong',
      currentGuess.outcome === OUTCOME.CONTINUE || currentGuess.outcome === OUTCOME.WIN ? 0 : 1,
    );
  }

  // Achieve the judge
  increaseAchievement(store.achievements, state.judgeId, 'judge', 1);

  const winners = utils.players.determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TEORIA_DE_CONJUNTOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        items: items,
        diagrams: diagrams,
        solutions: state.solutions,
        judgeId: state.judgeId,
        targetItemsCount: state.targetItemsCount,
        lastGuess: currentGuess,
        lastActivePlayerId: state.activePlayerId,
      },
    },
  };
};
