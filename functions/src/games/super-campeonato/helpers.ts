import { sample, shuffle } from 'lodash';
// Types
import type { ContenderCardData, TextCardData } from '../../types/tdr';
import type { Bracket, BracketTier, FightingContender, ContendersDeck, FirebaseStoreData } from './types';
// Constants
import { NPC } from '../../constants/general';
import { CHAMPIONSHIP_ORDER, CONTENDERS_PER_ROUND, SUPER_CAMPEONATO_PHASES, TOTAL_ROUNDS } from './constants';
// Mechanics
import { getListOfPlayers, getPlayerCount } from '../../mechanics/players';
import { Scores } from '../../mechanics/scoring';
import { nextPhaseDelegator } from '../../mechanics/session';
// Utils
import { getRandomUniqueObjects } from '../../utils';
// Internal
import { increaseAchievement } from './achievements';

/**
 * Determines the next phase based on the current phase, tier, and configuration
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param tier - The current tournament tier
 * @param autoContenders - Whether contenders are automatically assigned
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  tier?: string,
  autoContenders?: boolean,
): string => {
  const { SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE, RESULTS, GAME_OVER } =
    SUPER_CAMPEONATO_PHASES;
  const order = autoContenders
    ? [SETUP, CHALLENGE_SELECTION, BETS, BATTLE, GAME_OVER]
    : [SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE, GAME_OVER];

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

  return nextPhaseDelegator(currentPhase, order);
};

/**
 * Check if it is the final voting round
 * @param round - The round object containing current round information
 */
export const isFinalRound = (round: Round): boolean => {
  return round.current === TOTAL_ROUNDS;
};

/**
 * Gets table contenders to fill brackets when needed
 * @param contendersDeck - The deck of contender cards
 * @param players - The collection of players in the game
 */
export const getTableContenders = (contendersDeck: ContendersDeck, players: Players): FightingContender[] => {
  const playerCount = getPlayerCount(players);
  const neededContendersPerRound =
    playerCount > CONTENDERS_PER_ROUND ? CONTENDERS_PER_ROUND : CONTENDERS_PER_ROUND - playerCount;

  const quantityNeeded = neededContendersPerRound * TOTAL_ROUNDS;

  if (quantityNeeded <= 0) {
    return [];
  }

  const usedContenders: ContenderCardData[] = getListOfPlayers(players).flatMap(
    (player) => player.contenders,
  );

  const selectedContenders = getRandomUniqueObjects<ContenderCardData>(
    contendersDeck,
    usedContenders,
    quantityNeeded,
    'id',
  );

  return selectedContenders.map((contender) => ({
    id: contender.id,
    name: contender.name,
    description: contender.description ?? { pt: '', en: '' },
    playerId: NPC,
  }));
};

/**
 * Gets the most voted challenge from player votes
 * @param players - The collection of players in the game
 * @param challenges - The array of challenge cards
 */
