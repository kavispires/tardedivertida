import utils from '../../utils';
import {
  CHAMPIONSHIP_ORDER,
  CONTENDERS_PER_ROUND,
  SUPER_CAMPEONATO_ACHIEVEMENTS,
  SUPER_CAMPEONATO_PHASES,
  TOTAL_ROUNDS,
} from './constants';
import type { ContenderCard, TextCard } from '../../types/tdr';
import type {
  Bracket,
  BracketTier,
  FightingContender,
  ContendersDeck,
  FirebaseStoreData,
  SuperCampeonatoAchievement,
} from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param tier
 * @param autoContenders - if players won't have contenders, they don't need to select
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  tier?: string,
  autoContenders?: boolean,
): string => {
  const { RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE, RESULTS, GAME_OVER } =
    SUPER_CAMPEONATO_PHASES;
  const order = autoContenders
    ? [RULES, SETUP, CHALLENGE_SELECTION, BETS, BATTLE]
    : [RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE];

  if (currentPhase === RESULTS) {
    return round.forceLastRound || round.current >= round.total ? GAME_OVER : CHALLENGE_SELECTION;
  }

  if (currentPhase === BATTLE) {
    // If in the middle of the battle
    if (tier === 'quarter' || tier === 'semi') {
      return BATTLE;
    }

    return RESULTS;
  }

  if (currentPhase === CHALLENGE_SELECTION && isFinalRound(round)) {
    return BETS;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  utils.helpers.warnMissingPhase(currentPhase);
  return CHALLENGE_SELECTION;
};

/**
 * Check if it is the final voting round
 * @param round
 * @returns
 */
export const isFinalRound = (round: Round): boolean => {
  return round.current === TOTAL_ROUNDS;
};

export const getTableContenders = (contendersDeck: ContendersDeck, players: Players): FightingContender[] => {
  const playerCount = utils.players.getPlayerCount(players);
  const neededContendersPerRound =
    playerCount > CONTENDERS_PER_ROUND ? CONTENDERS_PER_ROUND : CONTENDERS_PER_ROUND - playerCount;

  const quantityNeeded = neededContendersPerRound * TOTAL_ROUNDS;

  if (quantityNeeded <= 0) {
    return [];
  }

  const usedContenders = utils.helpers.flattenArray<ContenderCard>(
    utils.players.getListOfPlayers(players).map((player) => player.contenders),
  );

  const selectedContenders = utils.game.getRandomUniqueObjects<ContenderCard>(
    contendersDeck,
    usedContenders,
    quantityNeeded,
    'id',
  );

  return selectedContenders.map((contender) => ({
    id: contender.id,
    name: contender.name,
    description: contender.description,
    playerId: 'CPU',
  }));
};

export const getMostVotedChallenge = (players: Players, challenges: TextCard[]) => {
  const votes: NumberDictionary = {};

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (votes[player.challengeId] === undefined) {
      votes[player.challengeId] = 0;
    }
    votes[player.challengeId] += 1;
  });

  const challengesIds = Object.keys(votes);
  const votesCount: number[] = challengesIds.map((key) => votes[key]);

  const max = Math.max(...votesCount);

  // If both got the max votes, return a random one
  if (votesCount.length > 1 && votesCount.every((vc) => vc === max)) {
    return utils.game.getRandomItem(challenges);
  }

  // Return only the most voted one
  const index = votesCount.findIndex((vc) => vc === max);
  const winnerId = challengesIds[index];
  const winner = challenges.find((card) => card.id === winnerId);

  return winner ? winner : challenges[0];
};

const getBracketTier = (position: number): BracketTier => {
  if (position < 8) return 'quarter';
  if (position < 12) return 'semi';
  if (position < 14) return 'final';
  return 'winner';
};

