// Utils
import { cloneDeep } from 'lodash';
import utils from '../../utils';
import { BET_TYPES, ESQUIADORES_ACHIEVEMENTS, ESQUIADORES_PHASES, SKIER_BET_TYPES } from './constants';
import type { EsquiadoresAchievement, FirebaseStoreData, Lodge } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @returns
 */
export const determineNextPhase = (currentPhase: string, round: Round): string => {
  const {
    RULES,
    SETUP,
    BETS,
    STARTING_RESULTS,
    BOOSTS,
    PRELIMINARY_RESULTS,
    LAST_CHANGE,
    FINAL_RESULTS,
    GAME_OVER,
  } = ESQUIADORES_PHASES;
  const order = [
    RULES,
    SETUP,
    BETS,
    STARTING_RESULTS,
    BOOSTS,
    PRELIMINARY_RESULTS,
    LAST_CHANGE,
    FINAL_RESULTS,
    GAME_OVER,
  ];

  if (currentPhase === FINAL_RESULTS) {
    return round.forceLastRound || (round.current > 0 && round.current === round.total) ? GAME_OVER : BETS;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return BETS;
};

export const applyBetsToLodges = (players: Players, skierId: PlayerId, lodges: Lodge[], betType: string) => {
  const allPlayersBySkier = utils.players.getListOfPlayers(players, true, [skierId]);
  // Also update lodges with players
  allPlayersBySkier.forEach((player) => {
    const bets: NumberDictionary = player[betType];
    Object.keys(bets).forEach((betKey) => {
      const betValue = bets[betKey];
      if (betValue > 0) {
        const lodgeId = Number.parseInt(betKey, 10);
        lodges[lodgeId].playersIds.push(player.id);
        lodges[lodgeId].playersIds = utils.game.removeDuplicates(lodges[lodgeId].playersIds);
      }
    });
  });
};

export const aggregateBets = (players: Players, skierId: PlayerId, betType: string) => {
  const allPlayersBySkier = utils.players.getListOfPlayers(players, true, [skierId]);

  allPlayersBySkier.forEach((player) => {
    const bets: NumberDictionary = player.bets ?? {};
    const playerBets = player[betType];
    Object.keys(playerBets).forEach((betKey) => {
      const betValue = playerBets[betKey];
      if (betValue > 0) {
        bets[betKey] = (bets[betKey] ?? 0) + betValue;
      }
    });
    player.bets = bets;
  });
};

export const calculateScores = (
  players: Players,
  skierId: PlayerId,
  lodges: Lodge[],
  store: FirebaseStoreData,
) => {
  // Gained Points [correct bets, non-selected lodges, skier bets, non-selected skier players]
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);

  const allPlayersButSkier = utils.players.getListOfPlayers(players, true, [skierId]);
  const skierReferencePoints: NumberDictionary = {};

  const finalLodgeId = lodges.find((lodge) => lodge.selected)?.id ?? 0;

  allPlayersButSkier.forEach((player) => {
    const bets: NumberDictionary = player.bets;

    // TODO: add multiplier here for each chip
    const correctBet = bets?.[finalLodgeId] ?? 0;
    scores.add(player.id, correctBet, 0);
    skierReferencePoints[player.id] = correctBet;

    const lodgesWithoutBet = 6 - Object.values(bets).filter((bet) => bet && bet !== 0).length;
    scores.add(player.id, lodgesWithoutBet, 1);
    // Achievement: Most/Fewest lodges
    utils.achievements.increase(store, player.id, 'lodges', lodges.length - lodgesWithoutBet);
  });

  // Skier's points is based on their 5 betting chips. Each chip represents 20% of the selected player's betting scored points.
  const skierPlayersWithBets: BooleanDictionary = {};
  const skier = players[skierId];
  Object.keys(skier[SKIER_BET_TYPES.SKIERS_BETS]).forEach((playerId) => {
    const playerPoints = skierReferencePoints[playerId];
    if (skier[SKIER_BET_TYPES.SKIERS_BETS][playerId]) {
      skierPlayersWithBets[playerId] = true;
      const skierPoints = playerPoints * 0.1;
      scores.add(skierId, skierPoints, 2);
    }
  });
  Object.keys(skier[SKIER_BET_TYPES.SKIERS_BOOST]).forEach((playerId) => {
    const playerPoints = skierReferencePoints[playerId];
    if (skier[SKIER_BET_TYPES.SKIERS_BOOST][playerId]) {
      skierPlayersWithBets[playerId] = true;
      const skierPoints = playerPoints * 0.1;
      scores.add(skierId, skierPoints, 2);
    }
  });

  // Achievement: Most/Fewest Players
  utils.achievements.increase(store, skierId, 'players', Object.keys(skierPlayersWithBets).length);

  // Skier points for players they didn't bet on
  scores.add(skierId, allPlayersButSkier.length - Object.keys(skierPlayersWithBets).length, 3);

  // So this function is not giant, we'll calculate achievements in a separate function
  calculateBetAchievements(players, skierId, lodges, store);

  return scores.rank(players, true);
};

