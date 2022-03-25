// Constants
import { GALERIA_DE_SONHOS_PHASES, TABLE_DECK_TOTAL } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData, WordCard } from './types';
import { NumberDictionary, PlainObject, PlayerId, Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import { buildDeck, buildTable, getRoundWords } from './helpers';

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
  const { gameOrder } = utils.helpers.buildGameOrder(players);

  // Build Image Cards deck
  const imageCardIds = await utils.imageCards.getImageCards(TABLE_DECK_TOTAL);
  const imageCardsIdsDeck = utils.game.getRandomItems(imageCardIds, TABLE_DECK_TOTAL);
  const tableDeck = imageCardsIdsDeck.map((cardId) => ({ id: cardId, used: false }));

  // Get word deck
  // Build deck
  const wordsDeck = buildDeck(resourceData.allWords);

  // Save
  return {
    update: {
      store: {
        gameOrder,
        tableDeck,
        wordsDeck,
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
  players = utils.players.removePropertiesFromPlayers(players, ['cards']);

  // Determine active player based on current round
  const scoutId = utils.players.getActivePlayer(state.gameOrder, round.current);

  // Update table
  const [tableDeck, table] = buildTable(store.tableDeck, [], round.current);

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

  const word = state.words.find((w: WordCard) => w.id === store.wordId);
  const leftoverWord = state.words.find((w: WordCard) => w.id !== store.wordId);
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

  // Count selected cards per player
  const cardCount = Object.values(players).reduce((acc: NumberDictionary, player: PlainObject) => {
    acc[player.id] = Object.keys(player.cards).length;
    return acc;
  }, {});

  // Check if anybody is having a nightmare (in the dark) (uniquely most cards)
  const maxDreamCount = Math.max(...Object.values(cardCount));

  const playersInMax = Object.entries(cardCount).reduce(
    (acc: PlayerId[], [playerId, quantity]: [PlayerId, number]) => {
      if (quantity === maxDreamCount) {
        acc.push(playerId);
      }
      return acc;
    },
    []
  );

  // Save
  return {
    update: {
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.CARD_PLAY,
        activePlayerId: state.scoutId,
        playerHavingNightmareId: playersInMax.length === 1 ? playersInMax[0] : utils.firebase.deleteValue(),
        turnCount: 0,
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
  // Save
  return {
    update: {
      state: {
        phase: GALERIA_DE_SONHOS_PHASES.RESOLUTION,
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
        phase: GALERIA_DE_SONHOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
