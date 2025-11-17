// Constants
import { CITY_BOUNDS_SIZE, LOCATIONS_PER_ROUND, PLANEJAMENTO_URBANO_PHASES } from './constants';
// Types
import type { City, FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData } from './types';
// Utils
import utils from '../../utils';
import type { CityLocation } from '../../types/tdr';
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
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const allowNSFW = store.options.nsfw;
  const { allCityLocations } = resourceData;

  const city = utils.toolKits.gridMapUtils.createGridMap(CITY_BOUNDS_SIZE, CITY_BOUNDS_SIZE, {
    adjacency: 'surrounding',
    origin: 'center',
  });

  const usedCityLocations: Dictionary<CityLocation> = {};

  // Set up city hall on the center
  const originId = utils.toolKits.gridMapUtils.getOriginId(city);
  if (originId) {
    utils.toolKits.gridMapUtils.updateCell(city, originId, { locationId: 'cl-1' });
    usedCityLocations['cl-1'] = allCityLocations['cl-1'];
  }

  // Get all available locations
  const allLocations = utils.game.shuffle(
    Object.values(allCityLocations).filter((l) => (allowNSFW || !l.nsfw) && !usedCityLocations[l.id]),
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

  const achievements = utils.achievements.setup(players, {
    coneA: 0,
    coneB: 0,
    coneC: 0,
    coneD: 0,
    architectMatches: 0,
    nonArchitectMatches: 0,
  });

  const { playerIds: gameOrder, gameOrder: totalGameOrder } = utils.players.buildGameOrder(players, 6);

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
          total: totalGameOrder.length,
          forceLastRound: false,
        },
        cityLocationsDict: usedCityLocations,
        city,
        gameOrder,
      },
    },
  };
};

export const preparePlanningPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const deck = store.deck;
  const city: City = state.city;

  const round = utils.helpers.increaseRound(state.round);

  // Determine the active planner
  const architectId = utils.players.getActivePlayer(state.gameOrder, round.current);

  utils.players.readyPlayers(players, architectId);

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
    'used',
  );
  const selectedIds = utils.game.getRandomItems(availableOrthogonalCellsIds, LOCATIONS_PER_ROUND + 1);
  const coneCellIds: Record<string, string> = {};
  selectedIds.forEach((id, index) => {
    coneCellIds[LETTERS[index]] = id;
    utils.toolKits.gridMapUtils.updateCell(city, id, { coneId: LETTERS[index] });
  });

  // Get N new locations from the deck
  const availableProjectsIds = Array.from({ length: LOCATIONS_PER_ROUND }, () => deck.pop()).filter(
    Boolean,
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
        architectId,
        availableProjectsIds,
        city,
        coneCellIds,
      },
      stateCleanup: ['gallery', 'planning', 'correct', 'incorrect', 'status'],
    },
  };
};

export const preparePlacingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const architectId = state.architectId;

  const planning = players[architectId].planning;

  utils.players.removePropertiesFromPlayers(players, ['planning']);

  utils.players.unReadyPlayers(players, architectId);

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
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const city: City = state.city;
  const availableProjectsIds: string[] = state.availableProjectsIds;
  const planning: Record<string, string> = state.planning;
  const architectId: string = state.architectId;

  let incorrect = 0;
  const conesCellIds: Record<string, string> = state.coneCellIds;

  // Gained Points [correct guesses, architect points, bonus matches]
  const scores = new utils.players.Scores(players, [0, 0, 0]);

  const gallery: GalleryEntry[] = [];
  // If placement is correct, give 1 point, and place it in the city
  // If placement is incorrect, give 0 points, and place it in a diagonal site
  // If perfect score, increase placements if possible (and announce it)
  availableProjectsIds.forEach((projectId) => {
    const correctConeId = planning[projectId];
    let isCorrect = false;
    const correctPlayersIds: PlayerId[] = [];
    const playersSay: Dictionary<PlayerId[]> = {};
    const playersPoints: Record<PlayerId, number> = {};
    let architectPoints = 0;

    // If at least one player guessed correctly, it's correct
    utils.players.getListOfPlayers(players, false, [architectId]).forEach((player) => {
      const playerGuess = player.evaluations?.[projectId];
      if (playerGuess) {
        playersPoints[player.id] = playersPoints[player.id] || 0;
        if (playerGuess === correctConeId) {
          isCorrect = true;
          correctPlayersIds.push(player.id);
          scores.add(player.id, 2, 0); // Correct guess
          scores.add(architectId, 1, 1); // The architect gets a point for each correct guess
          playersPoints[player.id] += 1;
          architectPoints += 1;
        } else {
          playersSay[playerGuess] = playersSay[playerGuess] || [];
          playersSay[playerGuess].push(player.id);
        }
      }
    });

    // For each player say, score number of players - 1
    Object.entries(playersSay).forEach(([, playerIds]) => {
      if (playerIds.length > 1) {
        const points = playerIds.length - 1;
        playerIds.forEach((playerId) => {
          scores.add(playerId, points, 2); // Points for matching other players
        });
      }
    });

    if (isCorrect) {
      // For each cell that was correctly placed, set the city cell to 'reserved'
      utils.toolKits.gridMapUtils.updateCellState(city, conesCellIds[correctConeId], 'reserved');
    } else {
      incorrect++;
    }

    gallery.push({
      locationId: projectId,
      architectId,
      coneId: correctConeId,
      correctCellId: conesCellIds[correctConeId],
      correctPlayersIds: correctPlayersIds,
      playersSay,
      playersPoints,
      architectPoints,
      finalCellId: conesCellIds[correctConeId],
    });
  });

  // Give diagonal sites to incorrect placements
  const availableOrthogonalCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'orthogonal',
    'available',
    'used',
  );
  const availableDiagonalCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'diagonal',
    'available',
    'used',
  );
  const availableReservedCellsIds = utils.toolKits.gridMapUtils.getAllAdjacentIds(
    city,
    'diagonal',
    'available',
    'reserved',
  );

  const onlyDiagonal = [...availableDiagonalCellsIds, ...availableReservedCellsIds];

  if (onlyDiagonal.length < incorrect) {
    onlyDiagonal.push(...availableOrthogonalCellsIds.splice(0, incorrect - onlyDiagonal.length));
  }

  gallery.forEach((entry) => {
    if (entry.architectPoints === 0) {
      const diagonalCellId = onlyDiagonal.pop();
      if (diagonalCellId) {
        entry.finalCellId = diagonalCellId;
      }
    }
  });

  const cityLocationsDict: Dictionary<CityLocation> = state.cityLocationsDict;
  const sortedGallery = orderBy(
    gallery,
    [(g) => cityLocationsDict[g.locationId].name[store.language ?? 'en']],
    ['asc'],
  );

  const ranking = scores.rank(players);

  // Save
  return {
    update: {
      state: {
        phase: PLANEJAMENTO_URBANO_PHASES.RESOLUTION,
        players,
        gallery: sortedGallery,
        city,
        ranking,
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
        achievements,
      },
    },
  };
};
