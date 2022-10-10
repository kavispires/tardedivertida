// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  MAGIC_UNITS_PER_PLAYER_COUNT,
  MAX_ROUNDS,
  OUTCOME,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_PHASES,
  TRAPS,
  WIN_CONDITION,
} from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Trap } from './types';
// Utils
import * as utils from '../../utils';
import { botDoorSelection, createTrapOrder, getBookPages, getDoorSet } from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount: pC } = utils.helpers.buildGameOrder(players);
  const playerCount = store.options?.withBots ? pC + 2 : pC;

  // Helper Bots
  if (store.options?.withBots) {
    utils.players.addBots(players, 2);
  }

  // Get image cards
  const imageCardIds = await utils.imageCards.getImageCards(252);
  const imageCardsParts = utils.game.sliceInParts(imageCardIds, 3);
  // Use the first as the doors
  const doorsDeck = utils.game.getRandomItems(imageCardsParts[0], DOOR_OPTIONS_PER_ROUND * DOOR_LEVELS);

  // Use the other two decks as book pages
  const pagesDeck = utils.game.getRandomItems(
    [...imageCardsParts[1], ...imageCardsParts[2]],
    PAGES_PER_ROUND * MAX_ROUNDS
  );

  const magic = MAGIC_UNITS_PER_PLAYER_COUNT[playerCount];

  const traps = createTrapOrder();

  // Save
  return {
    update: {
      store: {
        doorsDeck,
        doorsDeckIndex: 0,
        pagesDeck,
        pagesDeckIndex: 0,
        traps,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.SETUP,
        gameOrder,
        magic,
        currentCorridor: 0,
      },
      players,
    },
  };
};

export const prepareBookPossessionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  const possessedId = utils.players.getActivePlayer(state.gameOrder, round.current);

  // Unready players
  utils.players.readyPlayers(players, possessedId);
  utils.players.removePropertiesFromPlayers(players, ['pageIds', 'doorId']);

  const isCorrect = state?.outcome !== OUTCOME.FAIL;
  const currentCorridor = isCorrect ? state.currentCorridor + 1 : state.currentCorridor;

  const trap = isCorrect ? store.traps[(currentCorridor - 1) % store.traps.length] : state.trap;

  // Setup door (if new game or outcome is SUCCESS)
  const doors = isCorrect
    ? getDoorSet(store.doorsDeck, store.doorsDeckIndex, trap as Trap)
    : {
        doors: state.doors,
        newDoorIndex: store.doorsDeckIndex,
        answerDoorId: utils.game.getRandomItem(state.doors),
      };

  const pages = getBookPages(store.pagesDeck, store.pagesDeckIndex, trap as Trap);

  // Save
  return {
    update: {
      store: {
        doorsDeckIndex: doors.newDoorIndex,
        pagesDeckIndex: pages.newPageIndex,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION,
        round,
        possessedId,
        currentCorridor,
        trap,
        pages: pages.pages,
        doors: doors.doors,
        answerDoorId: doors.answerDoorId,
        outcome: utils.firebase.deleteValue(),
        currentPageIds: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareDoorChoicePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, state.possessedId);

  const selectedPagesIds = state.selectedPagesIds;
  if (state.trap == TRAPS.RANDOM_INTERJECTION) {
    const otherPages = state.pages.filter((pageId: string) => !selectedPagesIds.includes(pageId));
    selectedPagesIds.push(utils.game.getRandomItem(otherPages));
  }

  // Bot choices
  if (store.options?.withBots) {
    botDoorSelection(players, state.doors, state.answerDoorId);
  }

  // Save
  return {
    update: {
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE,
        selectedPagesIds: utils.game.shuffle(selectedPagesIds),
      },
      players,
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather all players door choices
  const visitedDoors = utils.players.getListOfPlayers(players, true).reduce((acc: string[], player) => {
    console.log(player.id, player.doorId);
    if (player.doorId && !acc.includes(player.doorId)) {
      acc.push(player.doorId);
    }
    return acc;
  }, []);

  // Decrease magic
  const usedMagic = state.trap === TRAPS.DOUBLE_MAGIC ? visitedDoors.length * 2 : visitedDoors.length;
  const magic = state.magic - usedMagic;

  // Determine outcome
  let outcome = OUTCOME.SUCCESS;
  // FAIL: Nobody visited the correct door
  if (!visitedDoors.includes(state.answerDoorId)) {
    outcome = OUTCOME.FAIL;
  }

  // Determine win condition
  let winCondition = WIN_CONDITION.CONTINUE;

  // LOSE: Players used all their magic
  if (magic <= 0) {
    winCondition = WIN_CONDITION.LOSE;
  }

  if (state.currentCorridor === DOOR_LEVELS && outcome === OUTCOME.SUCCESS) {
    winCondition = WIN_CONDITION.WIN;
  }

  // Save
  return {
    update: {
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION,
        outcome,
        winCondition,
        magic,
        usedMagic,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = state.winCondition === WIN_CONDITION.WIN ? utils.players.determineWinners(players) : [];
  const currentCorridor =
    state.outcome === OUTCOME.SUCCESS ? state.currentCorridor + 1 : state.currentCorridor;
  const winCondition = state.winCondition === WIN_CONDITION.WIN ? WIN_CONDITION.WIN : WIN_CONDITION.LOSE;

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        winCondition,
        currentCorridor,
        magic: state.magic,
      },
    },
  };
};
