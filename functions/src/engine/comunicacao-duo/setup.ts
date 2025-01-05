// Constants
import { AFFILIATIONS, COMUNICACAO_DUO_PHASES, MAX_ROUNDS, SIDES, STATUS } from './constants';
// Types
import type { DeckEntry, FirebaseStateData, FirebaseStoreData, HistoryEntry, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { countDeliverablesLeft, getAchievements } from './helpers';
import { GAME_NAMES } from '../../utils/constants';
import { print } from '../../utils/helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    clueQuantity: [],
    deliveries: [],
    correctDeliveries: 0,
    neutralDeliveries: 0,
    tabooDeliveries: 0,
  });

  const deckType = store.options?.deckType ?? 'items';
  const clueInputType = store.options?.clueInputType ?? 'drawing';

  utils.players.getListOfPlayers(players).forEach((player, index) => {
    player.side = SIDES[index % 2];
  });

  const summary = countDeliverablesLeft(resourceData.deck);

  // Save
  return {
    update: {
      store: {
        achievements,
      },
      state: {
        phase: COMUNICACAO_DUO_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
          forceLastRound: false,
        },
        deckType,
        clueInputType,
        status: STATUS.IDLE,
        deck: resourceData.deck,
        history: [],
        summary,
      },
    },
  };
};

export const prepareAskingForSomething = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);

  const stateUpdate: PlainObject = {};
  // If round 1, no active player, otherwise, active player is the last active player
  if (!state.turnOrder) {
    utils.players.unReadyPlayers(players);
  } else {
    stateUpdate.requesterId = utils.players.getNextPlayer(state.turnOrder, state.requesterId);
    utils.players.unReadyPlayers(players, stateUpdate.requesterId);
  }

  // Unready players
  utils.players.unReadyPlayers(players);

  return {
    update: {
      state: {
        phase: COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING,
        players,
        round,
        ...stateUpdate,
      },
      stateCleanup: ['clue', 'deliverable', 'clueQuantity', 'nexPhase', 'entryIdToAnimate'],
    },
  };
};

export const prepareDeliveringSomethingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const stateUpdate: PlainObject = {
    turnOrder: state.turnOrder,
    requesterId: state.requesterId,
    history: state.history,
  };

  // If not state.turnOrder, create one based on the current player
  if (!state.turnOrder) {
    const listOfPlayers = utils.players.getListOfPlayers(players);
    if (listOfPlayers[0].clue) {
      stateUpdate.requesterId = listOfPlayers[0].id;
      stateUpdate.turnOrder = [listOfPlayers[0].id, listOfPlayers[1].id];
    } else {
      stateUpdate.requesterId = listOfPlayers[1].id;
      stateUpdate.turnOrder = [listOfPlayers[1].id, listOfPlayers[0].id];
    }
  }

  // Grab clue and pasted in the state, clear clue from player, unready other player
  if (!state.clue) {
    stateUpdate.clue = players[stateUpdate.requesterId].clue;
    stateUpdate.clueQuantity = players[stateUpdate.requesterId].clueQuantity;
    stateUpdate.history.push({
      requesterId: stateUpdate.requesterId,
      clue: stateUpdate.clue,
      quantity: stateUpdate.clueQuantity,
      deliverables: [],
    });
    // Achievement: most requested items at once
    utils.achievements.push(store, stateUpdate.requesterId, 'clueQuantity', stateUpdate.clueQuantity);

    // Achievement: The other player resets their deliveries
    const answererId = utils.players.getNextPlayer(Object.keys(players), state.requesterId);
    utils.achievements.push(store, answererId, 'deliveries', 0);
  }
  utils.players.unReadyPlayers(players, stateUpdate.requesterId);

  utils.players.removePropertiesFromPlayers(players, ['clue', 'clueQuantity']);

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING,
        players,
        ...stateUpdate,
      },
      stateCleanup: ['nextPhase', 'entryIdToAnimate'],
    },
  };
};

