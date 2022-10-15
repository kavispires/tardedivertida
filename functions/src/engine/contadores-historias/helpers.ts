// Constants
import {
  CONTADORES_HISTORIAS_ACHIEVEMENTS,
  CONTADORES_HISTORIAS_PHASES,
  GAME_OVER_SCORE_THRESHOLD,
  OUTCOME,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, NPC } from '../../utils/constants';
// Type
import type {
  ContadoresHistoriasAchievement,
  ContadoresHistoriasOptions,
  FirebaseStoreData,
  Table,
} from './types';
// Utils
import utils from '../../utils';

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
      playerId: NPC,
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
  storytellerId: PlayerId,
  store: FirebaseStoreData
): NewScore[] => {
  // Gained points: [points depending on outcome, votes on card]
  const newScores = utils.helpers.buildNewScoreObject(players, [0, 0]);

  const solutionEntry = table.find((entry) => entry.isSolution);

  Object.values(players).forEach((player) => {
    const playerCard = table.find((entry) => entry.playerId === player.id);
    // Calculate additional points when not storyteller
    if (player.id !== storytellerId) {
      // Other players gets 2 points if everybody or nobody got
      if (outcome === OUTCOME.EVERYBODY_GOT || outcome === OUTCOME.NOBODY_GOT) {
        newScores[player.id].gainedPoints[0] += 2;
        newScores[player.id].newScore += 2;
      }

      // Votes the player card got
      const cardVotes = playerCard?.votes.length ?? 0;
      newScores[player.id].gainedPoints[1] += cardVotes;
      newScores[player.id].newScore += cardVotes;
      // Achievement: playerVotes
      utils.achievements.increase(store, player.id, 'playerVotes', 1);
    }

    // Everybody that got correctly, including storyteller, gets 3 points
    if (outcome === OUTCOME.NORMAL) {
      const normalPoints = solutionEntry?.votes.includes(player.id) ? 3 : 0;
      newScores[player.id].gainedPoints[0] += normalPoints;
      newScores[player.id].newScore += normalPoints;

      // Achievement: easyClues
      if (normalPoints === 3) {
        utils.achievements.increase(store, storytellerId, 'easyClues', 1);
      }
    }

    // Update player as well
    player.score = newScores[player.id].newScore;
  });

  // Achievement: badClues
  if (outcome === OUTCOME.EVERYBODY_GOT || outcome === OUTCOME.NOBODY_GOT) {
    utils.achievements.increase(store, storytellerId, 'badClues', 1);
  }

  // Achievement: tableVotes
  table
    .filter((tableEntry) => tableEntry.playerId === NPC)
    .forEach((tableEntry) =>
      tableEntry.votes.forEach((playerId) => utils.achievements.increase(store, playerId, 'tableVotes', 1))
    );

  return utils.helpers.sortNewScore(newScores);
};

export const scoreRound = (
  players: Players,
  table: Table,
  storyteller: PlayerId,
  store: FirebaseStoreData
) => {
  const { solutionIndex, cardIndexDictionary } = buildCardIndex(table);

  // Add player votes to table
  Object.values(players).forEach((player) => {
    const cardIndex = cardIndexDictionary[player.vote];
    table[cardIndex].votes.push(player.id);
  });

  const outcome = determineOutcome(table, solutionIndex, Object.keys(players).length);

  const ranking = calculateNewScores(table, players, outcome, storyteller, store);

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

/**
 * Get achievements:
 * @param players
 * @param store
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<ContadoresHistoriasAchievement>[] = [];

  // Most Deceiving: Got players to vote for their cards when not the storyteller
  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'playerVotes');
  if (most) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.MOST_DECEIVING,
      playerId: most.playerId,
      value: most.playerVotes,
    });
  }

  // Worst Cards: Didn't get players to vote for their cards when not the storyteller
  if (least) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.WORST_CARDS,
      playerId: least.playerId,
      value: least.playerVotes,
    });
  }

  // Worst clues: nobody got or all got it
  const { most: worstClues } = utils.achievements.getMostAndLeastOf(store, 'badClues');
  if (worstClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.WORST_CLUES,
      playerId: worstClues.playerId,
      value: worstClues.badClues,
    });
  }

  // Easiest clues: most people got it or all got it
  const { most: easyClues, least: hardestClues } = utils.achievements.getMostAndLeastOf(store, 'easyClues');
  if (easyClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.EASIEST_CLUES,
      playerId: easyClues.playerId,
      value: easyClues.easyClues,
    });
  }

  // Hardest clues: least people got it
  if (hardestClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.HARDEST_CLUES,
      playerId: hardestClues.playerId,
      value: hardestClues.easyClues,
    });
  }

  // Table votes: votes for cards that are not from players the most
  const { most: tableVotes } = utils.achievements.getMostAndLeastOf(store, 'tableVotes');
  if (tableVotes) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.TABLE_VOTES,
      playerId: tableVotes.playerId,
      value: tableVotes.tableVotes,
    });
  }

  return achievements;
};
