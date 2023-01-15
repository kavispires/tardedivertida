// Constants
import { GALERIA_DE_SONHOS_PHASES, TABLE_DECK_TOTAL } from './constants';
// Types
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
  const imageCardIds = await utils.imageCards.getImageCards(TABLE_DECK_TOTAL);
  const imageCardsIdsDeck = utils.game.getRandomItems(imageCardIds, TABLE_DECK_TOTAL);
  const tableDeck = imageCardsIdsDeck.map((cardId) => ({ id: cardId, used: false }));

  // Get word deck
  const wordsDeck = buildDeck(resourceData.allWords);

  // Helper Bots
  if (store.options.withBots) {
    utils.players.addBots(players, 3);
  }

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
        gameOrder,
      },
      players,
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
        round,
        table,
        scoutId,
        words,
      },
      players,
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
        word,
        words: utils.firebase.deleteValue(),
      },
      players,
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
  const playerInNightmareId = isOnePlayerInNightmare ? playersInMax[0] : utils.firebase.deleteValue();

  // Simulate bots cards
  simulateBotCards(players, state.table);

  // Save
  return {
    update: {
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.CARD_PLAY,
        activePlayerId: state.scoutId,
        playerInNightmareId,
        turnCount: 0,
        gameOrder: store.gameOrder,
      },
      players,
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
        activePlayerId: utils.firebase.deleteValue(),
        gameOrder: utils.firebase.deleteValue(),
        lastActivePlayerId: utils.firebase.deleteValue(),
        turnCount: utils.firebase.deleteValue(),
        latest: utils.firebase.deleteValue(),
        ranking,
      },
      players,
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

  return {
    set: {
      players,
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        bestMatches: store.bestMatches,
        table: store.tableDeckBackup,
        achievements,
      },
    },
  };
};
