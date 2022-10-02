// Constants
import {
  DOOR_LEVELS,
  DOOR_OPTIONS_PER_ROUND,
  MAGIC_UNITS_PER_PLAYER_COUNT,
  MAX_ROUNDS,
  PAGES_PER_ROUND,
  PORTA_DOS_DESESPERADOS_PHASES,
} from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Trap } from './types';
// Utils
import * as utils from '../../utils';
import { createTrapOrder, getBookPages, getDoorSet } from './helpers';

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
  const { gameOrder, playerCount } = utils.helpers.buildGameOrder(players);

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
        currentDoor: 0,
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
  console.log({ possessedId });
  // Unready players
  utils.players.readyPlayers(players, possessedId);
  utils.players.removePropertiesFromPlayers(players, ['pageIds', 'doorId']);

  const isCorrect = state?.outcome !== 'FAIL';
  console.log({ isCorrect });
  const currentDoor = isCorrect ? state.currentDoor + 1 : state.currentDoor;
  console.log({ currentDoor });
  const trap = isCorrect ? store.traps[(currentDoor - 1) % store.traps.length] : state.trap;
  console.log({ trap });
  // Setup door (if new game or outcome is SUCCESS)
  const doors = isCorrect ? getDoorSet(store.doorsDeck, store.doorsDeckIndex, trap as Trap) : state.doors;
  console.log({ doors });
  const pages = isCorrect ? getBookPages(store.pagesDeck, store.pagesDeckIndex, trap as Trap) : state.pages;
  console.log({ pages });
  // Save
  return {
    update: {
      store: {
        doorsDeckIndex: doors.newDoorIndex,
        pagesDeckIndex: pages.newPageIndex,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION,
        possessedId,
        currentDoor,
        trap,
        pages: pages.pages,
        doors: doors.doors,
        answerDoorId: doors.answerDoorId,
        outcome: utils.firebase.deleteValue(),
        round,
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

  // Save
  return {
    update: {
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE,
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
  // TODO:
  //Gather all players door choices

  // Determine outcome

  // Decrease magic

  // Save
  return {
    update: {
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION,
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
  const winners = utils.players.determineWinners(players);

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
      },
    },
  };
};
