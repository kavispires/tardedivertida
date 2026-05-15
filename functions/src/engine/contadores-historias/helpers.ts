// Constants
import {
  CONTADORES_HISTORIAS_ACHIEVEMENTS,
  CONTADORES_HISTORIAS_PHASES,
  GAME_OVER_SCORE_THRESHOLD,
  OUTCOME,
} from './constants';
import { DOUBLE_ROUNDS_THRESHOLD, NPC } from '../../utils/constants';
import { shuffle } from 'lodash';
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
 * Determines the next phase based on the current phase and game state
 * @param currentPhase - The current phase of the game
 * @param round - The round object containing current round information
 * @param isGameOver - Whether the game is over
 */
export const determineNextPhase = (currentPhase: string, round: Round, isGameOver?: boolean): string => {
  const { SETUP, STORY, CARD_PLAY, VOTING, RESOLUTION, GAME_OVER } = CONTADORES_HISTORIAS_PHASES;
  const order = [SETUP, STORY, CARD_PLAY, VOTING, RESOLUTION, GAME_OVER];

  if (currentPhase === RESOLUTION) {
    return isGameOver || round.forceLastRound || (round.current > 0 && round.current) === round.total
      ? GAME_OVER
      : STORY;
  }

  return utils.game.nextPhaseDelegator(currentPhase, order);
};

/**
 * Builds the table deck by extracting the specified number of cards
 * @param allCards - The array of all available card IDs
 * @param quantity - The number of cards to extract for the table deck
 */
export const buildTableDeck = (allCards: UID[], quantity: number): UID[] => {
  return allCards.splice(0, quantity);
};

/**
 * Gets a slice of table cards from the deck starting at the specified index
 * @param tableDeck - The array of table card IDs
 * @param deckIndex - The starting index in the deck
 * @param quantity - The number of cards to retrieve
 */
export const getTableCards = (tableDeck: UID[], deckIndex: number, quantity: number): UID[] => {
  return Array(quantity)
    .fill(1)
    .map((el, index) => {
      return tableDeck[el + index + deckIndex];
    });
};

/**
 * Builds and shuffles the table with player cards and NPC cards
 * @param players - The collection of players in the game
 * @param tableCards - The array of card IDs to add to the table
 * @param storyteller - The ID of the player who is the storyteller
 */
export const buildTable = (players: Players, tableCards: UID[], storyteller: UID): Table => {
  const table: Table = [];

  utils.players.getListOfPlayers(players).forEach((player) => {
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

  return shuffle(table);
};

/**
 * Builds an index mapping cards to their positions and identifies the solution
 * @param table - The table array containing card entries
 */
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

/**
 * Determines the outcome based on how many players voted for the solution
 * @param table - The table array containing card entries
 * @param solutionIndex - The index of the solution card in the table
 * @param playerCount - The number of players in the game
 */
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

/**
 * Calculates player rankings based on votes and outcome
 * @param table - The table array containing card entries
 * @param players - The collection of players in the game
 * @param outcome - The outcome of the round
 * @param storytellerId - The ID of the player who is the storyteller
 * @param store - The Firebase store data for tracking achievements
 */
export const getRanking = (
  table: Table,
  players: Players,
  outcome: string,
  storytellerId: UID,
  store: FirebaseStoreData,
): NewScore[] => {
  // Gained points: [points depending on outcome, votes on card]
  const scores = new utils.players.Scores(players, [0, 0]);

  const solutionEntry = table.find((entry) => entry.isSolution);

  utils.players.getListOfPlayers(players).forEach((player) => {
    const playerCard = table.find((entry) => entry.playerId === player.id);
    // Calculate additional points when not storyteller
    if (player.id !== storytellerId) {
      // Other players gets 2 points if everybody or nobody got
      if (outcome === OUTCOME.EVERYBODY_GOT || outcome === OUTCOME.NOBODY_GOT) {
        scores.add(player.id, 2, 0);
      }

      // Votes the player card got
      const cardVotes = playerCard?.votes.length ?? 0;
      scores.add(player.id, cardVotes, 1);

      // Achievement: playerVotes
      utils.achievements.increase(store, player.id, 'playerVotes', 1);
    }

    // Everybody that got correctly, including storyteller, gets 3 points
    if (outcome === OUTCOME.NORMAL) {
      const normalPoints = solutionEntry?.votes.includes(player.id) ? 3 : 0;
      scores.add(player.id, normalPoints, 0);

      // Achievement: easyClues
      if (normalPoints === 3) {
        utils.achievements.increase(store, storytellerId, 'easyClues', 1);
      }
    }
  });

  // Achievement: badClues
  if (outcome === OUTCOME.EVERYBODY_GOT || outcome === OUTCOME.NOBODY_GOT) {
    utils.achievements.increase(store, storytellerId, 'badClues', 1);
  }

  // Achievement: tableVotes
  table
    .filter((tableEntry) => tableEntry.playerId === NPC)
    .forEach((tableEntry) => {
      tableEntry.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'tableVotes', 1);
      });
    });

  return scores.rank(players);
};

