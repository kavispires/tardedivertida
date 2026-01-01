// Constants
import {
  CARDS_PER_PLAYER,
  CONSECUTIVE_REJECTION_PENALTY,
  CREATOR_SCORE_BONUS,
  CREATOR_SCORE_POINTS,
  EMPTY_HAND_BONUS,
  OTHERS_SCORE_POINTS,
  QUAL_QUESITO_PHASES,
  TOTAL_ROUNDS,
} from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, TableEntry, ResourceData, GalleryEntry } from './types';
// Utils
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import { keyBy, orderBy, shuffle } from 'lodash';
import { buildCardsDictFromPlayersHands, getAchievements } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, {
    creatorExtra: 0,
    skipTurn: 0,
    joiners: 0,
    participation: 0,
    rejections: 0,
    acceptance: 0,
    accepting: 0,
    declining: 0,
  });

  const deckDict = keyBy(additionalData.allItems, 'id');

  const deckKeys = utils.playerHand.dealDeck(players, Object.keys(deckDict), CARDS_PER_PLAYER, 'hand');

  const { gameOrder: turnOrder } = utils.players.buildGameOrder(players);

  // Save
  return {
    update: {
      store: {
        deckDict,
        deckKeys,
        achievements,
        gallery: [],
      },
      state: {
        phase: QUAL_QUESITO_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: [0, 0, 12, 15, 16, 15, 18, 14, 16][turnOrder.length] ?? TOTAL_ROUNDS,
        },
        turnOrder,
      },
    },
  };
};

export const prepareCategoryCreationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Cleanup
  utils.players.removePropertiesFromPlayers(players, ['playedCardsIds', 'evaluations']);

  const round = utils.helpers.increaseRound(state.round);
  const creatorId = utils.players.getActivePlayer(state.turnOrder, round.current);

  // Unready creator only
  utils.players.readyPlayers(players, creatorId);

  const cardsDict = buildCardsDictFromPlayersHands(players, store.deckDict);

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.CATEGORY_CREATION,
        players,
        round,
        creatorId,
        cardsDict,
      },
      stateCleanup: ['category', 'outcome'],
    },
  };
};

export const prepareCardPlayPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.CARD_PLAY,
        players,
      },
      stateCleanup: ['ranking', 'table', 'creatorBonus'],
    },
  };
};

export const prepareSkipAnnouncementPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const creatorId: PlayerId = state.creatorId;

  // If creator have skipped their turn, they gain a new card
  players[creatorId].hand.push(...utils.game.dealItems(store.deckKeys, 1));

  const cardsDict = buildCardsDictFromPlayersHands(players, store.deckDict);

  utils.achievements.increase(store, creatorId, 'skipTurn', 1);

  // Save
  return {
    update: {
      store,
      state: {
        phase: QUAL_QUESITO_PHASES.SKIP_ANNOUNCEMENT,
        players,
        cardsDict,
      },
      stateCleanup: ['skipTurn'],
    },
  };
};

export const prepareVerificationPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Gather all played cards
  const table: TableEntry[] = shuffle(
    utils.players.getListOfPlayers(players).flatMap((player) => {
      return (player.playedCardsIds || []).map((cardId: string) => ({
        playerId: player.id,
        cardId,
        accepted: false,
      }));
    }),
  );

  // Save
  return {
    update: {
      state: {
        phase: QUAL_QUESITO_PHASES.VERIFICATION,
        players,
        table,
      },
    },
  };
};

