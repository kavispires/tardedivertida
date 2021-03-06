// Constants
import { NA_RUA_DO_MEDO_PHASES, OUTCOME_STATUS } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, Outcome } from './types';
import type { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import {
  buildDecks,
  buildStreetDeck,
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
  state: FirebaseStateData,
  players: Players
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

  utils.players.distributeNumberIds(players, 0, 14, 'costumeId');

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
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.SETUP,
        round: { current: 0, total: store.options?.shortGame ? 3 : 5 },
        // RESET
        street: utils.firebase.deleteValue(),
        currentCard: utils.firebase.deleteValue(),
        candySidewalk: utils.firebase.deleteValue(),
        totalCandyInSidewalk: utils.firebase.deleteValue(),
        isEverybodyHome: utils.firebase.deleteValue(),
        isDoubleHorror: utils.firebase.deleteValue(),
        cashedInCandy: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareTrickOrTreatPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome
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
          street: [],
          currentCard,
          candySidewalk: [candyStatus],
          totalCandyInSidewalk,
          candyPerPlayer: candyStatus.perPlayer,
          candyInHand: candyStatus.perPlayer,
          continuingPlayerIds: Object.keys(players).sort(),
          isEverybodyHome: utils.firebase.deleteValue(),
          isDoubleHorror: utils.firebase.deleteValue(),
          cashedInCandy: utils.firebase.deleteValue(),
        },
        players,
      },
    };
  }

  const atHomePlayerIds = sendPlayersHome(players);
  utils.players.unReadyPlayers(players, undefined, atHomePlayerIds);

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
        currentCard,
        candySidewalk: newCandySidewalk,
        totalCandyInSidewalk,
        candyPerPlayer: candyStatus.perPlayer,
        candyInHand: (state.candyInHand ?? 0) + candyStatus.perPlayer,
        cashedInCandy: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const {
    street,
    candySidewalk,
    claimedJackpotIds,
    goingHomePlayerIds,
    continuingPlayerIds,
    alreadyAtHomePlayerIds,
    cashedInCandy,
  } = parseDecisions(
    players,
    state.candySidewalk,
    [...state.street, state.currentCard],
    store.claimedJackpotIds
  );

  // Count candy
  const totalCandyInSidewalk = getTotalCandyInSidewalk(candySidewalk);

  // Save
  return {
    update: {
      store: {
        claimedJackpotIds,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.RESULT,
        street,
        candySidewalk,
        totalCandyInSidewalk,
        currentCard: utils.firebase.deleteValue(),
        goingHomePlayerIds: goingHomePlayerIds.sort(),
        continuingPlayerIds: continuingPlayerIds.sort(),
        alreadyAtHomePlayerIds: alreadyAtHomePlayerIds.sort(),
        cashedInCandy,
      },
      players,
    },
  };
};

export const prepareStreetEndPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  outcome: Outcome
): Promise<SaveGamePayload> => {
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

  // Count lost candy
  const totalCandyInSidewalk = getTotalCandyInSidewalk(state.candySidewalk);

  // Save
  return {
    update: {
      store: {
        usedHorrorIds,
        horrorCount: store.horrorCount,
      },
      state: {
        phase: NA_RUA_DO_MEDO_PHASES.STREET_END,
        isEverybodyHome: false,
        isDoubleHorror: true,
        currentCard,
        totalCandyInSidewalk,
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
  tallyCandyAsScore(players);
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
        phase: NA_RUA_DO_MEDO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
