// Constants
import { CONTADORES_HISTORIAS_PHASES, GAME_OVER_SCORE_THRESHOLD, OUTCOME } from './constants';
import { DOUBLE_ROUNDS_THRESHOLD } from '../../utils/constants';
// Type
import type { ContadoresHistoriasOptions, Table } from './types';
// Utils
import * as utils from '../../utils';

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
  const { RULES, SETUP, STORY, CARD_PLAY, VOTING, RESOLUTION, GAME_OVER } = CONTADORES_HISTORIAS_PHASES;
  const order = [RULES, SETUP, STORY, CARD_PLAY, VOTING, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return isGameOver || triggerLastRound || (round.current > 0 && round.current) === round.total
      ? GAME_OVER
      : STORY;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return STORY;
};

export const buildTableDeck = (allCards: ImageCardId[], quantity: number): ImageCardId[] => {
  return allCards.splice(0, quantity);
};

export const getTableCards = (
  tableDeck: ImageCardId[],
  deckIndex: number,
  quantity: number
): ImageCardId[] => {
  return Array(quantity)
    .fill(1)
    .map((el, index) => {
      return tableDeck[el + index + deckIndex];
    });
};

export const buildTable = (players: Players, tableCards: ImageCardId[], storyteller: PlayerId): Table => {
  const table: Table = [];

  Object.values(players).forEach((player) => {
    table.push({
      cardId: player.cardId,
      playerId: player.id,
      votes: [],
      isSolution: player.id === storyteller,
    });
  });

  tableCards.forEach((cardId) => {
    table.push({
      cardId: cardId,
      playerId: 'NPC',
      votes: [],
      isSolution: false,
    });
  });

  return utils.game.shuffle(table);
};

export const buildCardIndex = (table: Table) => {
  let solutionIndex = -1;

  // Dictionary to easily find the card entry
  const cardIndexDictionary = table.reduce((acc, entry, index) => {
    acc[entry.cardId] = index;
    if (entry.isSolution) {
      solutionIndex = index;
    }
    return acc;
  }, {});

  return {
    solutionIndex,
    cardIndexDictionary,
  };
};

export const determineOutcome = (table: Table, solutionIndex: number, playerCount: number): string => {
  if (table[solutionIndex].votes.length === playerCount) {
    return OUTCOME.EVERYBODY_GOT;
  }

  // 1 is for the storyteller themselves
  if (table[solutionIndex].votes.length === 1) {
    return OUTCOME.NOBODY_GOT;
  }
  return OUTCOME.NORMAL;
};

export const calculateNewScores = (
  table: Table,
  players: Players,
  outcome: string,
  storyteller: PlayerId
): PlainObject => {
  // Gained points: [points depending on outcome, votes on card]
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0]);

  const solutionEntry = table.find((entry) => entry.isSolution);

  Object.values(players).forEach((player) => {
    const playerCard = table.find((entry) => entry.playerId === player.id);
    // Calculate additional points when not storyteller
    if (player.id !== storyteller) {
      // Other players gets 2 points if everybody or nobody got
      if (outcome === OUTCOME.EVERYBODY_GOT || outcome === OUTCOME.NOBODY_GOT) {
        newScores[player.id].gainedPoints[0] += 2;
        newScores[player.id].newScore += 2;
      }

      // Votes the player card got
      const cardVotes = playerCard?.votes.length ?? 0;
      newScores[player.id].gainedPoints[1] += cardVotes;
      newScores[player.id].newScore += cardVotes;
    }

    // Everybody that got correctly, including storyteller, gets 3 points
    if (outcome === OUTCOME.NORMAL) {
      const normalPoints = solutionEntry?.votes.includes(player.id) ? 3 : 0;
      newScores[player.id].gainedPoints[0] += normalPoints;
      newScores[player.id].newScore += normalPoints;
    }

    // Update player as well
    player.score = newScores[player.id].newScore;
  });

  return utils.helpers.sortNewScore(newScores);
};

export const scoreRound = (players: Players, table: Table, storyteller: PlayerId) => {
  const { solutionIndex, cardIndexDictionary } = buildCardIndex(table);

  // Add player votes to table
  Object.values(players).forEach((player) => {
    const cardIndex = cardIndexDictionary[player.vote];
    table[cardIndex].votes.push(player.id);
  });

  const outcome = determineOutcome(table, solutionIndex, Object.keys(players).length);

  const ranking = calculateNewScores(table, players, outcome, storyteller);

  return {
    table,
    outcome,
    ranking,
  };
};

/**
 * Determine if a game should be over
 * If "for points", if a player has passed 30 points
 * If "normal", if a player has been the storyteller twice (1-5p) or once (6p+)
 * @param players
 * @returns
 */
export const determineGameOver = (
  players: Players,
  options: ContadoresHistoriasOptions,
  round: Round
): boolean => {
  if (!options.fixedRounds) {
    return Object.values(players).some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
  }

  const playerCount = Object.keys(players).length;
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current >= playerCount;
};
