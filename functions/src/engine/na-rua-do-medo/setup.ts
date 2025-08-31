// Constants
import { NA_RUA_DO_MEDO_PHASES, OUTCOME_STATUS } from './constants';
import { AVATAR_SPRITE_LIBRARIES, GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Outcome } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildDecks,
  buildStreetDeck,
  countMonsters,
  dealNewCard,
  getAchievements,
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

  const achievements = utils.achievements.setup(players, {
    facingMonsters: 0,
    lostCandy: 0,
    houses: 0,
    jackpots: 0,
    sidewalk: 0,
  });

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

    const round = utils.helpers.increaseRound(state.round);
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
  state.continuingPlayerIds.forEach((playerId: PlayerId) => {
    // Achievement: most houses
    utils.achievements.increase(store, playerId, 'houses', 1);
    // Achievement: facing monsters
    utils.achievements.increase(store, playerId, 'facingMonsters', monsterCount);
    // Achievement lost candy
    utils.achievements.increase(store, playerId, 'lostCandy', totalCandyInSidewalk + state.candyInHand);
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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  tallyCandyAsScore(players);
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

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
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
