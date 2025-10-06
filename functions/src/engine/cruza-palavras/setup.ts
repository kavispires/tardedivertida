// Constants
import { CRUZA_PALAVRAS_PHASES, WORDS_PER_COORDINATE } from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Types
import type { Deck, FirebaseStateData, FirebaseStoreData, GridCell, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  buildGrid,
  buildRanking,
  distributeCoordinates,
  getAchievements,
  getPlayerClues,
  updateGridWithPlayersClues,
  updatePastClues,
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
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, {
    clues: 0,
    badClues: 0,
    guesses: 0,
    chooseForMe: 0,
    wordLength: 0,
    savior: 0,
  });

  utils.players.addPropertiesToPlayers(players, { coordinates: [] });

  const gameType =
    {
      words: 'words',
      properties: 'words',
      contenders: 'contenders',
      imageCards: 'images',
      items: 'items',
    }?.[store?.options?.gridType ?? 'words'] || 'words';

  const gridSize =
    WORDS_PER_COORDINATE[utils.players.getPlayerCount(players)] + (store?.options?.largerGrid ? 1 : 0);

  // Save
  return {
    update: {
      store: {
        deck: resourceData.deck,
        playersClues: [],
        availableCoordinates: {},
        pastClues: {},
        achievements,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.SETUP,
        gameType,
        gridSize,
      },
    },
  };
};

export const prepareWordsSelectionPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: CRUZA_PALAVRAS_PHASES.WORDS_SELECTION,
        players,
        deck: store.deck,
      },
    },
  };
};

export const prepareClueWritingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const gridSize: number = state.gridSize ?? 15;

  const storeUpdate: PlainObject = {};

  // If coming from the word selection, create the deck of selections
  if (state.phase === CRUZA_PALAVRAS_PHASES.WORDS_SELECTION) {
    const deckDict: BooleanDictionary = {};
    utils.players.getListOfPlayers(players).forEach((player) => {
      player.selectedWordsIds.forEach((wordId: string) => {
        deckDict[wordId] = true;
      });
    });

    const originalDeck: Deck = store.deck;

    while (Object.keys(deckDict).length < gridSize) {
      const cardId = utils.game.getRandomItem(originalDeck).id;
      deckDict[cardId] = true;
    }

    const newDeck = Object.keys(deckDict).reduce((acc: Deck, cardId) => {
      const card = originalDeck.find((card) => card.id === cardId);
      if (card) {
        acc.push(card);
      }
      return acc;
    }, []);

    store.deck = newDeck;
    storeUpdate.deck = newDeck;

    utils.players.removePropertiesFromPlayers(players, ['selectedWordsIds']);
  }

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['choseRandomly']);

  const round = utils.helpers.increaseRound(state.round);

  let gameType: string = state.gameType;
  let grid: GridCell[] = state.grid ?? buildGrid(store.deck, store.playersClues, gridSize, false);
  // Build/Rebuild grid on round 1 and 4
  if (round.current === 1 || round.current === 4) {
    grid = buildGrid(store.deck, store.playersClues, gridSize, round.current === 4);
    utils.players.addPropertiesToPlayers(players, { coordinates: [] });
    gameType = round.current === 4 ? 'words' : gameType;

    // Reset playersClues for round 4 here instead of later
    if (round.current === 4) {
      storeUpdate.playersClues = [];
    }
  }

  const updatedGrid = distributeCoordinates(players, grid);

  utils.players.removePropertiesFromPlayers(players, ['clue', 'guesses', 'currentClueCoordinate']);

  // Save
  return {
    update: {
      store: {
        ...storeUpdate,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.CLUE_WRITING,
        round,
        grid: updatedGrid,
        gameType,
        players,
      },
      stateCleanup: ['clues', 'ranking', 'whoGotNoPoints', 'deck'],
    },
  };
};

export const prepareGuessingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const clues = getPlayerClues(players);
  // Achievement: wordLength
  clues.forEach((clue) => {
    utils.achievements.increase(store, clue.playerId, 'wordLength', clue.clue.length);
  });

  const playersClues = clues.map((entry) => entry.clue);
  const pastClues = updatePastClues(state.grid, store.pastClues, clues);

  // Save
  return {
    update: {
      store: {
        playersClues: [...(store.playersClues ?? []), ...playersClues],
        pastClues,
        achievements: store.achievements,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.GUESSING,
        players,
        clues,
      },
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Gather votes
  const { ranking, whoGotNoPoints } = buildRanking(players, state.clues, store);

  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: CRUZA_PALAVRAS_PHASES.REVEAL,
        grid: updateGridWithPlayersClues(players, state.grid),
        ranking,
        whoGotNoPoints,
        players,
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
  const winners = utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.CRUZA_PALAVRAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  await saveData(store.language, store.pastClues, store?.options?.gridType === 'contenders');

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: CRUZA_PALAVRAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        achievements,
        grid: state.grid,
        gridSize: state.gridSize,
        gameType: state.gameType,
      },
    },
  };
};