export const calculateBetAchievements = (
  players: Players,
  skierId: PlayerId,
  lodges: Lodge[],
  store: FirebaseStoreData,
) => {
  const REF = Object.values(lodges).reduce((acc: ArrayDictionary<string>, l) => {
    acc[l.id] = [];
    return acc;
  }, {});

  const initialBets: ArrayDictionary<string> = cloneDeep(REF);
  const boostBets: ArrayDictionary<string> = cloneDeep(REF);
  const finalBets: ArrayDictionary<string> = cloneDeep(REF);
  const bets: ArrayDictionary<string> = cloneDeep(REF);

  const allPlayersButSkier = utils.players.getListOfPlayers(players, true, [skierId]);

  // Aggregate all bets
  allPlayersButSkier.forEach((player) => {
    Object.keys(player[BET_TYPES.INITIAL]).forEach((lodgeKey) => {
      const betValue = player[BET_TYPES.INITIAL][lodgeKey];
      if (betValue && betValue > 0) {
        initialBets[lodgeKey].push(player.id);
        bets[lodgeKey].push(player.id);
      }
    });

    Object.keys(player[BET_TYPES.BOOST]).forEach((lodgeKey) => {
      const betValue = player[BET_TYPES.BOOST][lodgeKey];
      if (betValue && betValue > 0) {
        boostBets[lodgeKey].push(player.id);
        bets[lodgeKey].push(player.id);
      }
    });

    Object.keys(player[BET_TYPES.FINAL]).forEach((lodgeKey) => {
      const betValue = player[BET_TYPES.FINAL][lodgeKey];
      if (betValue && betValue > 0) {
        finalBets[lodgeKey].push(player.id);
        bets[lodgeKey].push(player.id);
      }
    });

    // Achievement: Highest Bet
    const highestBet = Math.max(...Object.values<number>(player.bets ?? {}));
    utils.achievements.push(store, player.id, 'highestBet', highestBet);
  });

  // Calculate achievements
  Object.values(initialBets).forEach((playersInBet) => {
    playersInBet.forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'initial', 1);
    });
  });
  Object.values(boostBets).forEach((playersInBet) => {
    playersInBet.forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'boost', 1);
    });
  });
  Object.values(finalBets).forEach((playersInBet) => {
    playersInBet.forEach((playerId) => {
      utils.achievements.increase(store, playerId, 'final', 1);
    });
  });
  Object.values(bets).forEach((playersInBet) => {
    if (playersInBet.length === 1) {
      utils.achievements.increase(store, playersInBet[0], 'onlyLodge', 1);
    } else {
      playersInBet.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'bets', 1);
      });
    }
  });
};

