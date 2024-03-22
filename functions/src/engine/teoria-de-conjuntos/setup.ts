// Constants
import { MAX_ROUNDS, OUTCOME, TEORIA_DE_CONJUNTOS_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Guess, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { Item } from '../../types/tdr';
import { createVennDiagram } from './helpers';
import { cloneDeep } from 'lodash';

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
  // Make deck dictionary
  const deckIds: CardId[] = [];
  const deck = utils.game.shuffle(additionalData.items).reduce((acc: Collection<Item>, item) => {
    acc[item.id] = item;
    deckIds.push(item.id);
    return acc;
  }, {});

  const items: Collection<Item> = {};

  // Assign items to players
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.hand = [deckIds.pop(), deckIds.pop(), deckIds.pop()].filter(Boolean);

    player.hand.forEach((cardId: CardId) => {
      items[cardId] = deck[cardId];
    });
  });

  // Determine diagram type
  const isTripleDiagram = !store.options.easyGame;

  const diagrams = createVennDiagram(isTripleDiagram);

  // Save
  return {
    update: {
      store: {
        deck,
        deckIds: [],
      },
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        items,
        diagrams,
        solutions: additionalData.diagrams,
        examples: additionalData.examples,
      },
    },
  };
};

export const prepareJudgeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    attributeCircle: 0,
    wordCircle: 0,
    contextCircle: 0,
    outside: 0,
    intersection: 0,
    judge: 0,
  });

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

export const prepareDiagramPlacementPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  currentGuess: Partial<Guess>
): Promise<SaveGamePayload> => {
  const items = state.items;

  // Determine or get player order
  const turnOrder =
    state.turnOver || utils.players.buildGameOrder(players, undefined, false, [state.judgeId]).gameOrder;

  const isNewRound = currentGuess.outcome !== OUTCOME.CONTINUE;

  // Determine round if outcome has been wrong or new
  const round: Round = isNewRound ? utils.helpers.increaseRound(state.round) : state.round;

  // Place item on diagram (and remove it from player)
  if (currentGuess.outcome !== OUTCOME.PENDING) {
    const player = players[state.activePlayerId];
    const itemId = player.hand.pop();
    if (itemId && currentGuess.correctArea && state.diagrams[currentGuess.correctArea]) {
      const diagram = state.diagrams[currentGuess.correctArea];
      diagram.itemsIds.push(itemId);
    }
  }

  // If they got it wrong (WRONG), give them a new item.
  if (currentGuess.outcome === OUTCOME.WRONG && state.activePlayerId) {
    const player = players[state.activePlayerId];
    const newItemId = store.deckIds.pop();
    const newItem = store.deck[newItemId];
    items[newItemId] = newItem;
    player.hand.push(newItemId);
  }

  // If player got it right (CONTINUE), just continue with the same player.
  const activePlayerId = isNewRound
    ? utils.players.getActivePlayer(turnOrder, round.current)
    : state.activePlayerId;

  utils.players.unReadyPlayer(players, activePlayerId);

  const previousGuess = cloneDeep(currentGuess);
  const newCurrentGuess = {
    itemId: '',
    playerId: activePlayerId,
    suggestedArea: '',
    correctArea: null,
    outcome: OUTCOME.PENDING,
  };

  return {
    update: {
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.DIAGRAM_PLACEMENT,
        players,
        turnOrder,
        round,
        activePlayerId,
        currentGuess: newCurrentGuess,
        previousGuess,
        items,
      },
    },
  };
};

export const prepareEvaluationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  return {
    update: {
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.EVALUATION,
        players,
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

  const achievements = [];

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.TEORIA_DE_CONJUNTOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: TEORIA_DE_CONJUNTOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
      },
    },
  };
};
