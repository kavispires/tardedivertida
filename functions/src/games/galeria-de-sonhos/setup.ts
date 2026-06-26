import { sample, sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { GALERIA_DE_SONHOS_PHASES, TABLE_DECK_TOTAL, TOTAL_ROUNDS } from './constants';
// Services
import * as firestoreValueUtils from '../../services/firestore-core';
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Mechanics
import {
  addPropertiesToPlayers,
  cleanupPlayers,
  getListOfPlayersIds,
  removePropertiesFromPlayers,
  setPlayersReadyState,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners, neutralizeBotScores } from '../../mechanics/scoring';
import { turnOrderUtils } from '../../mechanics/turn-order';
// Internal
import { calculateAchievements, setupAchievements } from './achievements';
import { saveData } from './data';
import {
  buildDeck,
  buildRanking,
  buildTable,
  getMostVotedCards,
  getPlayersWithMaxDreams,
  getRoundWords,
  simulateBotCards,
} from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param resourceData - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  // Determine player order
  const { gameOrder } = turnOrderUtils.create(players);

  // Build Image Cards deck
  const imageCardsIdsDeck = sampleSize(resourceData.images, TABLE_DECK_TOTAL);
  const tableDeck = imageCardsIdsDeck.map((cardId) => ({ id: cardId, used: false }));

  // Get word deck
  const wordsDeck = buildDeck(resourceData.allWords);

  const achievements = setupAchievements(getListOfPlayersIds(players));

  const round: Round = {
    current: 0,
    total: TOTAL_ROUNDS,
    forceLastRound: false,
  };

  // Save
  return {
    update: {
      store: {
        gameOrder,
        tableDeck,
        tableDeckBackup: tableDeck,
        wordsDeck,
        bestMatches: [],
        achievements,
      },
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.SETUP,
        players,
        gameOrder,
        minimumSelection: 1,
        round,
      },
    },
  };
};

/**
 *
 * @param store
 * @param state
 * @param players
 * @returns
 */
export const prepareWordSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = increaseRound(state.round);

  // Make sure everybody has 6 cards in hand
  removePropertiesFromPlayers(players, ['cards', 'fallen', 'skip', 'inNightmare']);

  // Determine active player based on current round
  const scoutId = turnOrderUtils.getActivePlayerId(store.gameOrder, round.current);

  setPlayersReadyState(players, false, { excludeIds: [scoutId] });

  // Update table
  const [tableDeck, table] = buildTable(store.tableDeck, state.table ?? [], round.current);

  // Get current words options
  const [wordsDeck, words] = getRoundWords(store.wordsDeck);

  let minimumSelection = store.options?.surpriseMode ? sample([5, 6, 7]) : 1;
  if (round.current === 1 && store.options?.surpriseMode) {
    minimumSelection = 4;
  }

  // Save
  return {
    update: {
      store: {
        tableDeck,
        wordsDeck,
      },
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.WORD_SELECTION,
        players,
        round,
        table,
        scoutId,
        words,
        minimumSelection,
      },
    },
  };
};
/**
 * Word Selection phase - players select words for their dreams
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 *//**
 * Dreams Selection phase - players select dream cards to match the word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDreamsSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);
  addPropertiesToPlayers(players, { cards: {} });

  const word = state.words.find((w: TextCardData) => w.id === store.wordId);
  const leftoverWord = state.words.find((w: TextCardData) => w.id !== store.wordId);
  const wordsDeck = [leftoverWord, ...store.wordsDeck];

  // Save
  return {
    update: {
      store: {
        wordsDeck,
      },
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.DREAMS_SELECTION,
        players,
        word,
      },
      stateCleanup: ['words'],
    },
  };
};

/**
 * Card Play phase - players play cards for the current word
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  setPlayersReadyState(players, false);

  const playersInMax = getPlayersWithMaxDreams(players);
  const isOnePlayerInNightmare = playersInMax.length === 1;

  if (isOnePlayerInNightmare) {
    players[playersInMax[0]].inNightmare = true;
  }
  const playerInNightmareId = isOnePlayerInNightmare ? playersInMax[0] : firestoreValueUtils.deleteValue();

  // Simulate bots cards
  simulateBotCards(players, state.table);

  // Save
  return {
    update: {
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.CARD_PLAY,
        players,
        activePlayerId: state.scoutId,
        playerInNightmareId,
        turnCount: 0,
        gameOrder: store.gameOrder,
      },
    },
  };
};

/**
 * Resolution phase - reveals votes and calculates scores
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Build ranking
  const ranking = buildRanking(players, store, state.playerInNightmareId);
  neutralizeBotScores(players);

  // Save to store most matched card
  const mostVotedCards = getMostVotedCards(state.table, state.word);

  // Unready players
  setPlayersReadyState(players, false);

  // Save
  return {
    update: {
      store: {
        bestMatches: [...(store.bestMatches ?? []), ...mostVotedCards],
        achievements: store.achievements,
      },
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.RESOLUTION,
        players,
        ranking,
      },
      stateCleanup: ['activePlayerId', 'gameOrder', 'lastActivePlayerId', 'turnCount', 'latest'],
    },
  };
};

/**
 * Game Over phase - determines winners and saves game data
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
  const winners = determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await saveGameToUsers({
    gameName: GAME_NAMES.GALERIA_DE_SONHOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  const bestMatches = store.bestMatches;
  const table = store.tableDeckBackup;

  await saveData(store.language, bestMatches);

  cleanupPlayers(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.GAME_OVER,
        players,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        bestMatches,
        table,
        achievements,
      },
    },
  };
};
