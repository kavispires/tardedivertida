import { orderBy, shuffle, uniq } from 'lodash';
// Types
import type {
  FestaJuninaCard,
  FirebaseStateData,
  FirebaseStoreData,
  OngoingEffect,
  Play,
  LogEntry,
  ResourceData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  CORREIO_DO_AMOR_PHASES,
  DECK_INFO_BY_PLAYER_COUNT,
  KEYWORDS,
  MAX_ROUNDS,
  ONGOING_EFFECT_TYPE,
  OUTCOME,
  PLAYER_STATUS,
  POINTS,
  RESOLUTION_KEYWORD,
} from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  setPlayersReadyState,
  getListOfPlayers,
  getListOfPlayersIds,
  getPlayerCount,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners, Scores } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Internal
import { setupAchievements, calculateAchievements, increaseAchievement } from './achievements';
import { buildRoundDeck, getCardKeyFromId } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 * @param data - The game resources data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = setupAchievements(getListOfPlayersIds(players));

  const { gameOrder } = turnOrderUtils.create(players);

  return {
    update: {
      store: {
        achievements,
        plusRotation: resourceData.plusRotation,
        advancedRotation: resourceData.advancedRotation,
      },
      state: {
        phase: CORREIO_DO_AMOR_PHASES.SETUP,
        round: {
          current: 0,
          total: MAX_ROUNDS,
          forceLastRound: false,
        },
        gameOrder, // Fixed game order for the entire game and used every round
        startingPlayerId: gameOrder.at(-1),
        outcome: OUTCOME.SETUP,
        cardsDict: resourceData.cardsDict,
      },
    },
  };
};

/**
 * Prepare Card play phase where a player draws and plays a card
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;

  // NEW ROUND
  if (state.outcome === OUTCOME.SETUP) {
    const previousDeck = Object.values(cardsDict).reduce((acc: Dictionary<true>, card) => {
      if (card.count > 0) {
        acc[card.id] = true;
      }
      return acc;
    }, {});

    // Increase round
    const round = increaseRound(state.round);

    // Generate deck
    const deck = buildRoundDeck(
      cardsDict,
      round.current,
      getPlayerCount(players),
      store.plusRotation,
      store.advancedRotation,
    );

    const newCardsInDeck = uniq(
      deck
        .filter((newCardId) => !previousDeck[getCardKeyFromId(newCardId)])
        .map((cardId) => getCardKeyFromId(cardId)),
    );

    // Deal cards to players
    getListOfPlayers(players).forEach((player) => {
      player.hand = [deck.pop()];
      player.keywords = [];
      player.status = PLAYER_STATUS.ACTIVE;
    });

    // Determine the starting player for the round, and active player
    const startingPlayerId = turnOrderUtils.getNextPlayerId(state.gameOrder, state.startingPlayerId);
    const activePlayerId = startingPlayerId;
    const turnOrder = turnOrderUtils.reorder([...state.gameOrder], startingPlayerId);

    // Set cards aside depending on player count
    const playerCount = getPlayerCount(players);
    const cardsSetAside: UID[] = [];
    const cardsSetAsideCount = DECK_INFO_BY_PLAYER_COUNT[playerCount].setAsideCards;
    for (let i = 0; i < cardsSetAsideCount; i++) {
      const cardId = deck.pop();
      if (cardId) {
        cardsSetAside.push(cardId);
      }
    }

    // Ready players
    setPlayersReadyState(players, true, { excludeIds: [activePlayerId] });

    // Prepare turn: card to be drawn
    const turnUpdate = {
      outcome: OUTCOME.CONTINUE,
      nextDrawnCardId: deck.pop() ?? null,
      ongoingEffects: [],
    };

    return {
      update: {
        store: {
          previousDeck: deck,
        },
        state: {
          phase: CORREIO_DO_AMOR_PHASES.CARD_PLAY,
          key: String(Date.now()), // Use to force re-render in the client
          players,
          round,
          cardsDict,
          activePlayerId,
          turnOrder,
          cardsSetAside,
          deck,
          discardPile: [],
          log: [],
          newCardsInDeck,
          ...turnUpdate,
        },
        stateCleanup: [
          /* TODO: List properties to clean up from previous phase */
        ],
      },
    };
  }

  // NEXT TURN
  const newTurnOrder = state.turnOrder.filter(
    (playerId: UID) => players[playerId].status !== PLAYER_STATUS.ELIMINATED,
  );

  const activePlayerId = turnOrderUtils.getNextPlayerId(newTurnOrder, state.activePlayerId);

  // Ready players
  setPlayersReadyState(players, true, { excludeIds: [activePlayerId] });

  // Handle achievements
  // TODO: Handle achievements if needed

  const ongoingEffects: OngoingEffect[] = (state.ongoingEffects ?? []).filter((effect: OngoingEffect) => {
    if (effect.type === ONGOING_EFFECT_TYPE.TURN && effect.affectedPlayerId === activePlayerId) {
      players[activePlayerId].status = PLAYER_STATUS.ACTIVE; // Reset status to active for the new turn
      return false; // Remove TURN effects for the active player
    }
    return true;
  });

  // Handle discards
  const logEntry: LogEntry | null = state.log?.[0] ?? null;
  const discardPile: UID[] = state.discardPile ?? [];
  if (logEntry) {
    if (!discardPile.includes(logEntry.cardId)) {
      discardPile.push(logEntry.cardId);
    }
    if (logEntry.discardedCardId && !discardPile.includes(logEntry.discardedCardId)) {
      discardPile.push(logEntry.discardedCardId);
    }
  }

  const deck: UID[] = state.deck ?? [];
  // Prepare turn: card to be drawn
  const turnUpdate = {
    outcome: OUTCOME.CONTINUE,
    nextDrawnCardId: deck.pop() ?? null,
  };

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_PLAY,
        key: String(Date.now()), // Use to force re-render in the client
        players,
        activePlayerId,
        ongoingEffects,
        discardPile,
        turnOrder: newTurnOrder,
        deck,
        ...turnUpdate,
      },
      stateCleanup: ['play'],
    },
  };
};

