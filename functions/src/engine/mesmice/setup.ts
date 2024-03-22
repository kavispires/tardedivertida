// Constants
import { GAME_DIFFICULTY, ITEMS_PER_PLAYER, MESMICE_PHASES, OUTCOME, SCORING } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import { Item, ObjectFeatureCard } from '../../types/tdr';
import type { ExtendedObjectFeatureCard, FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { determineOutcome, getAchievements } from './helpers';

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
  const achievements = utils.achievements.setup(players, store, {
    safeVotes: 0,
    groupVotes: 0,
    lonelyVotes: 0,
    targetVotes: 0,
    communityVotes: 0,
  });

  // Build turn order
  const { gameOrder, playerIds: turnOrder } = utils.players.buildGameOrder(players);

  // Save
  return {
    update: {
      store: {
        achievements,
        ...resourceData,
        gameOrder,
      },
      state: {
        phase: MESMICE_PHASES.SETUP,
        round: {
          ...state.round,
          total: gameOrder.length,
        },
        turnOrder,
        players,
      },
    },
  };
};

export const prepareClueWritingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['selectedItemId', 'selectedItem', 'clue', 'items']);

  // Distribute items
  utils.players.dealItemsToPlayers(players, store.items, ITEMS_PER_PLAYER, 'items');
  // Distribute target to each player
  const features = store.features;
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.target = utils.game.getRandomItem<ExtendedObjectFeatureCard>(features).id;
  });

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        gallery: [],
      },
      state: {
        phase: MESMICE_PHASES.CLUE_WRITING,
        features: utils.helpers.buildDictionaryFromList(
          features.map((feature: ObjectFeatureCard) => ({ ...feature, eliminated: false }))
        ),
        players,
        outcome: OUTCOME.NEW,
        groupScore: 0,
      },
    },
  };
};

export const prepareObjectFeatureEliminationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.removePropertiesFromPlayers(players, ['selectedFeatureId']);

  let round = state.round;

  const stateUpdate: PlainObject = {
    activePlayerId: state.activePlayerId,
    item: state.item,
    clue: state.clue,
  };
  const storeUpdate: PlainObject = {};

  if (state.outcome !== OUTCOME.CONTINUE) {
    // Save gallery
    round = utils.helpers.increaseRound(state.round);
    const activePlayerId = utils.players.getActivePlayer(store.gameOrder, round.current);
    const activePlayer = players[activePlayerId];
    stateUpdate.activePlayerId = activePlayerId;
    stateUpdate.item = activePlayer.items.find(
      (item: Partial<Item>) => item.id === activePlayer.selectedItemId
    );
    stateUpdate.clue = activePlayer.clue;
    stateUpdate.target = activePlayer.target;
    const difficulty = store.options.hardMode ? GAME_DIFFICULTY.HARD : GAME_DIFFICULTY.EASY;
    stateUpdate.history = utils.game.makeArray(SCORING[difficulty].length, 0).map((value) => ({
      featureId: null,
      pass: false,
      votes: [],
      score: SCORING[difficulty][value],
    }));

    // Cleanup features
    const features = state.features;
    Object.keys(features).forEach((key) => {
      features[key].eliminated = false;
    });
    stateUpdate.features = features;
    stateUpdate.outcome = OUTCOME.NEW;
    // Gallery update
    storeUpdate.gallery = [
      ...store.gallery,
      {
        playerId: activePlayerId,
        item: stateUpdate.item,
        clue: stateUpdate.clue,
        featureId: stateUpdate.target,
      },
    ];
  }

  utils.players.unReadyPlayers(players, stateUpdate.activePlayerId);

  // Save
  return {
    update: {
      store: {
        ...storeUpdate,
      },
      state: {
        phase: MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION,
        players,
        round,
        ...stateUpdate,
      },
    },
  };
};

export const prepareResultPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  let groupScore: number = state.groupScore ?? 0;

  // Determine most voted feature, awarding achievements
  const rankedVotes = utils.players.getRankedVotes(players, 'selectedFeatureId');

  // Get absolute winner
  const winner = utils.players.getWinningRankedVote(rankedVotes, store.gameOrder, state.activePlayerId);

  // Determine outcome
  const outcome = determineOutcome(winner.value, state.target, state.features);

  // Distribute achievements
  rankedVotes.forEach((entry) => {
    // Safe Elimination votes
    if (entry.value === winner.value) {
      entry.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'safeVotes', 1);
      });
    }
    // Target votes
    if (entry.value === state.target) {
      entry.votes.forEach((playerId) => {
        utils.achievements.increase(store, playerId, 'targetVotes', 1);
      });
    }

    entry.votes.forEach((playerId) => {
      // Group or lonely votes
      utils.achievements.increase(store, playerId, entry.votes.length > 0 ? 'groupVotes' : 'lonelyVotes', 1);
      // Community Vote
      utils.achievements.increase(store, playerId, 'communityVotes', entry.votes.length);
    });
  });

  const isPositiveOutcome = outcome === OUTCOME.WIN || outcome === OUTCOME.CONTINUE;

  const history = state.history ?? [];
  const resultIndex = history.findIndex((result) => result.featureId === null);

  history[resultIndex] = {
    ...history[resultIndex],
    featureId: winner.value,
    pass: isPositiveOutcome,
    votes: winner.votes,
  };

  if (outcome === OUTCOME.WIN || outcome === OUTCOME.LOSE) {
    for (let i = 0; i < history.length; i++) {
      if (history[i].featureId === null || history[i].pass === false) {
        break;
      }
      history[i].votes.forEach((playerId) => {
        players[playerId].score += 1;
      });
      utils.players.getListOfPlayers(players).forEach((player) => {
        player.score += history[i].score;
      });

      groupScore += history[i].score;
    }
  }

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: MESMICE_PHASES.RESULT,
        players,
        features: state.features,
        outcome,
        votes: rankedVotes,
        history,
        groupScore,
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
  // Adjust scores to reduce 1 por every time the target was selected by a player
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.score -= store.achievements[player.id].targetVotes;
  });

  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.ADEDANHX,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastClues, store.options.imageGrid);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: MESMICE_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        gallery: store.gallery,
        features: state.features,
      },
    },
  };
};
