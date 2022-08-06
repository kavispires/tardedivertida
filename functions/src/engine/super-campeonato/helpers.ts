import * as utils from '../../utils';
import { CONTENDERS_PER_ROUND, SUPER_CAMPEONATO_PHASES, TOTAL_ROUNDS } from './constants';

import type { Contender, ContendersDeck } from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
 * @param triggerLastRound
 * @returns
 */
export const determineNextPhase = (
  currentPhase: string,
  round: Round,
  isGameOver?: boolean,
  triggerLastRound?: boolean
): string => {
  const { RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE, RESULTS, GAME_OVER } =
    SUPER_CAMPEONATO_PHASES;
  const order = [RULES, SETUP, CHALLENGE_SELECTION, CONTENDER_SELECTION, BETS, BATTLE];

  if (currentPhase === RESULTS) {
    return triggerLastRound || round.current >= round.total ? GAME_OVER : CHALLENGE_SELECTION;
  }

  if (currentPhase === BATTLE) {
    // Do some magic
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return CHALLENGE_SELECTION;
};

export const getTableContenders = (
  contendersDeck: ContendersDeck,
  players: Players,
  language: Language
): Contender[] => {
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
    name: contender.name[language],
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
  if (votesCount.every((vc) => vc === max)) {
    return utils.game.getRandomItem(challenges);
  }

  // Return only the most voted one
  const index = votesCount.findIndex((vc) => vc === max);
  const winnerId = challengesIds[index];

  const winner = challenges.find((card) => card.id === winnerId);

  return winner ? winner : challenges[0];
};
