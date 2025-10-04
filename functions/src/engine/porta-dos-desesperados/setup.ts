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
  TRAPS_ENTRIES,
  WIN_CONDITION,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData, Trap } from './types';
// Utils
import utils from '../../utils';
import {
  botDoorSelection,
  calculateDifficulty,
  createTrapOrder,
  getAchievements,
  getBookPages,
  getDoorSet,
  mergeVisitedDoorsRelationships,
} from './helpers';
import { saveData } from './data';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  data: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder, playerCount: pC } = utils.players.buildGameOrder(players);
  const playerCount = store.options?.withBots ? pC + 2 : pC;

  // Setup achievements
  const achievements = utils.achievements.setup(players, {
    possessions: 0,
    possessionWins: 0,
    possessionLosses: 0,
    possessionDuration: 0,
    pages: 0,
    correctDoors: 0,
    wrongDoors: 0,
    soloCorrectDoors: 0,
    soloWrongDoors: 0,
    doorDuration: 0,
    magic: 0,
  });

  // Get image cards
  const imageCardsParts = utils.game.sliceInParts(data.cards, 3);
  // Use the first as the doors
  const doorsDeck = utils.game.getRandomItems(imageCardsParts[0], DOOR_OPTIONS_PER_ROUND * DOOR_LEVELS);

  // Use the other two decks as book pages
  const pagesDeck = utils.game.getRandomItems(
    [...imageCardsParts[1], ...imageCardsParts[2]],
    PAGES_PER_ROUND * MAX_ROUNDS,
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
        achievements,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.SETUP,
        players,
        gameOrder,
        magic,
        currentCorridor: 0,
        difficulty: calculateDifficulty(traps),
      },
    },
  };
};

export const prepareBookPossessionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  const possessedId = utils.players.getActivePlayer(state.gameOrder, round.current);

  // Unready players
  utils.players.readyPlayers(players, possessedId);
  utils.players.removePropertiesFromPlayers(players, ['pageIds', 'doorId']);

  const isCorrect = state?.outcome !== OUTCOME.FAIL;
  const currentCorridor = isCorrect ? state.currentCorridor + 1 : state.currentCorridor;

  const trap = isCorrect ? store.traps[(currentCorridor - 1) % store.traps.length] : state.trap;

  const trapEntry = currentCorridor > 1 ? TRAPS_ENTRIES[trap as Trap] : null;

  // Setup door (if new game or outcome is SUCCESS)
  const doors = isCorrect
    ? getDoorSet(store.doorsDeck, store.doorsDeckIndex, trap as Trap)
    : {
        doors: state.doors,
        newDoorIndex: store.doorsDeckIndex,
        answerDoorId: utils.game.getRandomItem(
          state.doors.filter((doorId: ImageCardId) => doorId !== state.answerDoorId),
        ),
      };

  const pages = getBookPages(store.pagesDeck, store.pagesDeckIndex, trap as Trap);

  // Achievement: POSSESSED
  utils.achievements.increase(store, possessedId, 'possessions', 1);

  // Save
  return {
    update: {
      store: {
        doorsDeckIndex: doors.newDoorIndex,
        pagesDeckIndex: pages.newPageIndex,
        achievements: store.achievements,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION,
        players,
        round,
        possessedId,
        currentCorridor,
        trap,
        pages: pages.pages,
        doors: isCorrect
          ? doors.doors
          : state.doors.filter((doorId: ImageCardId) => doorId !== state.answerDoorId),
        answerDoorId: doors.answerDoorId,
        trapEntry,
      },
      stateCleanup: ['outcome', 'currentPageIds'],
    },
  };
};