export const makeBrackets = (players: Players, deck: FightingContender[], currentRound: number) => {
  const contenders: FightingContender[] = [];
  // Gather contenders selected by players, remove those from the players cards
  utils.players.getListOfPlayers(players).forEach((player) => {
    // Get contender
    const contender = player.contenders.find((c: FightingContender) => c.id === player.selectedContenderId);

    if (contender) {
      // Remove contender from player's hand
      player.contenders = player.contenders.filter(
        (c: FightingContender) => c.id !== player.selectedContenderId,
      );
      // Add contenders to player's used contenders
      player.usedContenders.push(contender.id);
      // Add to selected ones
      contenders.push({
        ...contender,
        playerId: player.id,
      });
    }
  });

  // Add additional contenders if needed
  const needed = CONTENDERS_PER_ROUND - contenders.length;
  for (let i = 0; i < needed; i++) {
    contenders.push(deck[i + currentRound * needed]);
  }

  // Make brackets
  const shuffledContenders = utils.game.shuffle(contenders);

  const emptyBracketArray: Bracket[] = Array(15)
    .fill(0)
    .map((v, index) => ({
      id: 'TBD',
      name: { pt: '?', en: 'TBD' },
      description: { pt: '?', en: '?' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
      votes: [],
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
    emptyBracketArray[index].description = contender?.description ?? { pt: '?', en: '?' };
    emptyBracketArray[index].playerId = contender.playerId;
  });

  return emptyBracketArray;
};

export const getChampionshipTier = (currentTier?: string) => {
  switch (currentTier) {
    case CHAMPIONSHIP_ORDER[0]:
      return CHAMPIONSHIP_ORDER[1];
    case CHAMPIONSHIP_ORDER[1]:
      return CHAMPIONSHIP_ORDER[2];
    default:
      return CHAMPIONSHIP_ORDER[0];
  }
};

export const updateBracketsWithVotes = (players: Players, brackets: Bracket[]) => {
  // Target Position: Voted Position: Votes
  const votes: Record<number, Record<number, number>> = {};

  // Count votes
  utils.players.getListOfPlayers(players).forEach((player) => {
    const pVotes: NumberDictionary = player.votes;
    Object.keys(pVotes).forEach((vote) => {
      const target = Number(vote);
      const voted = pVotes[vote];

      if (votes[target] === undefined) {
        votes[target] = {};
      }

      if (votes[target][voted] === undefined) {
        votes[target][voted] = 0;
      }

      votes[target][voted] += 1;

      brackets[voted].votes.push(player.id);
    });
  });

  // Determine winners
  Object.keys(votes).forEach((targetPos) => {
    const targetVotes: Record<number, number> = votes[targetPos];
    const arrKeys = Object.keys(targetVotes);
    const arrValues = arrKeys.map((key) => targetVotes[key]);

    const max = Math.max(...arrValues);
    const gotThis = arrValues.filter((v) => v === max);

    const winnerPos =
      gotThis.length === 1
        ? Number(arrKeys[arrValues.findIndex((v) => v === max)])
        : utils.game.getRandomItem(arrKeys);
    const winner = brackets[Number(winnerPos)];
    winner.win = true;

    brackets[targetPos] = {
      ...brackets[targetPos],
      id: winner.id,
      name: winner.name,
      description: winner?.description ?? { pt: '?', en: '?' },
      playerId: winner.playerId,
      votes: [],
    };
  });

  return brackets;
};

export const buildRanking = (players: Players, brackets: Bracket[]) => {
  // Gained points: final, semi, quarter, own contender
  const scores = new utils.players.Scores(players, [0, 0, 0, 0]);

  const parsedBrackets = brackets.reduce((acc: Record<string, BracketTier[]>, bracket) => {
    if (acc[bracket.id] === undefined) {
      acc[bracket.id] = [];
    }
    acc[bracket.id].push(bracket.tier);
    return acc;
  }, {});

  utils.players.getListOfPlayers(players).forEach((player) => {
    if (parsedBrackets?.[player.bets.final]?.includes('winner')) {
      scores.add(player.id, 5, 0);
    }

    if (parsedBrackets?.[player.bets.semi]?.includes('final')) {
      scores.add(player.id, 3, 1);
    }

    if (parsedBrackets?.[player.bets.quarter]?.includes('semi')) {
      scores.add(player.id, 1, 2);
    }

    if (brackets[brackets.length - 1].playerId === player.id) {
      scores.add(player.id, 2, 3);
    }
  });

  return scores.rank(players);
};

export const makeFinalBrackets = (brackets: Bracket[]) => {
  // Make brackets
  const shuffledContenders = utils.game.shuffle(brackets);

  const emptyBracketArray: Bracket[] = Array(15)
    .fill(0)
    .map((v, index) => ({
      id: 'TBD',
      name: { pt: 'TBD', en: 'TBD' },
      description: { pt: '?', en: '?' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
      votes: [],
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
    emptyBracketArray[index].description = contender?.description ?? { pt: '?', en: '?' };
    emptyBracketArray[index].playerId = contender.playerId;
  });

  return emptyBracketArray;
};

/**
 * Retrieves the past battles with the given brackets and challenge.
 * @param brackets - An array of brackets containing information about past battles.
 * @param challenge - The challenge card for the past battles.
 * @return An object containing the challenge card and an array of contenders sorted by number of wins.
 */
export const getPastBattle = (brackets: Bracket[], challenge: TextCard) => {
  const winsByContender: NumberDictionary = {};

  brackets.forEach((bracket) => {
    const currentWins = winsByContender[bracket.id] || 0;
    winsByContender[bracket.id] = currentWins + 1;
  });

  const sortedWins: [CardId, number][] = Object.entries(winsByContender).sort(
    ([, winsA], [, winsB]) => winsB - winsA,
  );

  const reversedBrackets = [...brackets].reverse();

  const contenders = sortedWins.reduce((acc: Bracket[], [cardId]) => {
    const entry = reversedBrackets.find((c) => c.id === cardId);
    if (entry) {
      acc.push(entry);
    }
    return acc;
  }, []);

  return {
    challenge,
    contenders,
  };
};

export const updateAchievements = (store: FirebaseStoreData, brackets: Bracket[]) => {
  Object.values(brackets).forEach((bracket) => {
    if (bracket.playerId !== 'CPU') {
      // Achievement: Quarter Contender votes
      if (bracket.tier === 'quarter') {
        utils.achievements.increase(store, bracket.playerId, 'quarterContender', bracket.votes.length);
      }

      // Achievement: Semi Contender votes
      if (bracket.tier === 'semi') {
        utils.achievements.increase(store, bracket.playerId, 'semiContender', bracket.votes.length);
      }

      // Achievement: Final Contender votes
      if (bracket.tier === 'final') {
        utils.achievements.increase(store, bracket.playerId, 'finalContender', bracket.votes.length);
      }

      // Achievement: Contender votes
      utils.achievements.increase(store, bracket.playerId, 'contender', bracket.votes.length);
    }

    // Achievement: Solitaire votes
    if (bracket.votes.length === 1) {
      utils.achievements.increase(store, bracket.votes[0], 'solitaire', 1);
    } else {
      // Achievement: group votes
      bracket.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'groupVotes', 1);
      });
    }

    // Bets
    if (bracket.win) {
      bracket.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'bets', 1);

        if (bracket.tier === 'quarter') {
          utils.achievements.increase(store, playerId, 'quarterBets', 1);
        }
        if (bracket.tier === 'semi') {
          utils.achievements.increase(store, playerId, 'semiBets', 1);
        }
        if (bracket.tier === 'final') {
          utils.achievements.increase(store, playerId, 'finalBets', 1);
        }
      });
    }
  });
};