export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const creatorId: string = state.creatorId;

  // Gather evaluations of cards
  const evaluations = utils.players.getListOfPlayers(players).reduce((acc: Dictionary<number>, player) => {
    if (player.evaluations) {
      Object.entries(player.evaluations).forEach(([cardId, isAccepted]) => {
        // Achievement: Most accepting / declining
        utils.achievements.increase(store, player.id, isAccepted ? 'accepting' : 'declining', 1);

        acc[cardId] = (acc[cardId] || 0) + (isAccepted ? 1 : 0);
      });
    }
    return acc;
  }, {});

  let creatorBonus = false;

  // Scoring: accepted card, creator bonus, sequential rejection
  const scores = new utils.players.Scores(players, [0, 0, 0]);
  utils.players.getListOfPlayers(players).forEach((player) => {
    const isCreator = player.id === creatorId;
    let busted = false;

    // Creator must have both cards accepted to not bust
    if (isCreator) {
      const firstCardId = player.playedCardsIds?.[0];
      const secondCardId = player.playedCardsIds?.[1];
      const firstAccepted = (evaluations[firstCardId] || 0) > 1;
      const secondAccepted = (evaluations[secondCardId] || 0) > 1;
      if (!firstAccepted || !secondAccepted) {
        busted = true;
      }
    }

    if (player?.playedCardsIds?.length > 0) {
      (player.playedCardsIds as string[]).forEach((cardId, index) => {
        const acceptedVotes = evaluations[cardId] || 0;
        const isAccepted = acceptedVotes > 1;

        // Achievement: Creator extra cards
        if (isCreator && index > 2) {
          utils.achievements.increase(store, player.id, 'creatorExtra', 1);
        }

        // If it hasn't busted and it is accepted, grant points
        if (!busted && isAccepted) {
          scores.add(player.id, isCreator ? CREATOR_SCORE_POINTS : OTHERS_SCORE_POINTS, 0);
          // If the creator matches both first cards, they gain a bonus point
          if (isCreator && index === 1) {
            scores.add(player.id, CREATOR_SCORE_BONUS, 1);
            creatorBonus = true;
          }

          if (!isCreator) {
            // Achievement: Participation when not the creator
            utils.achievements.increase(store, player.id, 'participation', 1);
            utils.achievements.increase(store, creatorId, 'joiners', 1);
          }

          // Reset consecutive rejection flag
          delete player.wasRejectedOnPreviousRound;
          // Remove card from hand
          player.hand = player.hand?.filter((cardInHand: string) => cardInHand !== cardId);
          // Achievement: Acceptance
          utils.achievements.increase(store, player.id, 'acceptance', 1);
        } else {
          busted = true;
          // Achievement: Rejections
          utils.achievements.increase(store, player.id, 'rejections', 1);

          // If rejected, count for repeated rejections
          if (index === 0 && player.wasRejectedOnPreviousRound) {
            scores.add(player.id, CONSECUTIVE_REJECTION_PENALTY, 2);
          }
        }
      });
    } else {
      delete player.wasRejectedOnPreviousRound;
    }

    if (busted) {
      player.wasRejectedOnPreviousRound = true;
    }
  });

  // Score points
  // Remove accepted played cards
  // If the creator cards have been rejected

  // Or, from accepted and rejected cards if creator have all their cards rejected, they gain a new card
  // Discard all cards played that were accepted.
  const table: TableEntry[] = orderBy(
    state.table.map((entry: TableEntry) => {
      const isAccepted = (evaluations[entry.cardId] || 0) > 1;
      return {
        ...entry,
        accepted: isAccepted,
      };
    }),
    [
      (o) => (o.playerId === creatorId ? 0 : 1),
      (o) => players[o.playerId].name,
      (o) => [players[o.playerId].playedCardsIds.indexOf(o.cardId)],
    ],
    ['asc', 'asc', 'asc'],
  );

  const ranking = scores.rank(players);

  const gallery: GalleryEntry[] = store.gallery || [];
  gallery.push({
    creatorId,
    category: state.category || '',
    items: table.filter((entry) => entry.accepted),
  });
  store.gallery = gallery;

  // Save
  return {
    update: {
      store,
      state: {
        phase: QUAL_QUESITO_PHASES.RESULTS,
        players,
        table,
        ranking,
        creatorBonus,
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
  // The players who got rid of all their cards get a 3 point bonus
  utils.players.getListOfPlayers(players).forEach((player) => {
    if ((player.hand?.length || 0) === 0) {
      player.scores += EMPTY_HAND_BONUS;
    }
  });

  // Unready players
  utils.players.unReadyPlayers(players);

  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.QUAL_QUESITO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const gallery = store.gallery;

  // Save
  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: QUAL_QUESITO_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        achievements,
        gallery,
        cardsDict: state.cardsDict,
      },
    },
  };
};
