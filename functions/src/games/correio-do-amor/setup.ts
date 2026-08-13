import { shuffle } from 'lodash';
// Types
import type {
  FestaJuninaCard,
  FirebaseStateData,
  FirebaseStoreData,
  OngoingEffect,
  Play,
  ResolutionLog,
  ResourceData,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import {
  CORREIO_DO_AMOR_PHASES,
  DECK_INFO_BY_PLAYER_COUNT,
  MAX_ROUNDS,
  ONGOING_EFFECT_TYPE,
  OUTCOME,
  PLAYER_STATUS,
  POINTS_GOAL,
  POINTS_PER_ROUND,
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
import { setupAchievements, calculateAchievements } from './achievements';
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
    const previousDeck = (state.deck ?? []).reduce((acc: Dictionary<true>, cardId: string) => {
      acc[getCardKeyFromId(cardId)] = true;
      return acc;
    }, {});

    // Generate deck
    const deck = buildRoundDeck(
      cardsDict,
      state.round.current,
      getPlayerCount(players),
      store.plusRotation,
      store.advancedRotation,
    );

    const newCardsInDeck = deck.filter((newCardId) => !previousDeck[getCardKeyFromId(newCardId)]);

    // Deal cards to players
    getListOfPlayers(players).forEach((player) => {
      player.hand = [deck.pop()];
      player.keywords = [];
      player.status = PLAYER_STATUS.ACTIVE;
    });

    // Increase round
    const round = increaseRound(state.round);

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
      // TODO: maybe add play here
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
  const activePlayerId = turnOrderUtils.getNextPlayerId(state.turnOrder, state.activePlayerId);

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

  return {
    update: {
      state: {
        phase: CORREIO_DO_AMOR_PHASES.CARD_PLAY,
        key: String(Date.now()), // Use to force re-render in the client
        players,
        activePlayerId,
        ongoingEffects,
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
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

  const deck: UID[] = state.deck ?? [];
  const discardPile: UID[] = state.discardPile ?? [];
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;
  const cardsSetAside: UID[] = state.cardsSetAside ?? [];

  const play: Play = state.play;
  const activePlayerId = state.activePlayerId;
  const targetPlayerId = play.selections?.targetPlayerId ?? null;
  const targetPlayer = players[targetPlayerId ?? ''] ?? null;

  const ongoingEffects: OngoingEffect[] = state.ongoingEffects ?? [];

  const results: ResolutionLog = {
    playedCardId: play.activeCardId ?? '',
    actorPlayerId: activePlayerId,
    targetPlayersIds: [],
    ongoingEffect: null,
    resolutionKeyword: null,
    eliminatedPlayersIds: [],
  };

  const activePlayerCard = cardsDict[getCardKeyFromId(results.playedCardId)] ?? null;
  let targetPlayerCard: FestaJuninaCard | null = null;
  if (targetPlayerId) {
    targetPlayerCard = cardsDict[getCardKeyFromId(targetPlayer.hand[0])] ?? null;
    results.targetPlayersIds.push(targetPlayerId);
  }

  // INTERNAL PHASE HELPER FUNCTIONS
  function performCounterAttackCheck(): boolean {
    if (targetPlayerCard?.keyword === 'COUNTER_ATTACK') {
      results.resolutionKeyword = RESOLUTION_KEYWORD.COUNTER_ATTACK;
      results.eliminatedPlayersIds = [activePlayerId];
      targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
      players[activePlayerId].status = PLAYER_STATUS.ELIMINATED; // Active player is eliminated
      return true;
    }

    return false;
  }

  function performCompareAutoWinCheck(): boolean {
    if (targetPlayerCard?.keyword === 'AUTO_WIN_COMPARE') {
      results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_WIN_COMPARE;
      results.eliminatedPlayersIds = [activePlayerId];
      targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
      players[activePlayerId].status = PLAYER_STATUS.ELIMINATED; // Active player is eliminated
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

  switch (play.effectKeyword) {
    // CASES WITH ACTIVE EFFECTS THAT REQUIRE RESOLUTION LOGIC
    case 'GUESS_RANK': {
      if (!targetPlayer) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.effectInput = play.selections?.effectInput ?? null;

      // If counter attack, the target is protected
      if (performCounterAttackCheck()) {
        break;
      }

      // Verify guessing
      const guessedCard = cardsDict[play.selections?.effectInput ?? ''] ?? null;
      const guessedRank = guessedCard?.rank ?? -1;
      if (guessedRank !== 1 && targetPlayerCard?.rank === guessedRank) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.ELIMINATED;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
      } else {
        results.resolutionKeyword = RESOLUTION_KEYWORD.INCORRECT;
      }
      break;
    }
    case 'GUESS_NAME': {
      if (!targetPlayer) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.effectInput = play.selections?.effectInput ?? null;

      // If counter attack, the target is protected
      if (performCounterAttackCheck()) {
        break;
      }

      // Verify guessing
      const guessedCard = cardsDict[play.selections?.effectInput ?? ''] ?? null;
      const guessedName = guessedCard?.name ?? '';

      if (guessedName !== '' && targetPlayerCard?.name === guessedName) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.ELIMINATED;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
      } else {
        results.resolutionKeyword = RESOLUTION_KEYWORD.INCORRECT;
      }
      break;
    }
    case 'SWAP_ASIDE': {
      results.effectInput = play.selections?.effectInput ?? null;

      if (play.selections?.effectInput === 'SWAP') {
        results.resolutionKeyword = RESOLUTION_KEYWORD.SWAP_ASIDE;
      } else {
        results.resolutionKeyword = RESOLUTION_KEYWORD.NO_SWAP;
      }
      break;
    }
    case 'COMPARE_LOWER': {
      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      if (performCompareAutoWinCheck()) {
        break;
      }

      results.resolutionKeyword = RESOLUTION_KEYWORD.ELIMINATED;

      // Verify comparison win
      if (targetPlayerCard?.rank < activePlayerCard.rank) {
        results.eliminatedPlayersIds = [targetPlayer.id];
        players[activePlayerId].status = PLAYER_STATUS.ACTIVE; // Active player is protected
        targetPlayer.status = PLAYER_STATUS.ELIMINATED; // Target is eliminated
        break;
      }

      // Verify comparison loss
      if (targetPlayerCard?.rank > activePlayerCard.rank) {
        results.eliminatedPlayersIds = [activePlayerId];
        targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
        players[activePlayerId].status = PLAYER_STATUS.ELIMINATED; // Active player is eliminated
        break;
      }

      // If ranks are equal, it's a tie
      results.resolutionKeyword = RESOLUTION_KEYWORD.TIE;
      break;
    }
    case 'COMPARE_HIGHER': {
      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      if (performCompareAutoWinCheck()) {
        break;
      }

      results.resolutionKeyword = RESOLUTION_KEYWORD.ELIMINATED;

      // Verify comparison win
      if (targetPlayerCard?.rank > activePlayerCard.rank) {
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED; // Target is eliminated
        break;
      }

      // Verify comparison loss
      if (targetPlayerCard?.rank < activePlayerCard.rank) {
        results.eliminatedPlayersIds = [activePlayerId];
        targetPlayer.status = PLAYER_STATUS.ACTIVE; // Target is protected
        players[activePlayerId].status = PLAYER_STATUS.ELIMINATED;
        break;
      }

      // If ranks are equal, it's a tie
      results.resolutionKeyword = RESOLUTION_KEYWORD.TIE;
      break;
    }

    case 'DISCARD_REDRAW': {
      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      // Check if target has #10 that gets eliminated if discarded
      if (targetPlayerCard?.keyword === 'DISCARD_AUTO_ELIMINATE') {
        results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_ELIMINATE;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        break;
      }

      const newCardId = deck.pop();
      // Rare case the card doesn't exist, it just eliminates the player and doesn't redraw
      if (!newCardId) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.NO_CARD_TO_DRAW;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        break;
      }

      const discardedCardId = targetPlayer.hand[0];
      discardPile.push(discardedCardId);
      targetPlayer.hand[0] = newCardId;
      results.resolutionKeyword = RESOLUTION_KEYWORD.DISCARDED_AND_REDRAWN;

      break;
    }
    case 'TRADE_HANDS': {
      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }
      results.resolutionKeyword = RESOLUTION_KEYWORD.TRADE_HANDS;
      const activePlayerCardId = activePlayerCard?.id ?? '';
      const targetPlayerCardId = targetPlayerCard?.id ?? '';
      targetPlayer.hand[0] = activePlayerCardId;
      players[activePlayerId].hand[0] = targetPlayerCardId;

      break;
    }
    case 'FORCE_TRADE': {
      if (!targetPlayer || !targetPlayerCard) {
        throw new Error(`Target player with ID ${targetPlayerId} not found.`);
      }

      results.resolutionKeyword = RESOLUTION_KEYWORD.TRADE_HANDS;
      const secondTargetPlayerId = play.selections?.effectInput ?? '';
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
    case 'EXCHANGE_TOP': {
      const newCardId = deck.pop();
      // Rare case the card doesn't exist, it just eliminates the player and doesn't redraw
      if (!newCardId) {
        results.resolutionKeyword = RESOLUTION_KEYWORD.NO_CARD_TO_DRAW;
        results.eliminatedPlayersIds = [targetPlayer.id];
        targetPlayer.status = PLAYER_STATUS.ELIMINATED;
        break;
      }

      const discardedCardId = targetPlayer.hand[0];
      targetPlayer.hand[0] = newCardId;
      deck.push(discardedCardId);
      results.resolutionKeyword = RESOLUTION_KEYWORD.EXCHANGE_TOP;

      break;
    }
    case 'PASS_LEFT': {
      const nonImmunePlayers = getNonImmunePlayers();

      const allHands = nonImmunePlayers.map((player) => player.hand[0]);
      nonImmunePlayers.forEach((player, index) => {
        const previousIndex = (index - 1 + nonImmunePlayers.length) % nonImmunePlayers.length;
        player.hand[0] = allHands[previousIndex];
      });

      results.resolutionKeyword = RESOLUTION_KEYWORD.PASS_LEFT;

      break;
    }
    case 'SHUFFLE': {
      const nonImmunePlayers = getNonImmunePlayers();

      const allShuffledCards = shuffle(nonImmunePlayers.map((player) => player.hand[0]));
      nonImmunePlayers.forEach((player, index) => {
        player.hand[0] = allShuffledCards[index];
      });

      results.resolutionKeyword = RESOLUTION_KEYWORD.SHUFFLE;

      break;
    }
    case 'AUTO_ELIMINATE': {
      results.resolutionKeyword = RESOLUTION_KEYWORD.AUTO_ELIMINATE;
      results.eliminatedPlayersIds = [activePlayerId];
      players[activePlayerId].status = PLAYER_STATUS.ELIMINATED;
      break;
    }

    // Cases hat trigger ongoing effect
    case 'IMMUNITY': {
      const newOngoingEffect: OngoingEffect = {
        affectedPlayerId: activePlayerId,
        effectKeyword: RESOLUTION_KEYWORD.IMMUNITY,
        type: 'TURN',
      };
      ongoingEffects.push(newOngoingEffect);
      results.ongoingEffect = newOngoingEffect;
      results.resolutionKeyword = RESOLUTION_KEYWORD.IMMUNITY;
      players[activePlayerId].status = PLAYER_STATUS.IMMUNE;

      break;
    }
    case 'IMMUNITY_BONUS': {
      const newOngoingEffect: OngoingEffect = {
        affectedPlayerId: activePlayerId,
        effectKeyword: RESOLUTION_KEYWORD.IMMUNITY,
        type: 'TURN',
      };
      ongoingEffects.push(newOngoingEffect);
      results.ongoingEffect = newOngoingEffect;

      // const newOngoingBonusEffect: OngoingEffect = {
      //   affectedPlayerId: activePlayerId,
      //   effectKeyword: 'BONUS',
      //   type: 'ROUND',
      // };
      // ongoingEffects.push(newOngoingBonusEffect);
      // results.ongoingEffect = newOngoingBonusEffect;
      // results.resolutionKeyword = 'IMMUNITY_BONUS';
      break;
    }

    // Case with actions that do not require resolution logic
    case 'PEEK': {
      results.resolutionKeyword = RESOLUTION_KEYWORD.PEEK;
      break;
    }

    case 'COUNTER_ATTACK':
    case 'FORCE_PLAY':
    case 'SURVIVE_SOLO':
    case 'WIN_PENALTY':
    case 'AUTO_WIN_COMPARE':
    case 'CONDITIONAL_WIN':
      results.resolutionKeyword = 'PLAYED';
      break;

    default:
      // Nothing happens
      results.resolutionKeyword = 'ERROR';
  }

  for (const playerId in players) {
    if (players[playerId].status === PLAYER_STATUS.ELIMINATED) {
      if (players[playerId].hand.length > 0) {
        discardPile.push(...players[playerId].hand);
        players[playerId].hand = [];
      }
    }
  }

  // Update outcome
  let outcome: string = OUTCOME.CONTINUE;
  // When the deck is fully depleted, the round ends
  if (deck.length === 0) {
    outcome = OUTCOME.END_ROUND;
  }
  // If there's only one player left, the round ends
  const activePlayersCount = getListOfPlayers(players).filter(
    (player) => player.status === PLAYER_STATUS.ACTIVE,
  ).length;
  if (activePlayersCount <= 1) {
    outcome = OUTCOME.END_ROUND;
  }

  return {
    update: {
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
      stateCleanup: [
        /* TODO: List properties to clean up from previous phase */
      ],
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
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

  const listOfPlayers = getListOfPlayers(players);
  const cardsDict: Dictionary<FestaJuninaCard> = state.cardsDict;

  let highestRank = -1;
  // Score based on card rank
  listOfPlayers.forEach((player) => {
    if (player.status === PLAYER_STATUS.ACTIVE) {
      const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];

      if (cardInHand && cardInHand.rank > highestRank) {
        highestRank = cardInHand.rank;
      }
    }
  });

  // Gained Points: [win, bonus]
  const scores = new Scores(players, [0, 0]);
  listOfPlayers.forEach((player) => {
    if (player.status === PLAYER_STATUS.ACTIVE) {
      const cardIdInHand = getCardKeyFromId(player.hand[0]);
      const cardInHand = cardsDict[cardIdInHand];
      if (cardInHand) {
        if (cardInHand.rank === highestRank) {
          scores.add(player.id, POINTS_PER_ROUND, 0);

          if (cardInHand.keyword === 'IMMUNITY_BONUS') {
            scores.add(player.id, 1, 1); // Add bonus point
          }
        }
      }
    }
  });

  // Award bonus for SURVIVE_SOLO
  const playersWithSurviveSolo = listOfPlayers.filter((player) => {
    const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];
    return cardInHand?.keyword === 'SURVIVE_SOLO' && player.status === PLAYER_STATUS.ACTIVE;
  });

  if (playersWithSurviveSolo.length === 1) {
    const soloPlayer = playersWithSurviveSolo[0];
    scores.add(soloPlayer.id, 1, 1); // Add bonus point for surviving solo
  }

  // Award penalty for WIN_PENALTY
  const playersWithWinPenalty = listOfPlayers.filter((player) => {
    const cardInHand = cardsDict[getCardKeyFromId(player.hand[0])];
    return cardInHand?.keyword === 'WIN_PENALTY' && player.status === PLAYER_STATUS.ACTIVE;
  });

  if (playersWithWinPenalty.length > 0) {
    playersWithWinPenalty.forEach((player) => {
      scores.subtract(player.id, -1, 1); // Subtract penalty point for having WIN_PENALTY
    });
  }

  const ranking = scores.rank(players);

  // If any player has achieved the goal, end the game
  let outcome: string = OUTCOME.SETUP;
  if (listOfPlayers.some((player) => player.score >= POINTS_GOAL)) {
    outcome = OUTCOME.END_GAME;
  }

  return {
    update: {
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
        // TODO: Add game over specific data, like gallery
      },
    },
  };
};
