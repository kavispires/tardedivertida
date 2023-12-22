// Constants
import { CARDS_PER_HARD_ROUND, CARDS_PER_NORMAL_ROUND, DUETOS_PHASES } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { addAlienItems, addSpecial, calculateResults, getAchievements } from './helpers';

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
  /**
   * Build rounds
   * 2 normal with 8 cards each
   * 2 hard with 9 cards each
   * 1 final with 12 cards mixing 3 of each previous type
   */
  const round1: any[] = [];
  const round2: any[] = [];
  const round3: any[] = [];
  const round4: any[] = [];

  const { items, decks } = resourceData;

  // Round 1 is always items
  addAlienItems(items, CARDS_PER_NORMAL_ROUND, round1);

  // Round 2 is special or alien items
  if (decks[0]) {
    addSpecial(resourceData[decks[0]], CARDS_PER_NORMAL_ROUND, round2, decks[0]);
  } else {
    addAlienItems(items, CARDS_PER_NORMAL_ROUND, round2);
  }

  // Round 3 is special if there are 3 special rounds, otherwise use this on round 4
  if (decks.length < 3 || decks.length === 2) {
    addAlienItems(items, CARDS_PER_HARD_ROUND, round3);
  } else {
    addSpecial(resourceData[decks[1]], CARDS_PER_HARD_ROUND, round3, decks[1]);
  }

  // Round 4
  if (decks.length < 2) {
    addAlienItems(items, CARDS_PER_HARD_ROUND, round4);
  } else {
    const index = decks.length - 1;
    addSpecial(resourceData[decks[index]], CARDS_PER_HARD_ROUND, round4, decks[index]);
  }

  // Round 5
  const round5 = [
    ...utils.game.getRandomItems(round1, 3),
    ...utils.game.getRandomItems(round2, 3),
    ...utils.game.getRandomItems(round3, 3),
    ...utils.game.getRandomItems(round4, 3),
  ];

  const achievements = utils.achievements.setup(players, store, {
    alone: 0,
    duos: 0,
    groups: 0,
    leftOut: 0,
  });

  // Save
  return {
    update: {
      store: {
        deck: {
          1: round1,
          2: round2,
          3: round3,
          4: round4,
          5: utils.game.shuffle(round5),
        },
        achievements,
        gallery: [],
      },
      state: {
        phase: DUETOS_PHASES.SETUP,
        players,
      },
    },
  };
};

export const preparePairPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['pairs']);

  const round = utils.helpers.increaseRound(state.round);

  const pool = store.deck[round.current];
  const roundType = round.current === 5 ? 'mixed' : pool[0].type;

  return {
    update: {
      state: {
        phase: DUETOS_PHASES.PAIRING,
        round,
        players,
        pool,
        roundType,
      },
      stateCleanup: ['gallery', 'ranking'],
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const { ranking, gallery, leftOut } = calculateResults(players, state.pool, store);

  return {
    update: {
      store: {
        achievements: store.achievements,
        gallery: [...store.gallery, ...gallery],
      },
      state: {
        phase: DUETOS_PHASES.RESULTS,
        players,
        ranking,
        gallery,
        leftOut,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.DUETOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  // Save data (contenderIds, contendersGlyphs)
  // await saveData(store.contendersGlyphs ?? {});

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: DUETOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
      },
    },
  };
};
