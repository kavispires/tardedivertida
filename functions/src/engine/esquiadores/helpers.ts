// Utils
import utils from '../../utils';
import { print } from '../../utils/helpers';
import { ESQUIADORES_ACHIEVEMENTS, ESQUIADORES_PHASES, SKIER_BET_TYPES } from './constants';
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
  activeSkierId: PlayerId,
  lodges: Lodge[],
  store: FirebaseStoreData,
) => {
  // Gained Points [correct bets, non-selected lodges, skier bets, non-selected skier players]
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);

  const allPlayersButSkier = utils.players.getListOfPlayers(players, true, [activeSkierId]);
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
    // Achievement: Most lodges
    utils.achievements.increase(store, player.id, 'lodges', lodges.length - lodgesWithoutBet);
  });

  // Skier's points is based on their 5 betting chips. Each chip represents 20% of the selected player's betting scored points.
  const skierPlayersWithBets: BooleanDictionary = {};
  const skier = players[activeSkierId];
  Object.keys(skier[SKIER_BET_TYPES.SKIERS_BETS]).forEach((playerId) => {
    const playerPoints = skierReferencePoints[playerId];
    if (skier[SKIER_BET_TYPES.SKIERS_BETS][playerId]) {
      skierPlayersWithBets[playerId] = true;
      const skierPoints = playerPoints * 0.1;
      scores.add(activeSkierId, skierPoints, 2);
    }
  });
  Object.keys(skier[SKIER_BET_TYPES.SKIERS_BOOST]).forEach((playerId) => {
    const playerPoints = skierReferencePoints[playerId];
    if (skier[SKIER_BET_TYPES.SKIERS_BOOST][playerId]) {
      skierPlayersWithBets[playerId] = true;
      const skierPoints = playerPoints * 0.1;
      scores.add(activeSkierId, skierPoints, 2);
    }
  });

  // Skier points for players they didn't bet on
  scores.add(activeSkierId, allPlayersButSkier.length - Object.keys(skierPlayersWithBets).length, 3);

  return scores.rank(players, true);
};

export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<EsquiadoresAchievement>[] = [];
  print(ESQUIADORES_ACHIEVEMENTS);
  print(store.achievements);

  return achievements;
};