export const prepareVerificationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const answererId = utils.players.getNextPlayer(Object.keys(players), state.requesterId);
  utils.players.unReadyPlayers(players);

  if (players[answererId].stopDelivery) {
    utils.players.removePropertiesFromPlayers(players, ['stopDelivery', 'delivery']);
    return {
      update: {
        state: {
          phase: COMUNICACAO_DUO_PHASES.VERIFICATION,
          players,
          nextPhase: COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING,
          status: STATUS.CONTINUE,
          entryIdToAnimate: null,
        },
      },
    };
  }

  const requesterSide = players[state.requesterId].side;
  const sideIndex = SIDES.indexOf(requesterSide);
  const deck: DeckEntry[] = state.deck ?? [];
  const history: HistoryEntry[] = state.history ?? [];

  const delivery = players[answererId].delivery;
  history[history.length - 1].deliverables.push(delivery);

  const stateUpdate: PlainObject = {
    history,
    delivery,
  };

  const deckEntryIndex = deck.findIndex((entry: DeckEntry) => entry.id === delivery);

  if (deckEntryIndex === -1) {
    print(deck);
    print({ delivery });
    throw new Error('Deck entry not found');
  }

  utils.players.removePropertiesFromPlayers(players, ['delivery']);

  // Update delivered by
  if (deck[deckEntryIndex].deliveredBy) {
    deck[deckEntryIndex].deliveredBy?.push(answererId);
  } else {
    deck[deckEntryIndex].deliveredBy = [answererId];
  }

  const isCorrect = SIDES.includes(deck[deckEntryIndex].affiliation[sideIndex]);
  const isTaboo = deck[deckEntryIndex].affiliation[sideIndex] === AFFILIATIONS.TABOO;

  if (isCorrect) {
    deck[deckEntryIndex].status =
      deck[deckEntryIndex].affiliation[sideIndex] === AFFILIATIONS.A ? AFFILIATIONS.A : AFFILIATIONS.B;
  }

  if (isTaboo) {
    deck[deckEntryIndex].status = AFFILIATIONS.TABOO;
  }

  if (!isCorrect && deck[deckEntryIndex].deliveredBy?.length === 2) {
    deck[deckEntryIndex].status = AFFILIATIONS.NONE;
  }

  const summary = countDeliverablesLeft(deck);
  stateUpdate.summary = summary;
  stateUpdate.deck = deck;
  stateUpdate.entryIdToAnimate = deck[deckEntryIndex].id;

  // If correct,
  if (isCorrect) {
    utils.achievements.addToLast(store, answererId, 'deliveries', 1);
    utils.achievements.increase(store, answererId, 'correctDeliveries', 1);
    // If all items delivered, end game: win
    if (summary.deliverablesLeft === 0) {
      return {
        update: {
          store: {
            achievements: store.achievements,
          },
          state: {
            phase: COMUNICACAO_DUO_PHASES.VERIFICATION,
            players,
            nextPhase: COMUNICACAO_DUO_PHASES.GAME_OVER,
            status: STATUS.WIN,
            ...stateUpdate,
          },
        },
      };
    }

    const properDeliverablesLeft = {
      [AFFILIATIONS.A]: summary.deliverablesLeftForA,
      [AFFILIATIONS.B]: summary.deliverablesLeftForB,
    };

    // If all delivered for the current player, update turnOrder to always be the other player
    if (properDeliverablesLeft[requesterSide] === 0) {
      stateUpdate.turnOrder = [answererId];
    }

    // If the requesterSide is done, force Ask something
    // Else To go DeliveringSomething again
    return {
      update: {
        store: {
          achievements: store.achievements,
        },
        state: {
          phase: COMUNICACAO_DUO_PHASES.VERIFICATION,
          players,
          nextPhase:
            properDeliverablesLeft[requesterSide] === 0
              ? COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING
              : COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING,
          status: STATUS.CONTINUE,
          ...stateUpdate,
        },
      },
    };
  }

  // If incorrect,
  // If it is an taboo, end game: lose
  if (isTaboo) {
    utils.achievements.increase(store, answererId, 'tabooDeliveries', 1);
    return {
      update: {
        store: {
          achievements: store.achievements,
        },
        state: {
          phase: COMUNICACAO_DUO_PHASES.VERIFICATION,
          players,
          nextPhase: COMUNICACAO_DUO_PHASES.GAME_OVER,
          status: STATUS.LOSE,
          ...stateUpdate,
        },
      },
    };
  }

  // Else To go AskingForSomething again
  utils.achievements.increase(store, answererId, 'neutralDeliveries', 1);
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: COMUNICACAO_DUO_PHASES.VERIFICATION,
        players,
        nextPhase: COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING,
        status: STATUS.CONTINUE,
        ...stateUpdate,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = state.status !== STATUS.WIN ? [] : utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.COMUNICACAO_DUO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, ['side']);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: COMUNICACAO_DUO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        history: state.history,
        deckType: state.deckType,
        clueInputType: state.clueInputType,
        status: state.status,
        summary: state.summary,
        deck: state.deck,
      },
    },
  };
};
