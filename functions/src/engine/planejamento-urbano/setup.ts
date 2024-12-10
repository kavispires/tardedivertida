// Constants
import { CITY_BOUNDS_SIZE, PLANEJAMENTO_URBANO_PHASES, TOTAL_ROUNDS } from './constants';
// Types
import type { City, FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData } from './types';
// Utils
import utils from '../../utils';
import { CityLocation } from '../../types/tdr';
import { GAME_NAMES, LETTERS } from '../../utils/constants';
import { orderBy } from 'lodash';

/**
 * Prepares the setup phase for the urban planning game.
 *
 * @param store - The Firebase store data containing game options and settings.
 * @param state - The Firebase state data representing the current game state.
 * @param players - The players participating in the game.
 * @param resourceData - The resource data containing all city locations.
 * @returns A promise that resolves to the payload required to save the game state.
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  const allowNSFW = store.options.nsfw;
  const { allCityLocations } = resourceData;

  const city = utils.toolKits.gridMapUtils.createGridMap(CITY_BOUNDS_SIZE, CITY_BOUNDS_SIZE, {
    adjacency: 'surrounding',
    origin: 'center',
  });

  const usedCityLocations: Collection<CityLocation> = {};

  // Set up city hall on the center
  const originId = utils.toolKits.gridMapUtils.getOriginId(city);
  if (originId) {
    utils.toolKits.gridMapUtils.updateCell(city, originId, { locationId: 'cl-1' });
    usedCityLocations['cl-1'] = allCityLocations['cl-1'];
  }

  // Get all available locations
  const allLocations = utils.game.shuffle(
    Object.values(allCityLocations).filter((l) => (allowNSFW || !l.nsfw) && !usedCityLocations[l.id])
  );

  // Get 4 locations around the city hall
  const adjacentCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(city, 'orthogonal', 'available');
  const surroundingLocations = allLocations.splice(-4);
  adjacentCellsIds.forEach((cellId, index) => {
    const location = surroundingLocations[index];
    if (location) {
      utils.toolKits.gridMapUtils.updateCell(city, cellId, { locationId: location.id });
      usedCityLocations[location.id] = location;
    }
  });

  const deck = utils.game.getRandomItems(allLocations, 23).map((l) => l.id);

  deck.forEach((locationId) => {
    usedCityLocations[locationId] = allCityLocations[locationId];
  });

  const achievements = utils.achievements.setup(players, store, {
    // TODO
  });

  const { gameOrder } = utils.players.buildGameOrder(players);

  // Save
  return {
    update: {
      store: {
        achievements,
        deck,
      },
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
          forceLastRound: false,
        },
        cityLocationsDict: usedCityLocations,
        city,
        placements: 3,
        gameOrder,
        groupScore: 0,
      },
    },
  };
};

export const preparePlanningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const deck = store.deck;
  const placements: number = state.placements;
  const city: City = state.city;

  const round = utils.helpers.increaseRound(state.round);

  // Determine the active planner
  const activePlayerId = utils.players.getActivePlayer(state.gameOrder, round.current);
  // Determine the controller
  const controllerId = utils.players.getNextPlayer(state.gameOrder, activePlayerId);
  utils.players.readyPlayers(players, activePlayerId);

  // If there are pending sites, resolve them
  const gallery: GalleryEntry[] = state.gallery || [];
  gallery.forEach((entry) => {
    utils.toolKits.gridMapUtils.updateCell(city, entry.finalCellId, { locationId: entry.locationId }, 'used');
  });
  city.cells.forEach((cell) => {
    if (cell.data?.coneId) {
      utils.toolKits.gridMapUtils.updateCell(city, cell.id, null, 'available');
    }
  });

  // Make N new available sites
  // Any mistake prioritizes a diagonal site otherwise a orthogonal site
  const availableOrthogonalCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'orthogonal',
    'available',
    'used'
  );
  const selectedIds = utils.game.getRandomItems(availableOrthogonalCellsIds, placements);
  const coneCellIds: Record<string, string> = {};
  selectedIds.forEach((id, index) => {
    coneCellIds[LETTERS[index]] = id;
    utils.toolKits.gridMapUtils.updateCell(city, id, { coneId: LETTERS[index] });
  });

  // Get N new locations from the deck
  const availableProjectsIds = Array.from({ length: placements }, () => deck.pop()).filter(
    Boolean
  ) as CardId[];

  // Save
  return {
    update: {
      store: {
        deck,
      },
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.PLANNING,
        players,
        round,
        activePlayerId,
        controllerId,
        availableProjectsIds,
        city,
        placements,
        coneCellIds,
      },
      stateCleanup: ['gallery', 'planning', 'evaluations', 'correct', 'incorrect', 'status'],
    },
  };
};

export const preparePlacingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const activePlayerId = state.activePlayerId;
  const controllerId = state.controllerId;

  const planning = players[activePlayerId].planning;

  utils.players.removePropertiesFromPlayers(players, ['planning']);

  utils.players.readyPlayers(players, controllerId);

  // Save
  return {
    update: {
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.PLACING,
        players,
        planning,
      },
    },
  };
};

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const city: City = state.city;
  const availableProjectsIds: string[] = state.availableProjectsIds;
  const planning: Record<string, string> = state.planning;
  const evaluations: Record<string, string> = state.evaluations;
  const groupScore: number = state.groupScore;
  const placements: number = state.placements;

  let correct = 0;
  let incorrect = 0;
  const conesCellIds: Record<string, string> = state.coneCellIds;

  const gallery: GalleryEntry[] = [];
  // If placement is correct, give 1 point, and place it in the city
  // If placement is incorrect, give 0 points, and place it in a diagonal site
  // If perfect score, increase placements if possible (and announce it)
  availableProjectsIds.forEach((projectId) => {
    const answer = planning[projectId];
    const guess = evaluations[projectId];
    const isCorrect = answer === evaluations[projectId];

    if (isCorrect) {
      correct++;
      // For each cell that was correctly placed, set the city cell to 'reserved'
      utils.toolKits.gridMapUtils.updateCellState(city, conesCellIds[answer], 'reserved');
    } else {
      incorrect++;
    }

    gallery.push({
      locationId: projectId,
      guess: guess,
      guessAdjacentLocationsIds: utils.toolKits.gridMapUtils
        .getAdjacentIdsToCellId(city, conesCellIds[guess], 'orthogonal', 'used')
        .map((cellId) => {
          const cell = utils.toolKits.gridMapUtils.getCellById(city, cellId);
          return cell?.data?.locationId || null;
        })
        .filter(Boolean) as string[],
      cone: answer,
      coneAdjacentLocationsIds: utils.toolKits.gridMapUtils
        .getAdjacentIdsToCellId(city, conesCellIds[answer], 'orthogonal', 'used')
        .map((cellId) => {
          const cell = utils.toolKits.gridMapUtils.getCellById(city, cellId);
          return cell?.data?.locationId || null;
        })
        .filter(Boolean) as string[],
      correctCellId: conesCellIds[answer],
      result: isCorrect ? 'CORRECT' : 'INCORRECT',
      finalCellId: isCorrect ? conesCellIds[answer] : '',
      score: isCorrect ? 1 : 0,
    });
  });

  // Give diagonal sites to incorrect placements
  const availableOrthogonalCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'orthogonal',
    'available',
    'used'
  );
  const availableDiagonalCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'diagonal',
    'available',
    'used'
  );
  const availableReservedCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'diagonal',
    'available',
    'reserved'
  );

  const onlyDiagonal = [...availableDiagonalCellsIds, ...availableReservedCellsIds];

  if (onlyDiagonal.length < incorrect) {
    onlyDiagonal.push(...availableOrthogonalCellsIds.splice(0, incorrect - onlyDiagonal.length));
  }

  gallery.forEach((entry) => {
    if (entry.result === 'INCORRECT') {
      const diagonalCellId = onlyDiagonal.pop();
      if (diagonalCellId) {
        entry.finalCellId = diagonalCellId;
      }
    }
  });

  const update: PlainObject = {
    status: 'CONTINUE',
    correct,
    incorrect,
    groupScore: groupScore + correct,
  };
  // If all placements are correct, increase placements up to 4
  if (incorrect === 0) {
    update.status = 'PERFECT';
    update.groupScore += 1;
    update.placements = Math.min(placements + 1, 4);
  }

  // Save
  return {
    update: {
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.RESOLUTION,
        players,
        gallery: orderBy(gallery, ['cone'], ['asc']),
        city,
        ...update,
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
  const city: City = state.city;
  // If there are pending sites, resolve them
  const gallery: GalleryEntry[] = state.gallery || [];
  gallery.forEach((entry) => {
    utils.toolKits.gridMapUtils.updateCell(city, entry.finalCellId, { locationId: entry.locationId }, 'used');
  });
  city.cells.forEach((cell) => {
    if (cell.data?.coneId) {
      utils.toolKits.gridMapUtils.updateCell(city, cell.id, null, 'available');
    }
  });

  const winners = utils.players.determineWinners(players);

  // const achievements = getAchievements(store);
  const achievements = [];

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.PLANEJAMENTO_URBANO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        cityLocationsDict: state.cityLocationsDict,
        city,
        groupScore: state.groupScore ?? 0,
        achievements,
      },
    },
  };
};