export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<EsquiadoresAchievement>[] = [];

  // Most/Fewest lodges
  const { most: mostLodges, least: fewestLodges } = utils.achievements.getMostAndLeastOf(store, 'lodges');

  if (mostLodges) {
    achievements.push({
      playerId: mostLodges.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_LODGES,
      value: mostLodges.value,
    });
  }

  if (fewestLodges) {
    achievements.push({
      playerId: fewestLodges.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_LODGES,
      value: fewestLodges.value,
    });
  }

  // Most/Fewest Group Bets
  const { most: mostGroupBets, least: fewestGroupBets } = utils.achievements.getMostAndLeastOf(store, 'bets');

  if (mostGroupBets) {
    achievements.push({
      playerId: mostGroupBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_GROUP_BETS,
      value: mostGroupBets.value,
    });
  }

  if (fewestGroupBets) {
    achievements.push({
      playerId: fewestGroupBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_GROUP_BETS,
      value: fewestGroupBets.value,
    });
  }

  // Most/Fewest Group Initial Bets
  const { most: mostGroupInitialBets, least: fewestGroupInitialBets } = utils.achievements.getMostAndLeastOf(
    store,
    'initial',
  );

  if (mostGroupInitialBets) {
    achievements.push({
      playerId: mostGroupInitialBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_GROUP_INITIAL_BETS,
      value: mostGroupInitialBets.value,
    });
  }

  if (fewestGroupInitialBets) {
    achievements.push({
      playerId: fewestGroupInitialBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_GROUP_INITIAL_BETS,
      value: fewestGroupInitialBets.value,
    });
  }

  // Most/Fewest Group Boost Bets
  const { most: mostGroupBoostBets, least: fewestGroupBoostBets } = utils.achievements.getMostAndLeastOf(
    store,
    'boost',
  );

  if (mostGroupBoostBets) {
    achievements.push({
      playerId: mostGroupBoostBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_GROUP_BOOST_BETS,
      value: mostGroupBoostBets.value,
    });
  }

  if (fewestGroupBoostBets) {
    achievements.push({
      playerId: fewestGroupBoostBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_GROUP_BOOST_BETS,
      value: fewestGroupBoostBets.value,
    });
  }

  // Most/Fewest Group Final Bets
  const { most: mostGroupFinalBets, least: fewestGroupFinalBets } = utils.achievements.getMostAndLeastOf(
    store,
    'final',
  );

  if (mostGroupFinalBets) {
    achievements.push({
      playerId: mostGroupFinalBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_GROUP_FINAL_BETS,
      value: mostGroupFinalBets.value,
    });
  }

  if (fewestGroupFinalBets) {
    achievements.push({
      playerId: fewestGroupFinalBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_GROUP_FINAL_BETS,
      value: fewestGroupFinalBets.value,
    });
  }

  // Only Lodge
  const { most: mostOnlyLodge } = utils.achievements.getMostAndLeastOf(store, 'onlyLodge');

  if (mostOnlyLodge) {
    achievements.push({
      playerId: mostOnlyLodge.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.ONLY_LODGE,
      value: mostOnlyLodge.value,
    });
  }

  // Most/Fewest Player Bets
  const { most: mostPlayerBets, least: fewestPlayerBets } = utils.achievements.getMostAndLeastOf(
    store,
    'players',
  );

  if (mostPlayerBets) {
    achievements.push({
      playerId: mostPlayerBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.MOST_PLAYER_BETS,
      value: mostPlayerBets.value,
    });
  }

  if (fewestPlayerBets) {
    achievements.push({
      playerId: fewestPlayerBets.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.FEWEST_PLAYER_BETS,
      value: fewestPlayerBets.value,
    });
  }

  // Highest Bet
  const { most: highestBet } = utils.achievements.getHighestAndLowestOccurrences(store, 'highestBet');

  if (highestBet) {
    achievements.push({
      playerId: highestBet.playerId,
      type: ESQUIADORES_ACHIEVEMENTS.HIGHEST_BET,
      value: highestBet.value,
    });
  }

  return achievements;
};
