// Constants
import { GALERIA_DE_SONHOS_PHASES, TABLE_DECK_TOTAL } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import { TextCard } from '../../types/tdr';
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildDeck,
  buildRanking,
  buildTable,
  getAchievements,
  getMostVotedCards,
  getPlayersWithMaxDreams,
  getRoundWords,
  simulateBotCards,
} from './helpers';
import { saveData } from './data';

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
  // Determine player order
  const { gameOrder } = utils.players.buildGameOrder(players);

  // Build Image Cards deck
  const imageCardsIdsDeck = utils.game.getRandomItems(resourceData.images, TABLE_DECK_TOTAL);
  const tableDeck = imageCardsIdsDeck.map((cardId) => ({ id: cardId, used: false }));

  // Get word deck
  const wordsDeck = buildDeck(resourceData.allWords);

  const achievements = utils.achievements.setup(players, store, {
    matches: 0,
    fullMatches: 0,
    dreamCount: 0,
    nightmare: 0,
    pairs: 0,
    noMatches: 0,
    zeroMatches: 0,
    falls: 0,
  });

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
  players: Players
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);

  // Make sure everybody has 6 cards in hand
  players = utils.players.removePropertiesFromPlayers(players, ['cards', 'fallen', 'skip', 'inNightmare']);

  // Determine active player based on current round
  const scoutId = utils.players.getActivePlayer(store.gameOrder, round.current);
  utils.players.unReadyPlayer(players, scoutId);

  // Update table
  const [tableDeck, table] = buildTable(store.tableDeck, state.table ?? [], round.current);

  // Get current words options
  const [wordsDeck, words] = getRoundWords(store.wordsDeck);

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
      },
    },
  };
};

export const prepareDreamsSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.addPropertiesToPlayers(players, { cards: {} });

  const word = state.words.find((w: TextCard) => w.id === store.wordId);
  const leftoverWord = state.words.find((w: TextCard) => w.id !== store.wordId);
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

export const prepareCardPlayPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const playersInMax = getPlayersWithMaxDreams(players);
  const isOnePlayerInNightmare = playersInMax.length === 1;

  if (isOnePlayerInNightmare) {
    players[playersInMax[0]].inNightmare = true;
  }
  const playerInNightmareId = isOnePlayerInNightmare ? playersInMax[0] : utils.firestore.deleteValue();

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

export const prepareResolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Build ranking
  const ranking = buildRanking(players, store, state.playerInNightmareId);
  utils.players.neutralizeBotScores(players);

  // Save to store most matched card
  const mostVotedCards = getMostVotedCards(state.table, state.word);

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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
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

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
