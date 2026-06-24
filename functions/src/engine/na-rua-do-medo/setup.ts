// Types
import type { FirebaseStateData, FirebaseStoreData, Outcome } from './types';
// Constants
import { AVATAR_SPRITE_LIBRARIES, GAME_NAMES } from '../../utils/constants';
import { NA_RUA_DO_MEDO_PHASES, OUTCOME_STATUS } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
// Utils
import utils from '../../utils';
// Internal
import { calculateAchievements, increaseAchievement, setupAchievements } from './achievements';
import {
  buildDecks,
  buildStreetDeck,
  countMonsters,
  dealNewCard,
  getTotalCandyInSidewalk,
  parseDecisions,
  resetHorrorCount,
  sendPlayersHome,
  tallyCandyAsScore,
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
): Promise<SaveGamePayload> => {
  const { horrorDeck, jackpotDeck, candyDeck, horrorCount } = buildDecks(store.options?.shortGame ?? false);

  utils.players.addPropertiesToPlayers(players, {
    totalCandy: 0, // total score
    jackpots: [],
    hand: 0, // current possible score
    currentJackpots: null,
    decision: 'HOME',
    isTrickOrTreating: true,
  });

  utils.players.distributeNumberIds(players, 0, AVATAR_SPRITE_LIBRARIES.COSTUMES - 1, 'costumeId');

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        horrorDeck,
        jackpotDeck,
        candyDeck,
        horrorCount,
        usedHorrorIds: [],
        claimedJackpotIds: [],
        achievements,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.SETUP,
        round: { current: 0, total: store.options?.shortGame ? 3 : 5 },
        players,
      },
      stateCleanup: [
        'street',
        'currentCard',
        'candySidewalk',
        'totalCandyInSidewalk',
        'isEverybodyHome',
        'isDoubleHorror',
        'cashedInCandy',
      ],
    },
  };
};

/**
 * [Trick or Treat Phase] - Players decide to continue or go home
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param outcome - The outcome determining how to proceed
 */
export const prepareTrickOrTreatPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome,
): Promise<SaveGamePayload> => {
  // If new round
  if (outcome.status === OUTCOME_STATUS.NEW_STREET) {
    // Reset players
    utils.players.addPropertiesToPlayers(players, {
      hand: 0,
      currentJackpots: null,
      isTrickOrTreating: true,
    });
    utils.players.unReadyPlayers(players);

    const round = utils.game.increaseRound(state.round);
    const streetDeck = buildStreetDeck(store, round.current);
    store.streetDeck = streetDeck;
    resetHorrorCount(store.horrorCount);

    const { currentCard, candyStatus } = dealNewCard(store, players);

    // Count candy
    const totalCandyInSidewalk = getTotalCandyInSidewalk([candyStatus]);

    // Save
    return {
      update: {
        store: {
          streetDeck,
          horrorCount: store.horrorCount,
        },
        state: {
          phase: NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT,
          round,
          players,
          street: [],
          currentCard,
          candySidewalk: [candyStatus],
          totalCandyInSidewalk,
          candyPerPlayer: candyStatus.perPlayer,
          candyInHand: candyStatus.perPlayer,
          continuingPlayerIds: utils.players.getListOfPlayersIds(players),
          alreadyAtHomePlayerIds: [],
        },
        stateCleanup: ['isEverybodyHome', 'isDoubleHorror', 'cashedInCandy'],
      },
    };
  }

  const atHomePlayerIds = sendPlayersHome(players);
  utils.players.unReadyPlayers(players, atHomePlayerIds);

  const { currentCard, candyStatus } = dealNewCard(store, players);

  const newCandySidewalk = [...state.candySidewalk, candyStatus];
  // Count candy
  const totalCandyInSidewalk = getTotalCandyInSidewalk(newCandySidewalk);

  // Save
  return {
    update: {
      store: {
        streetDeck: store.streetDeck,
        horrorCount: store.horrorCount,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT,
        players,
        currentCard,
        candySidewalk: newCandySidewalk,
        totalCandyInSidewalk,
        candyPerPlayer: candyStatus.perPlayer,
        candyInHand: (state.candyInHand ?? 0) + candyStatus.perPlayer,
        alreadyAtHomePlayerIds: atHomePlayerIds.sort(),
      },
      stateCleanup: ['cashedInCandy'],
    },
  };
};

/**
 * [Result Phase] - Display results of the decision round
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const {
    street,
    candySidewalk,
    claimedJackpotIds,
    goingHomePlayerIds,
    continuingPlayerIds,
    alreadyAtHomePlayerIds,
    cashedInCandy,
  } = parseDecisions(players, state.candySidewalk, [...state.street, state.currentCard], store);

  // Count candy
  const totalCandyInSidewalk = getTotalCandyInSidewalk(candySidewalk);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        claimedJackpotIds,
        achievements: store.achievements,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.RESULT,
        players,
        street,
        candySidewalk,
        totalCandyInSidewalk,
        goingHomePlayerIds: utils.players.sortPlayerIdsByName(goingHomePlayerIds, players),
        continuingPlayerIds: utils.players.sortPlayerIdsByName(continuingPlayerIds, players),
        alreadyAtHomePlayerIds: utils.players.sortPlayerIdsByName(alreadyAtHomePlayerIds, players),
        cashedInCandy,
      },
      stateCleanup: ['currentCard'],
    },
  };
};

/**
 * [Street End Phase] - Handle end of street outcomes
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param outcome - The outcome determining the ending scenario
 */
export const prepareStreetEndPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome,
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);

  // Scenario 1: Everybody went home
  if (outcome.isEverybodyHome) {
    // Save
    return {
      update: {
        state: {
          phase: NA_RUA_DO_MEDO_PHASES.STREET_END,
          isEverybodyHome: true,
        },
      },
    };
  }

  // Scenario 2: Double horror
  const { currentCard } = dealNewCard(store, players);

  const usedHorrorIds = [...store.usedHorrorIds, currentCard.id];

  // Count lost candy in sidewalk
  const totalCandyInSidewalk = getTotalCandyInSidewalk(state.candySidewalk);

  // Achievements
  const monsterCount = countMonsters([...state.street, currentCard]);
  state.continuingPlayerIds.forEach((playerId: UID) => {
    // Achievement: most houses
    increaseAchievement(store.achievements, playerId, 'houses', 1);
    // Achievement: facing monsters
    increaseAchievement(store.achievements, playerId, 'facingMonsters', monsterCount);
    // Achievement lost candy
    increaseAchievement(store.achievements, playerId, 'lostCandy', totalCandyInSidewalk + state.candyInHand);
  });

  // Save
  return {
    update: {
      store: {
        usedHorrorIds,
        horrorCount: store.horrorCount,
        achievements: store.achievements,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.STREET_END,
        players,
        isEverybodyHome: false,
        isDoubleHorror: true,
        currentCard,
        totalCandyInSidewalk,
      },
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
  tallyCandyAsScore(players);
  const winners = utils.players.determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.NA_RUA_DO_MEDO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, ['costumeId', 'hand', 'jackpots', 'totalCandy']);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        winners,
        achievements,
      },
    },
  };
};