/**
 * Scores a round by processing votes and calculating rankings
 * @param players - The collection of players in the game
 * @param table - The table array containing card entries
 * @param storyteller - The ID of the player who is the storyteller
 * @param store - The Firebase store data for tracking achievements
 */
export const scoreRound = (players: Players, table: Table, storyteller: UID, store: FirebaseStoreData) => {
  const { solutionIndex, cardIndexDictionary } = buildCardIndex(table);

  // Add player votes to table
  utils.players.getListOfPlayers(players).forEach((player) => {
    const cardIndex = cardIndexDictionary[player.vote];
    table[cardIndex].votes.push(player.id);
  });

  const outcome = determineOutcome(table, solutionIndex, utils.players.getPlayerCount(players));

  const ranking = getRanking(table, players, outcome, storyteller, store);

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
 * @param players - The collection of players in the game
 * @param options - The game configuration options
 * @param round - The round object containing current round information
 */
export const determineGameOver = (
  players: Players,
  options: ContadoresHistoriasOptions,
  round: Round,
): boolean => {
  if (!options.fixedRounds) {
    return utils.players
      .getListOfPlayers(players)
      .some((player) => player.score >= GAME_OVER_SCORE_THRESHOLD);
  }

  const playerCount = utils.players.getPlayerCount(players);
  if (playerCount < DOUBLE_ROUNDS_THRESHOLD) {
    return round.current >= playerCount * 2;
  }

  return round.current >= playerCount;
};

/**
 * Calculates and returns player achievements based on game statistics
 * @param store - The Firebase store data containing achievement counters
 */
export const getAchievements = (store: FirebaseStoreData) => {
  const achievements: Achievement<ContadoresHistoriasAchievement>[] = [];

  // Most Deceiving: Got players to vote for their cards when not the storyteller
  const { most, least } = utils.achievements.getMostAndLeastOf(store, 'playerVotes');
  if (most) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.MOST_DECEIVING,
      playerId: most.playerId,
      value: most.value,
    });
  }

  // Worst Cards: Didn't get players to vote for their cards when not the storyteller
  if (least) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.WORST_CARDS,
      playerId: least.playerId,
      value: least.value,
    });
  }

  // Worst clues: nobody got or all got it
  const { most: worstClues } = utils.achievements.getMostAndLeastOf(store, 'badClues');
  if (worstClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.WORST_CLUES,
      playerId: worstClues.playerId,
      value: worstClues.value,
    });
  }

  // Easiest clues: most people got it or all got it
  const { most: easyClues, least: hardestClues } = utils.achievements.getMostAndLeastOf(store, 'easyClues');
  if (easyClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.EASIEST_CLUES,
      playerId: easyClues.playerId,
      value: easyClues.value,
    });
  }

  // Hardest clues: least people got it
  if (hardestClues) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.HARDEST_CLUES,
      playerId: hardestClues.playerId,
      value: hardestClues.value,
    });
  }

  // Table votes: votes for cards that are not from players the most
  const { most: tableVotes } = utils.achievements.getMostAndLeastOf(store, 'tableVotes');
  if (tableVotes) {
    achievements.push({
      type: CONTADORES_HISTORIAS_ACHIEVEMENTS.TABLE_VOTES,
      playerId: tableVotes.playerId,
      value: tableVotes.value,
    });
  }

  return achievements;
};