/**
 * Get achievements:
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<SuperCampeonatoAchievement>[] = [];

  // Most Quarter Bets
  const { most: bestQuarterBets, least: worstQuarterBets } = utils.achievements.getMostAndLeastOf(
    store,
    'quarterBets',
  );
  if (bestQuarterBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_QUARTER_BETS,
      playerId: bestQuarterBets.playerId,
      value: bestQuarterBets.value,
    });
  }

  if (worstQuarterBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_QUARTER_BETS,
      playerId: worstQuarterBets.playerId,
      value: worstQuarterBets.value,
    });
  }

  // Most Semi Bets
  const { most: bestSemiBets, least: worstSemiBets } = utils.achievements.getMostAndLeastOf(
    store,
    'semiBets',
  );
  if (bestSemiBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_SEMI_BETS,
      playerId: bestSemiBets.playerId,
      value: bestSemiBets.value,
    });
  }
  if (worstSemiBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_SEMI_BETS,
      playerId: worstSemiBets.playerId,
      value: worstSemiBets.value,
    });
  }

  // Most Final Bets
  const { most: bestFinalBets, least: worstFinalBets } = utils.achievements.getMostAndLeastOf(
    store,
    'finalBets',
  );
  if (bestFinalBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_FINAL_BETS,
      playerId: bestFinalBets.playerId,
      value: bestFinalBets.value,
    });
  }
  if (worstFinalBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_FINAL_BETS,
      playerId: worstFinalBets.playerId,
      value: worstFinalBets.value,
    });
  }

  // Most Overall Bets
  const { most: bestOverallBets, least: worstOverallBets } = utils.achievements.getMostAndLeastOf(
    store,
    'bets',
  );
  if (bestOverallBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_OVERALL_BETS,
      playerId: bestOverallBets.playerId,
      value: bestOverallBets.value,
    });
  }
  if (worstOverallBets) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_OVERALL_BETS,
      playerId: worstOverallBets.playerId,
      value: worstOverallBets.value,
    });
  }

  // Most Quarter Contenders
  const { most: bestQuarterContenders, least: worstQuarterContenders } = utils.achievements.getMostAndLeastOf(
    store,
    'quarterContender',
  );
  if (bestQuarterContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_QUARTER_CONTENDERS,
      playerId: bestQuarterContenders.playerId,
      value: bestQuarterContenders.value,
    });
  }
  if (worstQuarterContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_QUARTER_CONTENDERS,
      playerId: worstQuarterContenders.playerId,
      value: worstQuarterContenders.value,
    });
  }

  // Most Semi Contenders
  const { most: bestSemiContenders, least: worstSemiContenders } = utils.achievements.getMostAndLeastOf(
    store,
    'semiContender',
  );
  if (bestSemiContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_SEMI_CONTENDERS,
      playerId: bestSemiContenders.playerId,
      value: bestSemiContenders.value,
    });
  }
  if (worstSemiContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_SEMI_CONTENDERS,
      playerId: worstSemiContenders.playerId,
      value: worstSemiContenders.value,
    });
  }

  // Most Final Contenders
  const { most: bestFinalContenders, least: worstFinalContenders } = utils.achievements.getMostAndLeastOf(
    store,
    'finalContender',
  );
  if (bestFinalContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_FINAL_CONTENDERS,
      playerId: bestFinalContenders.playerId,
      value: bestFinalContenders.value,
    });
  }
  if (worstFinalContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_FINAL_CONTENDERS,
      playerId: worstFinalContenders.playerId,
      value: worstFinalContenders.value,
    });
  }

  // Most Contenders
  const { most: bestContenders, least: worstContenders } = utils.achievements.getMostAndLeastOf(
    store,
    'contender',
  );
  if (bestContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.BEST_CONTENDERS,
      playerId: bestContenders.playerId,
      value: bestContenders.value,
    });
  }

  if (worstContenders) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.WORST_CONTENDER,
      playerId: worstContenders.playerId,
      value: worstContenders.value,
    });
  }

  // Most Group Votes
  const { most: mostGroupVotes } = utils.achievements.getMostAndLeastOf(store, 'groupVotes');
  if (mostGroupVotes) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.MOST_GROUP_VOTES,
      playerId: mostGroupVotes.playerId,
      value: mostGroupVotes.value,
    });
  }

  // Solitaire Vote
  const { most: solitaireVote } = utils.achievements.getMostAndLeastOf(store, 'solitaireVote');
  if (solitaireVote) {
    achievements.push({
      type: SUPER_CAMPEONATO_ACHIEVEMENTS.SOLITAIRE_VOTE,
      playerId: solitaireVote.playerId,
      value: solitaireVote.value,
    });
  }

  return achievements;
};
