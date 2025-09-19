// Types
import type { FirebaseStateData, FirebaseStoreData, Lodge, MountainDilemma, ResourceData } from './types';
import type { DilemmaCard } from '../../types/tdr';
// Utils
import utils from '../../utils';
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
import { GAME_NAMES } from '../../utils/constants';
import { aggregateBets, applyBetsToLodges, calculateScores, getAchievements } from './helpers';
import { makeArray } from '../../utils/game-utils';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const { gameOrder, playerIds: turnOrder } = utils.players.buildGameOrder(players, DOUBLE_ROUNDS_THRESHOLD);

  // Build deck
  const deck = utils.game.getRandomItems(resourceData.dilemmas, gameOrder.length * DILEMMAS_PER_ROUND);

  const achievements = utils.achievements.setup(players, {
    lodges: 0,
    bets: 0,
    initial: 0,
    boost: 0,
    final: 0,
    onlyLodge: 0,
    players: 0,
    betOn: 0,
    highestBet: [],
  });

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
  const round = utils.helpers.increaseRound(state.round);
  const activeSkierId = utils.players.getActivePlayer(state.turnOrder, round.current);

  // Give initial chips to players
  utils.players.addPropertiesToPlayers(players, {
    chips: BETTING_CHIPS.INITIAL,
  });
  // Give skiers initial chips
  players[activeSkierId].chips = SKIERS_BETTING_CHIPS.INITIAL;

  const deck: DilemmaCard[] = store.deck;
  const dilemmas = deck.splice(0, DILEMMAS_PER_ROUND);
  const sprites = utils.game.shuffle(makeArray(13).map((i) => `mountain-${i}`));
  const mountain: MountainDilemma[] = dilemmas.map((dilemma, index) => ({
    id: index,
    spriteId: sprites[index],
    direction: null,
    dilemma: dilemma,
    selected: index === 0,
  }));

  const catchUp: PlayerId[] = [];
  // Catch up mechanism: give last player(s) extra chips
  if (round.current > 1) {
    utils.players.determineLosers(players).forEach((player) => {
      player.chips += CATCH_UP_BONUS;
      catchUp.push(player.id);
    });
  }

  const lodges: Lodge[] = utils.game.makeArray(6).map((i) => ({
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

export const prepareStartingResultsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: PlayerId = state.activeSkierId;
  const skier = players[activeSkierId];
  const choices: string[] = skier.choices;
  const mountain: MountainDilemma[] = state.mountain;
  const lodges: Lodge[] = state.lodges;

  // Add skier selections to mountain
  const isGoingLeftLevel1 = choices[0] === 'left';
  const isGoingLeftLevel2 = choices[isGoingLeftLevel1 ? 1 : 2] === 'left';
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

export const prepareBoostsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: PlayerId = state.activeSkierId;
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

export const preparePreliminaryResultsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: PlayerId = state.activeSkierId;
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

export const prepareLastChangePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: PlayerId = state.activeSkierId;
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

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const activeSkierId: PlayerId = state.activeSkierId;
  const lodges: Lodge[] = state.lodges;

  // Add players to lodges
  applyBetsToLodges(players, activeSkierId, lodges, BET_TYPES.FINAL);

  // Aggregate all bets per player
  aggregateBets(players, activeSkierId, BET_TYPES.FINAL);

  // Aggregate skier player bets
  const allPlayersBySkier = utils.players.getListOfPlayers(players, true, [activeSkierId]);
  const skier = players[activeSkierId];
  skier.bets = allPlayersBySkier.reduce((acc: NumberDictionary, player) => {
    acc[player.id] = 0;
    if (player[BET_TYPES.INITIAL][player.id]) acc[player.id] += player[BET_TYPES.INITIAL][player.id];
    if (player[BET_TYPES.BOOST][player.id]) acc[player.id] += player[BET_TYPES.BOOST][player.id];
    if (player[BET_TYPES.FINAL][player.id]) acc[player.id] += player[BET_TYPES.FINAL][player.id];
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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

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
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
