import * as utils from '../../utils';
import { CHAMPIONSHIP_ORDER, CONTENDERS_PER_ROUND, SUPER_CAMPEONATO_PHASES, TOTAL_ROUNDS } from './constants';

import type { Bracket, BracketTier, Contender, ContendersDeck } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param tier
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  tier?: string,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE, RESULTS, GAME_OVER } =
    SUPER_CAMPEONATO_PHASES;
  const order = [RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE];

  if (currentPhase === RESULTS) {
    return triggerLastRound || round.current >= round.total ? GAME_OVER : CHALLENGE_SELECTION;
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
  console.warn('Missing phase check');
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

export const getTableContenders = (contendersDeck: ContendersDeck, players: Players): Contender[] => {
  const quantityNeeded = (CONTENDERS_PER_ROUND - Object.values(players).length) * TOTAL_ROUNDS;

  if (quantityNeeded <= 0) {
    return [];
  }

  const usedContenders = utils.helpers.flattenArray<ContenderCard>(
    Object.values(players).map((player) => player.contenders)
  );

  const selectedContenders = utils.game.getRandomUniqueObjects<ContenderCard>(
    contendersDeck,
    usedContenders,
    quantityNeeded,
    'id'
  );

  return selectedContenders.map((contender) => ({
    id: contender.id,
    name: contender.name,
    playerId: 'CPU',
  }));
};

export const getMostVotedChallenge = (players: Players, challenges: TextCard[]) => {
  const votes: NumberDictionary = {};

  Object.values(players).forEach((player) => {
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

export const makeBrackets = (players: Players, deck: Contender[], currentRound: number) => {
  const contenders: Contender[] = [];
  // Gather contenders selected by players, remove those from the players cards
  Object.values(players).forEach((player) => {
    // Get contender
    const contender = player.contenders.find((c: Contender) => c.id === player.selectedContenderId);
    // Remove contender from player's hand
    player.contenders = player.contenders.filter((c: Contender) => c.id !== player.selectedContenderId);
    // Add to selected ones
    contenders.push({
      ...contender,
      playerId: player.id,
    });
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
      name: { pt: 'TBD', en: 'TBD' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
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
  Object.values(players).forEach((player) => {
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
      playerId: winner.playerId,
    };
  });

  return brackets;
};

export const buildRanking = (players: Players, brackets: Bracket[]) => {
  // Gained points: super sparks, sparks, nightmare
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0]);

  const parsedBrackets = brackets.reduce((acc: Record<string, BracketTier[]>, bracket) => {
    if (acc[bracket.id] === undefined) {
      acc[bracket.id] = [];
    }
    acc[bracket.id].push(bracket.tier);
    return acc;
  }, {});

  Object.values(players).forEach((player) => {
    if (parsedBrackets?.[player.bets.final]?.includes('winner')) {
      newScores[player.id].gainedPoints[0] += 5;
      newScores[player.id].newScore += 5;
      players[player.id].score += 5;
    }

    if (parsedBrackets?.[player.bets.semi]?.includes('final')) {
      newScores[player.id].gainedPoints[0] += 3;
      newScores[player.id].newScore += 3;
      players[player.id].score += 3;
    }

    if (parsedBrackets?.[player.bets.quarter]?.includes('semi')) {
      newScores[player.id].gainedPoints[0] += 1;
      newScores[player.id].newScore += 1;
      players[player.id].score += 1;
    }

    if (brackets[brackets.length - 1].playerId === player.id) {
      newScores[player.id].gainedPoints[1] += 2;
      newScores[player.id].newScore += 2;
      players[player.id].score += 2;
    }
  });

  return Object.values(newScores).sort((a, b) => (a.newScore > b.newScore ? 1 : -1));
};

export const makeFinalBrackets = (brackets: Bracket[]) => {
  // Make brackets
  const shuffledContenders = utils.game.shuffle(brackets);

  const emptyBracketArray: Bracket[] = Array(15)
    .fill(0)
    .map((v, index) => ({
      id: 'TBD',
      name: { pt: 'TBD', en: 'TBD' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
    emptyBracketArray[index].playerId = contender.playerId;
  });

  return emptyBracketArray;
};