export const getMostVotedChallenge = (players: Players, challenges: TextCardData[]) => {
  const votes: Dictionary<number> = {};

  getListOfPlayers(players).forEach((player) => {
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
    return sample(challenges);
  }

  // Return only the most voted one
  const index = votesCount.indexOf(max);
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

/**
 * Makes tournament brackets from player and table contenders
 * @param players - The collection of players in the game
 * @param deck - The array of fighting contenders
 * @param currentRound - The current round number
 */
export const makeBrackets = (players: Players, deck: FightingContender[], currentRound: number) => {
  const contenders: FightingContender[] = [];
  // Gather contenders selected by players, remove those from the players cards
  getListOfPlayers(players).forEach((player) => {
    // Get contender
    const playerContenders: FightingContender[] = player.contenders.filter((c: FightingContender) =>
      player.selectedContenderIds.includes(c.id),
    );

    if (playerContenders.length > 0) {
      // Remove contender from player's hand
      player.contenders = player.contenders.filter(
        (c: FightingContender) => !player.selectedContenderIds.includes(c.id),
      );
      // Add contenders to player's used contenders
      player.usedContenders.push(...player.selectedContenderIds);
      // Add to selected ones
      contenders.push(
        ...playerContenders.map((contender) => ({
          ...contender,
          playerId: player.id,
        })),
      );
    }
  });

  // Add additional contenders if needed
  const needed = CONTENDERS_PER_ROUND - contenders.length;
  for (let i = 0; i < needed; i++) {
    contenders.push(deck[i + currentRound * needed]);
  }

  // Make brackets
  const shuffledContenders = shuffle(contenders);

  const emptyBracketArray: Bracket[] = Array(15)
    .fill(0)
    .map((v, index) => ({
      id: 'TBD',
      name: { pt: '?', en: 'TBD' },
      description: { pt: '', en: '' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
      votes: [],
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
    emptyBracketArray[index].description = contender.description ?? { pt: '', en: '' };
    emptyBracketArray[index].playerId = contender.playerId;
  });

  return emptyBracketArray;
};

/**
 * Gets the next championship tier in progression
 * @param currentTier - The current championship tier
 */
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

/**
 * Updates brackets with player votes and determines winners
 * @param players - The collection of players in the game
 * @param brackets - The array of bracket objects
 */
export const updateBracketsWithVotes = (players: Players, brackets: Bracket[]) => {
  // Target Position: Voted Position: Votes
  const votes: Record<number, Record<number, number>> = {};

  // Count votes
  getListOfPlayers(players).forEach((player) => {
    const pVotes: Dictionary<number> = player.votes;
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

    const winnerPos = gotThis.length === 1 ? Number(arrKeys[arrValues.indexOf(max)]) : sample(arrKeys);
    const winner = brackets[Number(winnerPos)];
    winner.win = true;

    brackets[targetPos] = {
      ...brackets[targetPos],
      id: winner.id,
      name: winner.name,
      description: winner.description ?? { pt: '', en: '' },
      playerId: winner.playerId,
      votes: [],
    };
  });

  return brackets;
};

/**
 * Builds player rankings based on betting outcomes
 * @param players - The collection of players in the game
 * @param brackets - The array of bracket objects
 */
export const buildRanking = (players: Players, brackets: Bracket[]) => {
  // Gained points: final, semi, quarter, own contender
  const scores = new Scores(players, [0, 0, 0, 0]);

  const parsedBrackets = brackets.reduce((acc: Record<string, BracketTier[]>, bracket) => {
    if (acc[bracket.id] === undefined) {
      acc[bracket.id] = [];
    }
    acc[bracket.id].push(bracket.tier);
    return acc;
  }, {});

  getListOfPlayers(players).forEach((player) => {
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

/**
 * Makes final championship brackets from qualified contenders
 * @param brackets - The array of bracket objects
 */
export const makeFinalBrackets = (brackets: Bracket[]) => {
  // Make brackets
  const shuffledContenders = shuffle(brackets);

  const emptyBracketArray: Bracket[] = Array(15)
    .fill(0)
    .map((v, index) => ({
      id: 'TBD',
      name: { pt: '?', en: 'TBD' },
      description: { pt: '?', en: 'TBD' },
      playerId: '',
      position: v + index,
      tier: getBracketTier(v + index),
      votes: [],
    }));

  shuffledContenders.forEach((contender, index) => {
    emptyBracketArray[index].id = contender.id;
    emptyBracketArray[index].name = contender.name;
    emptyBracketArray[index].description = contender.description ?? { pt: '', en: '' };
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
export const getPastBattle = (brackets: Bracket[], challenge: TextCardData) => {
  const winsByContender: Dictionary<number> = {};

  brackets.forEach((bracket) => {
    const currentWins = winsByContender[bracket.id] || 0;
    winsByContender[bracket.id] = currentWins + 1;
  });

  const sortedWins: [UID, number][] = Object.entries(winsByContender).sort(
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
        increaseAchievement(store.achievements, bracket.playerId, 'quarterContender', bracket.votes.length);
      }

      // Achievement: Semi Contender votes
      if (bracket.tier === 'semi') {
        increaseAchievement(store.achievements, bracket.playerId, 'semiContender', bracket.votes.length);
      }

      // Achievement: Final Contender votes
      if (bracket.tier === 'final') {
        increaseAchievement(store.achievements, bracket.playerId, 'finalContender', bracket.votes.length);
      }

      // Achievement: Contender votes
      increaseAchievement(store.achievements, bracket.playerId, 'contender', bracket.votes.length);
    }

    // Achievement: Solitaire votes
    if (bracket.votes.length === 1) {
      increaseAchievement(store.achievements, bracket.votes[0], 'solitaireVote', 1);
    } else {
      // Achievement: group votes
      bracket.votes.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'groupVotes', 1);
      });
    }

    // Bets
    if (bracket.win) {
      bracket.votes.forEach((playerId) => {
        increaseAchievement(store.achievements, playerId, 'bets', 1);

        if (bracket.tier === 'quarter') {
          increaseAchievement(store.achievements, playerId, 'quarterBets', 1);
        }
        if (bracket.tier === 'semi') {
          increaseAchievement(store.achievements, playerId, 'semiBets', 1);
        }
        if (bracket.tier === 'final') {
          increaseAchievement(store.achievements, playerId, 'finalBets', 1);
        }
      });
    }
  });
};
