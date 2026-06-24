import { sampleSize, shuffle } from 'lodash';
// Types
import type { DilemmaCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, Lodge, MountainDilemma, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../utils/constants';
import {
  BET_TYPES,
  BETTING_CHIPS,
  CATCH_UP_BONUS,
  DILEMMAS_PER_ROUND,
  DOUBLE_ROUNDS_THRESHOLD,
  ESQUIADORES_PHASES,
  MOUNTAIN_SECTION,
  SKIER_BET_TYPES,
  SKIERS_BETTING_CHIPS,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
import { makeArray } from '../../utils/helpers';
// Internal
import { calculateAchievements, setupAchievements } from './achievements';
import { aggregateBets, applyBetsToLodges, calculateScores } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const { gameOrder, playerIds: turnOrder } = utils.turnOrder.create(players, DOUBLE_ROUNDS_THRESHOLD);

  // Build deck
  const deck = sampleSize(resourceData.dilemmas, gameOrder.length * DILEMMAS_PER_ROUND);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck,
        pastMountains: [],
        achievements,
      },
      state: {
        phase: ESQUIADORES_PHASES.SETUP,
        turnOrder,
        round: {
          ...state.round,
          total: gameOrder.length,
        },
      },
    },
  };
};

/**
 * Bets phase - players place bets on skier positions
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareBetsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, [
    SKIER_BET_TYPES.SKIERS_BETS,
    SKIER_BET_TYPES.SKIERS_BOOST,
    BET_TYPES.INITIAL,
    BET_TYPES.BOOST,
    BET_TYPES.FINAL,
    'bets',
    'choices',
    'chips',
  ]);

  // Get new active skier
  const round = utils.game.increaseRound(state.round);
  const activeSkierId = utils.turnOrder.getActivePlayerId(state.turnOrder, round.current);

  // Give initial chips to players
  utils.players.addPropertiesToPlayers(players, {
    chips: BETTING_CHIPS.INITIAL,
  });
  // Give skiers initial chips
  players[activeSkierId].chips = SKIERS_BETTING_CHIPS.INITIAL;

  const deck: DilemmaCardData[] = store.deck;
  const dilemmas = deck.splice(0, DILEMMAS_PER_ROUND);
  const sprites = shuffle(makeArray(13).map((i) => `mountain-${i}`));
  const mountain: MountainDilemma[] = dilemmas.map((dilemma, index) => ({
    id: index,
    spriteId: sprites[index],
    direction: null,
    dilemma: dilemma,
    selected: index === 0,
  }));

  const catchUp: UID[] = [];
  // Catch up mechanism: give last player(s) extra chips
  if (round.current > 1) {
    utils.players.determineLosers(players).forEach((player) => {
      player.chips += CATCH_UP_BONUS;
      catchUp.push(player.id);
    });
  }

  const lodges: Lodge[] = utils.helpers.makeArray(6).map((i) => ({
    id: i,
    playersIds: [],
    selected: false,
  }));

  // Save
  return {
    update: {
      store: {
        deck,
      },
      state: {
        phase: ESQUIADORES_PHASES.BETS,
        round,
        players,
        activeSkierId,
        mountain,
        mountainSection: MOUNTAIN_SECTION.SUMMIT,
        lodges,
        catchUp,
        animateFrom: 0,
        animateTo: null,
      },
      stateCleanup: ['ranking'],
    },
  };
};

/**
 * Starting Results phase - shows initial race positions
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareStartingResultsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: UID = state.activeSkierId;
  const skier = players[activeSkierId];
  const choices: string[] = skier.choices;
  const mountain: MountainDilemma[] = state.mountain;
  const lodges: Lodge[] = state.lodges;

  // Add skier selections to mountain
  const isGoingLeftLevel1 = choices[0] === 'left';
  const isGoingLeftLevel2 = choices[1] === 'left';
  const isGoingLeftLevel3 = choices[2] === 'left';

  mountain[0].direction = choices[0] as MountainDilemma['direction'];
  mountain[1].selected = isGoingLeftLevel1;
  if (mountain[1].selected) {
    mountain[1].direction = choices[1] as MountainDilemma['direction'];
  }
  mountain[2].selected = !isGoingLeftLevel1;
  if (mountain[2].selected) {
    mountain[2].direction = choices[1] as MountainDilemma['direction'];
  }
  mountain[3].selected = isGoingLeftLevel1 && isGoingLeftLevel2;
  if (mountain[3].selected) {
    mountain[3].direction = choices[2] as MountainDilemma['direction'];
  }
  mountain[4].selected =
    (isGoingLeftLevel1 && !isGoingLeftLevel2) || (!isGoingLeftLevel1 && isGoingLeftLevel2);
  if (mountain[4].selected) {
    mountain[4].direction = choices[2] as MountainDilemma['direction'];
  }
  mountain[5].selected = !isGoingLeftLevel1 && !isGoingLeftLevel2;
  if (mountain[5].selected) {
    mountain[5].direction = choices[2] as MountainDilemma['direction'];
  }
  // Update lodges
  lodges[0].selected = mountain[3].selected && isGoingLeftLevel3;
  lodges[1].selected = mountain[3].selected && !isGoingLeftLevel3;
  lodges[2].selected = mountain[4].selected && isGoingLeftLevel3;
  lodges[3].selected = mountain[4].selected && !isGoingLeftLevel3;
  lodges[4].selected = mountain[5].selected && isGoingLeftLevel3;
  lodges[5].selected = mountain[5].selected && !isGoingLeftLevel3;

  // Add players to lodges
  applyBetsToLodges(players, activeSkierId, lodges, BET_TYPES.INITIAL);

  // Aggregate all bets per player
  aggregateBets(players, activeSkierId, BET_TYPES.INITIAL);

  const animateTo = mountain[0].direction;

  // Save
  return {
    update: {
      state: {
        phase: ESQUIADORES_PHASES.STARTING_RESULTS,
        mountainSection: MOUNTAIN_SECTION.LEVEL_1,
        mountain,
        lodges,
        players,
        animateFrom: 0,
        animateTo,
      },
      stateCleanup: [],
    },
  };
};

/**
 * Boosts phase - players use boosts to affect skier positions
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareBoostsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: UID = state.activeSkierId;
  // Give boost chips to players
  utils.players.addPropertiesToPlayers(players, {
    chips: BETTING_CHIPS.BOOST,
  });
  // Give skiers boost chips
  players[activeSkierId].chips = SKIERS_BETTING_CHIPS.BOOST;

  const mountain: MountainDilemma[] = state.mountain;
  const animateFrom = [mountain[1], mountain[2]].filter((m) => m.selected)[0].id;

  // Save
  return {
    update: {
      state: {
        phase: ESQUIADORES_PHASES.BOOSTS,
        mountainSection: MOUNTAIN_SECTION.LEVEL_1,
        players,
        animateFrom,
        animateTo: null,
      },
      stateCleanup: [],
    },
  };
};

/**
 * Preliminary Results phase - shows updated positions after boosts
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePreliminaryResultsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: UID = state.activeSkierId;
  const lodges: Lodge[] = state.lodges;

  // Add players to lodges
  applyBetsToLodges(players, activeSkierId, lodges, BET_TYPES.BOOST);

  // Aggregate all bets per player
  aggregateBets(players, activeSkierId, BET_TYPES.BOOST);

  const mountain: MountainDilemma[] = state.mountain;
  const animateFrom = [mountain[1], mountain[2]].filter((m) => m.selected)[0].id;
  const animateTo = mountain[animateFrom].direction;

  // Save
  return {
    update: {
      state: {
        phase: ESQUIADORES_PHASES.PRELIMINARY_RESULTS,
        mountainSection: MOUNTAIN_SECTION.LEVEL_2,
        players,
        lodges,
        animateFrom,
        animateTo,
      },
      stateCleanup: [],
    },
  };
};

/**
 * Last Change phase - final opportunity to change bets
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareLastChangePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: UID = state.activeSkierId;
  // Give final chips to players
  utils.players.addPropertiesToPlayers(players, {
    chips: BETTING_CHIPS.FINAL,
  });
  // Give skiers final chips
  players[activeSkierId].chips = SKIERS_BETTING_CHIPS.FINAL;

  const mountain: MountainDilemma[] = state.mountain;
  const animateFrom = [mountain[3], mountain[4], mountain[5]].filter((m) => m.selected)[0].id;

  // Save
  return {
    update: {
      state: {
        phase: ESQUIADORES_PHASES.LAST_CHANGE,
        mountainSection: MOUNTAIN_SECTION.LEVEL_2,
        players,
        animateFrom,
        animateTo: null,
      },
      stateCleanup: [],
    },
  };
};

/**
 * Results phase - reveals final positions and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: UID = state.activeSkierId;
  const lodges: Lodge[] = state.lodges;

  // Add players to lodges
  applyBetsToLodges(players, activeSkierId, lodges, BET_TYPES.FINAL);

  // Aggregate all bets per player
  aggregateBets(players, activeSkierId, BET_TYPES.FINAL);

  // Aggregate skier lodge bets (skiers now bet on lodges, not players)
  const skier = players[activeSkierId];
  skier.bets = lodges.reduce((acc: Dictionary<number>, lodge) => {
    acc[lodge.id] = 0;
    if (skier[SKIER_BET_TYPES.SKIERS_BETS]?.[lodge.id]) {
      acc[lodge.id] += skier[SKIER_BET_TYPES.SKIERS_BETS][lodge.id];
    }
    if (skier[SKIER_BET_TYPES.SKIERS_BOOST]?.[lodge.id]) {
      acc[lodge.id] += skier[SKIER_BET_TYPES.SKIERS_BOOST][lodge.id];
    }
    return acc;
  }, {});

  // Calculate scores and rankings
  const ranking = calculateScores(players, activeSkierId, lodges, store);

  const mountain: MountainDilemma[] = state.mountain;
  const animateFrom = [mountain[3], mountain[4], mountain[5]].filter((m) => m.selected)[0].id;
  const animateTo = mountain[animateFrom].direction;

  const pastMountains = store.pastMountains ?? [];
  pastMountains.push({
    id: `${state.round.current}`,
    mountain,
    skierId: activeSkierId,
  });

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        pastMountains,
      },
      state: {
        phase: ESQUIADORES_PHASES.FINAL_RESULTS,
        mountainSection: MOUNTAIN_SECTION.LODGE,
        players,
        ranking,
        lodges,
        animateFrom,
        animateTo,
      },
      stateCleanup: [],
    },
  };
};

/**
 * Game Over phase - determines winners and saves game data
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ESQUIADORES,
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
        phase: ESQUIADORES_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        gallery: store.pastMountains,
        achievements,
      },
    },
  };
};
