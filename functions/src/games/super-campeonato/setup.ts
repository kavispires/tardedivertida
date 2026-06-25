import { sampleSize } from 'lodash';
// Types
import type { Bracket, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  CHALLENGES_PER_GAME,
  CHALLENGES_PER_ROUND,
  CONTENDERS_PER_PLAYER,
  SUPER_CAMPEONATO_PHASES,
  TOTAL_ROUNDS,
} from './constants';
// Services
import * as firestoreValueUtils from '../../services/firestore-core';
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils_LEGACY';
// Internal
import { setupAchievements, calculateAchievements } from './achievements';
import { saveData } from './data';
import {
  buildRanking,
  getChampionshipTier,
  getMostVotedChallenge,
  getPastBattle,
  getTableContenders,
  isFinalRound,
  makeBrackets,
  makeFinalBrackets,
  updateAchievements,
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
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const playerCount = utils.players.getPlayerCount(players);
  const options = { ...store.options };
  if (playerCount > 8) {
    options.autoContenders = true;
  }

  // Get 10 challenges
  const deck = sampleSize(resourceData.challenges, CHALLENGES_PER_GAME);

  // Shuffle contenders
  const contendersDeck = resourceData.contenders;

  if (options.autoContenders) {
    utils.players.addPropertiesToPlayers(players, { contenders: [], usedContenders: [] });
  } else {
    // Give contenders to each player
    utils.players.dealItemsToPlayers(players, contendersDeck, CONTENDERS_PER_PLAYER, 'contenders');
    utils.players.addPropertiesToPlayers(players, { usedContenders: [] });
  }

  // Get extra contenders to the table in cases there are less than 8 players
  const tableContenders = getTableContenders(contendersDeck, players);

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        deck,
        deckIndex: 0,
        tableContenders,
        finalBrackets: [],
        pastBattles: [],
        options,
        achievements,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
        },
      },
    },
  };
};

/**
 * [Challenge Selection Phase] - Players vote on challenge for the round
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareChallengeSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Get the two challenges
  const challenges = [store.deck[store.deckIndex], store.deck[store.deckIndex + 1]];

  const round = utils.game.increaseRound(state.round);

  // If round 5, build brackets with store.finalBrackets
  let brackets: unknown = firestoreValueUtils.deleteValue();

  if (isFinalRound(round)) {
    brackets = makeFinalBrackets(store.finalBrackets) as Bracket[];
    // Also make all previous selected contenders for each user as their current round contenders if they are in the brackets

    utils.players.getListOfPlayers(players).forEach((player) => {
      player.contendersIds = (brackets as Bracket[])
        .filter((bracket) => bracket.playerId === player.id)
        .map((b) => b.id);
    });
  } else if (store.options?.autoContenders) {
    brackets = makeBrackets(players, store.tableContenders, state.round.current);
  }

  const playerCount = utils.players.getPlayerCount(players);

  const contendersPerPlayerNeeded = playerCount > 4 ? 1 : 2;

  // Save
  return {
    update: {
      store: {
        deckIndex: store.deckIndex + CHALLENGES_PER_ROUND,
      },
      state: {
        players,
        phase: SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION,
        round,
        challenges,
        brackets,
        contendersPerPlayerNeeded,
      },
      stateCleanup: ['challenge', 'ranking'],
    },
  };
};

/**
 * [Contender Selection Phase] - Players select contenders for the brackets
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareContenderSelectionPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const challenge = getMostVotedChallenge(players, state.challenges);

  // Save
  return {
    update: {
      state: {
        phase: SUPER_CAMPEONATO_PHASES.CONTENDER_SELECTION,
        players,
        challenge,
      },
      stateCleanup: ['challenges'],
    },
  };
};

/**
 * [Bets Phase] - Players place bets on the championship brackets
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareBetsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  const isAutoContenderGame = store.options?.autoContenders ?? false;

  const brackets =
    isFinalRound(state.round) || isAutoContenderGame
      ? state.brackets
      : makeBrackets(players, store.tableContenders, state.round.current);

  const challenge =
    isFinalRound(state.round) || isAutoContenderGame
      ? getMostVotedChallenge(players, state.challenges)
      : state.challenge;

  utils.players.removePropertiesFromPlayers(players, ['votes', 'challengeId']);

  // Save
  return {
    update: {
      state: {
        phase: SUPER_CAMPEONATO_PHASES.BETS,
        players,
        brackets,
        challenge,
      },
      stateCleanup: ['challenges'],
    },
  };
};

/**
 * [Battle Phase] - Display battles and gather votes
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareBattlePhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
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
        players,
        tier,
        brackets,
      },
    },
  };
};

/**
 * [Results Phase] - Calculate battle results and update scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather votes
  const brackets = updateBracketsWithVotes(players, state.brackets);

  // Score
  const ranking = buildRanking(players, state.brackets);

  // Final indexes should be the second and third to last (the last one is the final winner)
  const [finalistIndex1, finalistIndex2] = [brackets.length - 2, brackets.length - 3];

  // Add the final 2 to the store final brackets
  const finalBrackets = [
    ...store.finalBrackets,
    {
      id: brackets[finalistIndex1].id,
      name: brackets[finalistIndex1].name,
      description: brackets[finalistIndex1].description,
      playerId: brackets[finalistIndex1].playerId,
      position: store.finalBrackets.length,
      tier: 'quarter',
    },
    {
      id: brackets[finalistIndex2].id,
      name: brackets[finalistIndex2].name,
      description: brackets[finalistIndex2].description,
      playerId: brackets[finalistIndex2].playerId,
      position: store.finalBrackets.length + 1,
      tier: 'quarter',
    },
  ];

  // Parse brackets
  const pastBattle = getPastBattle(brackets, state.challenge);
  const pastBattles = [...store.pastBattles, pastBattle];

  // Calculate achievements
  updateAchievements(store, brackets);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        finalBrackets,
        pastBattles,
        achievements: store.achievements,
      },
      state: {
        phase: SUPER_CAMPEONATO_PHASES.RESULTS,
        players,
        brackets,
        ranking,
      },
      stateCleanup: ['tier'],
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
 * @param gameId - The game session ID
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await markGameAsComplete(gameId);

  const pastBattles = store.pastBattles;

  const achievements = calculateAchievements(store.achievements);

  // Save used challenges and contenders
  await saveData(pastBattles);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.SUPER_CAMPEONATO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        players,
        phase: SUPER_CAMPEONATO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        finalWinner: state.brackets[14],
        pastBattles,
        achievements,
      },
    },
  };
};