export const prepareDoorChoicePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, state.possessedId);

  const selectedPagesIds = state.selectedPagesIds;

  // Achievement: PAGES
  utils.achievements.increase(store, state.possessedId, 'pages', state.selectedPagesIds.length);
  // Achievement: READER
  utils.achievements.increase(
    store,
    state.possessedId,
    'possessionDuration',
    state.updatedAt - (players[state.possessedId].updatedAt ?? 0),
  );

  if (state.trap === TRAPS.RANDOM_INTERJECTION) {
    const otherPages = state.pages.filter((pageId: string) => !selectedPagesIds.includes(pageId));
    selectedPagesIds.push(utils.game.getRandomItem(otherPages));
  }

  // Bot choices
  if (store.options?.withBots) {
    botDoorSelection(players, state.doors, state.answerDoorId);
  }

  utils.players.removePropertiesFromPlayers(players, ['blindDoorId', 'shuffledDoorOrder']);

  if (state.trap === TRAPS.SHUFFLED_DOORS) {
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.shuffledDoorOrder = utils.game.shuffle(state.doors);
    });
  }

  if (state.trap === TRAPS.BLIND_DOOR) {
    const blindDoorsOrder = utils.game.shuffle(state.doors);
    utils.players.getListOfPlayers(players).forEach((player, index) => {
      player.blindDoorId = blindDoorsOrder[index % blindDoorsOrder.length];
    });
  }

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.DOOR_CHOICE,
        players,
        selectedPagesIds: utils.game.shuffle(selectedPagesIds),
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const doorPlayerDict: Dictionary<PlayerId[]> = {};
  // Gather all players door choices
  const visitedDoors = utils.players.getListOfPlayers(players, true).reduce((acc: string[], player) => {
    if (player.doorId) {
      if (player.doorId && !acc.includes(player.doorId)) {
        acc.push(player.doorId);
      }
      if (doorPlayerDict[player.doorId] === undefined) {
        doorPlayerDict[player.doorId] = [];
      }
      doorPlayerDict[player.doorId].push(player.id);

      // Achievement: DECISION
      if (player.updatedAt) {
        utils.achievements.increase(store, player.id, 'doorDuration', state.updatedAt - player.updatedAt);
      }
    }
    return acc;
  }, []);

  // Save Image Cards Relationships
  if (state.trap !== TRAPS.RANDOM_INTERJECTION) {
    store.relationships = mergeVisitedDoorsRelationships(
      store.relationships ?? {},
      visitedDoors,
      state.selectedPagesIds,
    );
  }

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

  if (outcome === OUTCOME.SUCCESS) {
    if (store.finalDoors) {
      store.finalDoors.push(state.answerDoorId);
    }
    // Achievement: GUIDE
    utils.achievements.increase(store, state.possessedId, 'possessionWins', 1);
    // Achievement: DOORS
    doorPlayerDict[state.answerDoorId].forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'correctDoors', 1);
      // Achievement: SOLO_DOORS
      if (doorPlayerDict[state.answerDoorId].length === 1) {
        utils.achievements.increase(store, playerId, 'soloCorrectDoors', 1);
      }
    });
  } else {
    // Achievement: GUIDE
    utils.achievements.increase(store, state.possessedId, 'possessionLosses', 1);
  }

  // Achievement: DOORS
  Object.keys(doorPlayerDict)
    .filter((doorId) => doorId !== state.answerDoorId)
    .forEach((doorId) => {
      const wrongPlayers = doorPlayerDict[doorId];
      const quantityOfPlayers = wrongPlayers.length;
      wrongPlayers.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'wrongDoors', 1);
        // Achievement: SOLO_DOORS
        if (quantityOfPlayers === 1) {
          utils.achievements.increase(store, playerId, 'soloWrongDoors', 1);
        }
        // Achievement: MAGIC
        const wastedMagicPerDoor = state.trap === TRAPS.DOUBLE_MAGIC ? 2 : 1;
        utils.achievements.increase(store, playerId, 'magic', wastedMagicPerDoor / quantityOfPlayers);
      });
    });

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        relationships: store.relationships,
        finalDoors: store.finalDoors,
      },
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.RESOLUTION,
        outcome,
        winCondition,
        magic,
        usedMagic,
        players,
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
  const winners = state.winCondition === WIN_CONDITION.WIN ? utils.players.determineWinners(players) : [];
  const currentCorridor =
    state.outcome === OUTCOME.SUCCESS ? state.currentCorridor + 1 : state.currentCorridor;
  const winCondition = state.winCondition === WIN_CONDITION.WIN ? WIN_CONDITION.WIN : WIN_CONDITION.LOSE;

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.PORTA_DOS_DESESPERADOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  await saveData(store.relationships ?? {});

  const doors = store.finalDoors;

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, ['traps']),
    },
    set: {
      state: {
        phase: PORTA_DOS_DESESPERADOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        winCondition,
        currentCorridor,
        magic: state.magic,
        achievements,
        doors,
      },
    },
  };
};