/**
 * CardEffects phase - TODO: describe phase purpose
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardEffectsPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, true, { excludeIds: [state.activePlayerId] });

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_EFFECTS,
        players,
      },
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
    },
  };
};

/**
 * CardResolution phase - TODO: describe phase purpose
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

  const deck: UID[] = state.deck ?? [];
  const discardPile: UID[] = state.discardPile ?? [];
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;
  let cardsSetAside: UID[] = state.cardsSetAside ?? [];

  const results: LogEntry = {
    ...(state.play as Play),
    targetPlayersIds: [],
    newOngoingEffect: null,
    resolutionKeyword: null,
    effectInput: null,
    discardedCardId: null,
    eliminatedPlayersIds: [],
    eliminatedByPlayerId: null,
  };

  increaseAchievement(store.achievements, results.actorId, 'playedCards', 1);
  const playedCard = cardsDict[results.cardKey];
  if (playedCard && playedCard.rank >= 0 && playedCard.rank <= 11) {
    type CardRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    type PlayedRankAchievement = `playedRank${CardRank}`;

    const achievementKey = `playedRank${playedCard.rank}`;
    increaseAchievement(store.achievements, results.actorId, achievementKey as PlayedRankAchievement, 1);
  }

  const targetPlayerId = results.selections?.targetPlayerId ?? null;
  const targetPlayer = players[targetPlayerId ?? ''] ?? null;

  const ongoingEffects: OngoingEffect[] = state.ongoingEffects ?? [];

  const actorCardInHandId = players[results.actorId]?.hand?.[0] ?? null;
  const actorCardInHand = cardsDict[getCardKeyFromId(actorCardInHandId ?? '')] ?? null;

  let targetPlayerCard: FestaJuninaCard | null = null;
  let targetPlayerCardId: UID | null = null;
  if (targetPlayerId) {
    targetPlayerCardId = targetPlayer.hand[0] ?? null;
    targetPlayerCard = cardsDict[getCardKeyFromId(targetPlayerCardId ?? '')] ?? null;
    results.targetPlayersIds.push(targetPlayerId);
  }

  // TODO: Remove when game is released
  // print.debug('Card Resolution Phase', {
  //   round: state.round?.current,
  //   cardId: results.cardId,
  //   playedCard: actorCardInHand?.name ?? 'Unknown',
  //   actorId: results.actorId,
  //   actorName: players[results.actorId]?.name ?? 'Unknown',
  //   actorCardInHand: players[results.actorId]?.hand?.[0] ?? 'None',
  //   actorStatus: players[results.actorId]?.status ?? 'Unknown',
  //   targetPlayerId,
  //   targetPlayerName: targetPlayer?.name ?? 'None',
  //   targetCardInHand: targetPlayerCardId ?? 'None',
  //   targetStatus: targetPlayer?.status ?? 'Unknown',
  //   effectKeyword: results.cardKeyword,
  //   selectedEffectInput: results.selections?.effectInput ?? null,
  //   effectInput: results.effectInput ?? null,
  //   deckLength: deck.length,
  //   nextCardInDeck: deck.at(-1) ?? 'None',
  //   discardLength: discardPile.length,
  //   cardsSetAsideCount: cardsSetAside.length,
  // });

  // INTERNAL PHASE HELPER FUNCTIONS
  function performCounterAttackCheck(): boolean {
    if (targetPlayerCard?.keyword === KEYWORDS.COUNTER_ATTACK) {
      results.resolutionKeyword = RESOLUTION_KEYWORD.COUNTER_ATTACK;
      results.eliminatedPlayersIds = [results.actorId];
      targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
      players[results.actorId].status = PLAYER_STATUS.ELIMINATED; // Active player is eliminated
      results.discardedCardId = actorCardInHandId;
      results.eliminatedByPlayerId = targetPlayerId;
      return true;
    }

    return false;
  }

  function performCompareAutoWinCheck(): boolean {
    if (targetPlayerCard?.keyword === KEYWORDS.AUTO_WIN_COMPARE) {
      results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_WIN_COMPARE;
      results.eliminatedPlayersIds = [results.actorId];
      results.eliminatedByPlayerId = targetPlayerId;
      results.discardedCardId = actorCardInHandId;
      targetPlayer.status = PLAYER_STATUS.ACTIVE;
      players[results.actorId].status = PLAYER_STATUS.ELIMINATED;
      return true;
    }

    return false;
  }

  function performNoAvailableTargetCheck(): boolean {
    if (results.selections?.effectInput === RESOLUTION_KEYWORD.NO_TARGET_AVAILABLE) {
      results.resolutionKeyword = RESOLUTION_KEYWORD.NO_TARGET_AVAILABLE;
      return true;
    }

    return false;
  }

  function getNonImmunePlayers(): Player[] {
    const immunePlayers = ongoingEffects
      .filter((effect) => effect.effectKeyword === RESOLUTION_KEYWORD.IMMUNITY)
      .map((effect) => effect.affectedPlayerId)
      .reduce((acc: Dictionary<true>, playerId: UID) => {
        acc[playerId] = true;
        return acc;
      }, {});

    return state.turnOrder
      .filter(
        (playerId: UID) => !immunePlayers[playerId] && players[playerId].status !== PLAYER_STATUS.ELIMINATED,
      )
      .map((playerId: UID) => players[playerId]);
  }

  switch (results.cardKeyword) {
    // RANK 0 - Passive or counter interaction cards
    case KEYWORDS.COUNTER_ATTACK:
    case KEYWORDS.SURVIVE_SOLO:
    case KEYWORDS.AUTO_WIN_COMPARE:
    case KEYWORDS.GAIN_POINT_ON_ELIMINATION:
      results.resolutionKeyword = RESOLUTION_KEYWORD.PLAYED;
      break;

    // RANK 1 - Guessing cards
    case KEYWORDS.GUESS_RANK: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.effectInput = results.selections?.effectInput ?? null;

      // If counter attack, the target is protected
      if (performCounterAttackCheck()) {
        break;
      }

      // Verify guessing
      const guessedCard = cardsDict[results.selections?.effectInput ?? ''] ?? null;
      const guessedRank = guessedCard?.rank ?? -1;
      if (guessedRank !== 1 && targetPlayerCard?.rank === guessedRank) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.TARGET_ELIMINATED;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        results.discardedCardId = targetPlayerCardId;
        results.eliminatedByPlayerId = results.actorId;
      } else {
        results.resolutionKeyword = RESOLUTION_KEYWORD.INCORRECT;
      }
      break;
    }
    case KEYWORDS.GUESS_NAME: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.effectInput = results.selections?.effectInput ?? null;

      // If counter attack, the target is protected
      if (performCounterAttackCheck()) {
        break;
      }

      // Verify guessing
      const guessedCard = cardsDict[results.selections?.effectInput ?? ''] ?? null;
      const guessedName = guessedCard?.name ?? '';

      if (guessedName !== '' && targetPlayerCard?.name === guessedName) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.TARGET_ELIMINATED;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        results.discardedCardId = targetPlayerCardId;
        results.eliminatedByPlayerId = results.actorId;
      } else {
        results.resolutionKeyword = RESOLUTION_KEYWORD.INCORRECT;
      }
      break;
    }
    // RANK 2 - Peek cards
    case KEYWORDS.PEEK: {
      results.resolutionKeyword = RESOLUTION_KEYWORD.PEEK;
      break;
    }
    case KEYWORDS.PEEK_ASIDE: {
      results.resolutionKeyword = RESOLUTION_KEYWORD.PEEK_ASIDE;
      break;
    }
    // RANK 3 - Compare cards
    case KEYWORDS.COMPARE_LOWER: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      if (performCompareAutoWinCheck()) {
        break;
      }

      // Verify comparison win
      if (targetPlayerCard?.rank < actorCardInHand.rank) {
        results.eliminatedPlayersIds = [targetPlayer.id];
        players[results.actorId].status = PLAYER_STATUS.ACTIVE; // Active player is protected
        targetPlayer.status = PLAYER_STATUS.ELIMINATED; // Target is eliminated
        results.discardedCardId = targetPlayerCardId;
        results.resolutionKeyword = RESOLUTION_KEYWORD.TARGET_ELIMINATED;
        results.eliminatedByPlayerId = results.actorId;
        break;
      }

      // Verify comparison loss
      if (targetPlayerCard?.rank > actorCardInHand.rank) {
        results.eliminatedPlayersIds = [results.actorId];
        targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
        players[results.actorId].status = PLAYER_STATUS.ELIMINATED; // Active player is eliminated
        results.discardedCardId = actorCardInHandId;
        results.resolutionKeyword = RESOLUTION_KEYWORD.ACTOR_ELIMINATED;
        results.eliminatedByPlayerId = results.targetPlayersIds[0] ?? null;
        break;
      }

      // If ranks are equal, it's a tie
      results.resolutionKeyword = RESOLUTION_KEYWORD.TIE;
      break;
    }
    case KEYWORDS.COMPARE_HIGHER: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      if (performCompareAutoWinCheck()) {
        break;
      }

      // Verify comparison win
      if (targetPlayerCard?.rank > actorCardInHand.rank) {
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED; // Target is eliminated
        results.discardedCardId = targetPlayerCardId;
        results.resolutionKeyword = RESOLUTION_KEYWORD.TARGET_ELIMINATED;
        results.eliminatedByPlayerId = results.actorId;
        break;
      }

      // Verify comparison loss
      if (targetPlayerCard?.rank < actorCardInHand.rank) {
        results.eliminatedPlayersIds = [results.actorId];
        targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
        players[results.actorId].status = PLAYER_STATUS.ELIMINATED;
        results.discardedCardId = actorCardInHandId;
        results.resolutionKeyword = RESOLUTION_KEYWORD.ACTOR_ELIMINATED;
        results.eliminatedByPlayerId = results.targetPlayersIds[0] ?? null;
        break;
      }

      // If ranks are equal, it's a tie
      results.resolutionKeyword = RESOLUTION_KEYWORD.TIE;
      break;
    }

    // RANK 4 - Immunity cards
    case KEYWORDS.IMMUNITY: {
      const newOngoingEffect: OngoingEffect = {
        affectedPlayerId: results.actorId,
        effectKeyword: RESOLUTION_KEYWORD.IMMUNITY,
        type: 'TURN',
      };
      ongoingEffects.push(newOngoingEffect);
      results.newOngoingEffect = newOngoingEffect;
      results.resolutionKeyword = RESOLUTION_KEYWORD.IMMUNITY;
      players[results.actorId].status = PLAYER_STATUS.IMMUNE;

      break;
    }
    case KEYWORDS.IMMUNITY_BONUS: {
      const newOngoingEffect: OngoingEffect = {
        affectedPlayerId: results.actorId,
        effectKeyword: RESOLUTION_KEYWORD.IMMUNITY,
        type: 'TURN',
      };
      ongoingEffects.push(newOngoingEffect);
      results.newOngoingEffect = newOngoingEffect;
      results.resolutionKeyword = RESOLUTION_KEYWORD.IMMUNITY;
      players[results.actorId].status = PLAYER_STATUS.IMMUNE;

      break;
    }

    // RANK 5 - Force discard
    case KEYWORDS.DISCARD_REDRAW: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer || !targetPlayerCard || !targetPlayerCardId) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      // Check if target has #10 that gets eliminated if discarded
      if (targetPlayerCard?.keyword === KEYWORDS.AUTO_ELIMINATE) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_ELIMINATE;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        results.eliminatedByPlayerId = results.actorId;
        results.discardedCardId = targetPlayerCardId;
        break;
      }

      const newCardId = deck.pop();
      // Rare case the card doesn't exist, it just eliminates the player and doesn't redraw
      if (!newCardId) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.NO_CARD_TO_DRAW;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        results.eliminatedByPlayerId = results.actorId;
        break;
      }

      discardPile.push(targetPlayerCardId);
      targetPlayer.hand[0] = newCardId;
      results.resolutionKeyword = RESOLUTION_KEYWORD.DISCARDED_AND_REDRAWN;
      results.discardedCardId = targetPlayerCardId;

      break;
    }

    // RANK 6 - Trade hands in different ways
    case KEYWORDS.TRADE_HANDS: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }
      results.resolutionKeyword = RESOLUTION_KEYWORD.TRADE_HANDS;
      const targetPlayerCardId = targetPlayerCard?.id ?? '';
      targetPlayer.hand[0] = actorCardInHandId;
      players[results.actorId].hand[0] = targetPlayerCardId;

      break;
    }
    case KEYWORDS.FORCE_TRADE: {
      if (performNoAvailableTargetCheck()) {
        break;
      }

      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.resolutionKeyword = RESOLUTION_KEYWORD.TRADE_HANDS;
      const secondTargetPlayerId = results.selections?.effectInput ?? '';
      const secondTargetPlayer = players[secondTargetPlayerId];
      const secondTargetPlayerCard = secondTargetPlayer
        ? cardsDict[getCardKeyFromId(secondTargetPlayer.hand[0])]
        : null;

      if (!secondTargetPlayer || !secondTargetPlayerCard) {
        throw new Error(`Second target player with ID ${secondTargetPlayerId} not found.`);
      }

      results.targetPlayersIds.push(secondTargetPlayerId);
      targetPlayer.hand[0] = secondTargetPlayerCard.id;
      secondTargetPlayer.hand[0] = targetPlayerCard.id;

      break;
    }
    case KEYWORDS.TRADE_ASIDE: {
      results.resolutionKeyword = RESOLUTION_KEYWORD.TRADE_ASIDE;
      cardsSetAside.push(actorCardInHandId);
      const selectedAsideCard = results.selections?.effectInput ?? '';
      cardsSetAside = cardsSetAside.filter((cardId) => cardId !== selectedAsideCard);
      players[results.actorId].hand = [selectedAsideCard];
      break;
    }

    // RANK 7 - Random card changes
    case KEYWORDS.EXCHANGE_TOP: {
      const actor = players[results.actorId];
      if (!actor) {
        throw new Error(`Actor with ID ${results.actorId} not found.`);
      }

      const newCardId = deck.pop();
      // Rare case the card doesn't exist, it just eliminates the player and doesn't redraw
      if (!newCardId) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.NO_CARD_TO_DRAW;
        results.eliminatedPlayersIds = [actor.id];
        actor.status = PLAYER_STATUS.ELIMINATED;
        break;
      }

      actor.hand[0] = newCardId;
      deck.push(actorCardInHandId);
      results.resolutionKeyword = RESOLUTION_KEYWORD.EXCHANGE_TOP;

      break;
    }
    case KEYWORDS.PASS_LEFT: {
      const nonImmunePlayers = getNonImmunePlayers();

      const allHands = nonImmunePlayers.map((player) => player.hand[0]);
      nonImmunePlayers.forEach((player, index) => {
        const previousIndex = (index - 1 + nonImmunePlayers.length) % nonImmunePlayers.length;
        player.hand[0] = allHands[previousIndex];
      });

      results.resolutionKeyword = RESOLUTION_KEYWORD.PASS_LEFT;

      break;
    }
    case KEYWORDS.SHUFFLE: {
      const nonImmunePlayers = getNonImmunePlayers();

      const allShuffledCards = shuffle(nonImmunePlayers.map((player) => player.hand[0]));
      nonImmunePlayers.forEach((player, index) => {
        player.hand[0] = allShuffledCards[index];
      });

      results.resolutionKeyword = RESOLUTION_KEYWORD.SHUFFLE;

      break;
    }

    // RANK 8 - Forced played that may give information to other players
    case KEYWORDS.FORCE_PLAY:
      results.resolutionKeyword = RESOLUTION_KEYWORD.PLAYED;
      break;

    // RANK 9 - Does nothing when played (penalty during win)
    case KEYWORDS.WIN_PENALTY:
      results.resolutionKeyword = RESOLUTION_KEYWORD.PLAYED;
      break;

    // RANK 10 - Auto elimination when played
    case KEYWORDS.AUTO_ELIMINATE: {
      results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_ELIMINATE;
      results.eliminatedPlayersIds = [results.actorId];
      players[results.actorId].status = PLAYER_STATUS.ELIMINATED;
      results.discardedCardId = results.cardId;
      results.eliminatedByPlayerId = results.actorId;
      break;
    }

    // RANK 11 - Does nothing when played (conditional win)
    case KEYWORDS.CONDITIONAL_WIN:
      results.resolutionKeyword = RESOLUTION_KEYWORD.PLAYED;
      break;

    default:
      // Nothing happens
      results.resolutionKeyword = RESOLUTION_KEYWORD.ERROR;
  }

  // Award "drunk" bonus points when eliminated by other players
  if (results.eliminatedByPlayerId) {
    for (const playerId of results.eliminatedPlayersIds) {
      if (playerId === results.eliminatedByPlayerId) {
        continue; // Skip the player who eliminated themselves
      }

      const player = players[playerId];

      if (!player || player.hand.length === 0) {
        continue; // Skip if player not found or has no cards
      }

      const card = cardsDict[getCardKeyFromId(player.hand[0])];

      if (card?.keyword === KEYWORDS.GAIN_POINT_ON_ELIMINATION) {
        const newOngoingEffect = {
          type: ONGOING_EFFECT_TYPE.ROUND,
          affectedPlayerId: player.id,
          effectKeyword: RESOLUTION_KEYWORD.GAIN_POINT_ON_ELIMINATION,
        };
        results.newOngoingEffect = newOngoingEffect;
        ongoingEffects.push(newOngoingEffect);
      }
    }
  }

  // Existing hand cleanup follows
  for (const playerId in players) {
    if (players[playerId].status === PLAYER_STATUS.ELIMINATED) {
      if (players[playerId].hand.length > 0) {
        discardPile.push(...players[playerId].hand);
        players[playerId].hand = [];
      }
      increaseAchievement(store.achievements, playerId, 'eliminations', 1);
      if (results.eliminatedByPlayerId === results.actorId && results.actorId === playerId) {
        increaseAchievement(store.achievements, playerId, 'selfEliminations', 1);
      }
    }
  }

  // TODO: Remove when game is released
  // print.debug('After Switch', {
  //   actorId: results.actorId,
  //   actorName: players[results.actorId]?.name ?? 'Unknown',
  //   actorCardInHand: players[results.actorId]?.hand?.[0] ?? 'None',
  //   actorStatus: players[results.actorId]?.status ?? 'Unknown',
  //   targetPlayerId,
  //   targetPlayerName: targetPlayer?.name ?? 'None',
  //   targetCardInHand: targetPlayerCardId ?? 'None',
  //   targetStatus: targetPlayer?.status ?? 'Unknown',
  //   resolutionKeyword: results.resolutionKeyword,
  //   newOngoingEffect: results.newOngoingEffect ? results.newOngoingEffect.type : null,
  //   eliminatedPlayersIds: results.eliminatedPlayersIds,
  //   effectInput: results.effectInput,
  //   discardedCardId: results.discardedCardId,
  // });

  // Update outcome
  let outcome: string = OUTCOME.CONTINUE;
  // When the deck is fully depleted, the round ends
  if (deck.length === 0) {
    outcome = OUTCOME.END_ROUND;
  }
  // If there's only one player left, the round ends
  const playersStillActive = getListOfPlayers(players).filter(
    (player) => player.status !== PLAYER_STATUS.ELIMINATED,
  );
  if (playersStillActive.length <= 1) {
    outcome = OUTCOME.END_ROUND;
  }

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_RESOLUTION,
        players,
        log: [results, ...(state.log ?? [])],
        deck,
        cardsSetAside,
        ongoingEffects,
        outcome,
        discardPile,
      },
      stateCleanup: ['play'],
    },
  };
};

/**
 * Round Ranking phase
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRoundRankingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

  const listOfPlayers = getListOfPlayers(players);
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;
  const ongoingEffects: OngoingEffect[] = state.ongoingEffects ?? [];

  let highestRank = -1;
  // Score based on card rank
  const orderedPlayersByCardRank = orderBy(
    listOfPlayers.filter((player) => player.status !== PLAYER_STATUS.ELIMINATED),
    (player) => {
      const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];
      return cardInHand ? cardInHand.rank : -1;
    },
    'asc',
  );
  orderedPlayersByCardRank.forEach((player) => {
    const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];
    if (cardInHand) {
      // Since Rank 11 cannot win if Rank 10 is in play
      if (cardInHand.rank > 10 && highestRank === 10) {
        return; // Skip this player's card
      }
      if (cardInHand.rank > highestRank) {
        highestRank = cardInHand.rank;
      }
    }
  });

  // Gained Points: [win, bonus, penalty, eliminationBonus]
  const scores = new Scores(players, [0, 0, 0, 0]);
  listOfPlayers.forEach((player) => {
    if (player.status !== PLAYER_STATUS.ELIMINATED) {
      const cardIdInHand = getCardKeyFromId(player.hand[0]);
      const cardInHand = cardsDict[cardIdInHand];
      if (cardInHand) {
        if (cardInHand.rank === highestRank) {
          scores.add(player.id, POINTS.WIN_ROUND, 0);

          if (cardInHand.keyword === KEYWORDS.IMMUNITY_BONUS) {
            scores.add(player.id, POINTS.BONUS, 1); // Add bonus point
          }

          if (cardInHand.keyword === KEYWORDS.WIN_PENALTY) {
            scores.add(player.id, POINTS.PENALTY, 2); // Add penalty point for having WIN_PENALTY
          }
        }
      }
    }
  });

  // Award bonus for SURVIVE_SOLO
  const playersWithSurviveSolo = listOfPlayers.filter((player) => {
    if (player.status !== PLAYER_STATUS.ELIMINATED) {
      const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];
      return cardInHand?.keyword === KEYWORDS.SURVIVE_SOLO;
    }
    return false;
  });

  if (playersWithSurviveSolo.length === 1) {
    const soloPlayer = playersWithSurviveSolo[0];
    scores.add(soloPlayer.id, POINTS.BONUS, 1); // Add bonus point for surviving solo
  }

  // Award bonus for GAIN_POINT_ON_ELIMINATION
  ongoingEffects.forEach((effect) => {
    if (effect.effectKeyword === RESOLUTION_KEYWORD.GAIN_POINT_ON_ELIMINATION) {
      scores.add(effect.affectedPlayerId, POINTS.BONUS, 3); // Add bonus point for GAIN_POINT_ON_ELIMINATION
    }
  });

  const ranking = scores.rank(players);

  // If any player has achieved the goal, end the game
  let outcome: string = OUTCOME.SETUP;
  if (listOfPlayers.some((player) => player.score >= POINTS.GOAL)) {
    outcome = OUTCOME.END_GAME;
  }

  // Achievements
  if (ranking.length === 1) {
    increaseAchievement(store.achievements, ranking[0].playerId, 'survivedSolo', 1);
  }
  if (ranking.length > 0) {
    ranking.forEach((rank) => {
      increaseAchievement(store.achievements, rank.playerId, 'ranked', 1);
    });
  }

  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: CORREIO_DO_AMOR_PHASES.ROUND_RANKING,
        players,
        outcome,
        ranking,
      },
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
    },
  };
};

/**
 * Game Over phase - calculates final scores and achievements
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
  // Determine winners
  const winners = determineWinners(players);

  // Calculate achievements
  const achievements = calculateAchievements(store.achievements);

  // Mark game meta as complete
  await markGameAsComplete(gameId);

  // Save game to each user's profile
  await saveGameToUsers({
    gameName: GAME_NAMES.CONTROLE_DE_ESTOQUE,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  // await saveData(store.language, store.pastStuff);

  // Cleanup player for game over screen
  cleanupPlayers(players, []); // add in the array any props you want to keep on the player object

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        achievements,
        winners,
        cardsDict: state.cardsDict,
      },
    },
  };
};
