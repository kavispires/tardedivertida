// Constants
import {
  CHALLENGES_PER_GAME,
  CHALLENGES_PER_ROUND,
  CONTENDERS_PER_PLAYER,
  SUPER_CAMPEONATO_PHASES,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import * as utils from '../../utils';
import {
  buildRanking,
  getChampionshipTier,
  getMostVotedChallenge,
  getTableContenders,
  isFinalRound,
  makeBrackets,
  makeFinalBrackets,
  updateBracketsWithVotes,
} from './helpers';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData
): Promise<SaveGamePayload> => {
  // Get 10 challenges
  const deck = utils.game.getRandomItems(resourceData.challenges, CHALLENGES_PER_GAME);

  // Give contenders to each player
  const contendersDeck = utils.game.shuffle(resourceData.contenders);
  utils.players.dealItemsToPlayers(players, contendersDeck, CONTENDERS_PER_PLAYER, 'contenders');

  // Get extra contenders to the table in cases there are less than 8 players
  const tableContenders = getTableContenders(contendersDeck, players);

  // Save
  return {
    update: {
      players,
      store: {
        deck,
        deckIndex: 0,
        tableContenders,
        finalBrackets: [],
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

export const prepareChallengeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Get the two challenges
  const challenges = [store.deck[store.deckIndex], store.deck[store.deckIndex + 1]];

  const round = utils.helpers.increaseRound(state.round);

  // If round 5, build brackets with store.finalBrackets
  const brackets = isFinalRound(round)
    ? makeFinalBrackets(store.finalBrackets)
    : utils.firebase.deleteValue();

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + CHALLENGES_PER_ROUND,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION,
        round,
        challenges,
        brackets,
      },
      players,
    },
  };
};

export const prepareContenderSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const challenge = getMostVotedChallenge(players, state.challenges);

  utils.players.removePropertiesFromPlayers(players, ['challengeId']);

  // Save
  return {
    update: {
      state: {
        phase: SUPER_CAMPEONATO_PHASES.CONTENDER_SELECTION,
        challenges: utils.firebase.deleteValue(),
        challenge,
      },
      players,
    },
  };
};

export const prepareBetsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const brackets = isFinalRound(state.round)
    ? state.brackets
    : makeBrackets(players, store.tableContenders, state.round.current);

  const challenge = isFinalRound(state.challenge)
    ? getMostVotedChallenge(players, state.challenges)
    : state.challenge;

  utils.players.removePropertiesFromPlayers(players, ['votes']);

  // Save
  return {
    update: {
      state: {
        phase: SUPER_CAMPEONATO_PHASES.BETS,
        brackets,
        challenge,
      },
      players,
    },
  };
};

export const prepareBattlePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const tier = getChampionshipTier(state.tier);

  // Gather votes
  const brackets = tier !== 'quarter' ? updateBracketsWithVotes(players, state.brackets) : state.brackets;

  // Save
  return {
    update: {
      state: {
        phase: SUPER_CAMPEONATO_PHASES.BATTLE,
        tier,
        brackets,
      },
      players,
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Gather votes
  const brackets = updateBracketsWithVotes(players, state.brackets);

  // Score
  const ranking = buildRanking(players, state.brackets);

  // Add the final 2 to the store final brackets
  const finalBrackets = [
    ...store.finalBrackets,
    {
      id: brackets[12].id,
      name: brackets[12].name,
      playerId: brackets[12].playerId,
      position: store.finalBrackets.length,
      tier: 'quarter',
    },
    {
      id: brackets[13].id,
      name: brackets[13].name,
      playerId: brackets[13].playerId,
      position: store.finalBrackets.length + 1,
      tier: 'quarter',
    },
  ];

  // Save
  return {
    update: {
      store: {
        finalBrackets,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.RESULTS,
        tier: utils.firebase.deleteValue(),
        brackets,
        ranking,
      },
      players,
    },
  };
};

export const prepareGameOverPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: SUPER_CAMPEONATO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        finalWinner: state.brackets[14],
      },
    },
  };
};