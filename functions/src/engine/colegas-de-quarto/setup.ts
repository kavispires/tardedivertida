// Constants
import {
  COLEGAS_DE_QUARTO_PHASES,
  SETTINGS_PER_PLAYER_COUNT,
  TARGET_ID,
  TOTAL_ROUNDS,
  WORDS_IN_POOL,
} from './constants';
import { GAME_NAMES, SEPARATOR } from '../../utils/constants';
import { shuffle } from 'lodash';
// Types
import type { BoardEntry, FirebaseStateData, FirebaseStoreData, PastClues, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { buildRanking, getAchievements } from './helpers';
import { saveData } from './data';
import type { TextCard } from '../../types/tdr';

/**
 * Setup
 * Build the card deck
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, {
    guessed: 0,
    soloGuessed: 0,
    soloGuess: 0,
    finalItems: 0,
    wordLength: 0,
  });

  const playerCount = utils.players.getPlayerCount(players);

  // Save
  return {
    update: {
      store: {
        deck: resourceData.deck,
        pastClues: {},
        purchases: {},
        achievements,
      },
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.SETUP,
        round: {
          current: 0,
          total: TOTAL_ROUNDS,
          forceLastRound: false,
        },
        happiness: {
          gained: [],
          total: 0,
          goal: SETTINGS_PER_PLAYER_COUNT[playerCount]?.happinessGoal || 0,
        },
      },
    },
  };
};

export const prepareWordsSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const pool: TextCard[] = [];
  new Array(WORDS_IN_POOL).fill(null).forEach(() => {
    pool.push(store.deck.pop() as TextCard);
  });

  const requiredWords = SETTINGS_PER_PLAYER_COUNT[utils.players.getPlayerCount(players)]?.totalWords || 0;

  // Save
  return {
    update: {
      store: {
        deck: store.deck,
      },
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.WORDS_SELECTION,
        players,
        pool,
        round: utils.game.increaseRound(state?.round),
        requiredWords,
      },
      stateCleanup: ['table', 'gallery', 'ranking'],
    },
  };
};

export const prepareClueWritingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const playerCount = utils.players.getPlayerCount(players);

  // Create board with words from players
  const pool: TextCard[] = state.pool || [];
  const selectedWordsIds: string[] = [];
  utils.players.getListOfPlayers(players).forEach((player) => {
    selectedWordsIds.push(...(player.selectedWordsIds ?? []));
  });
  const totalWords = SETTINGS_PER_PLAYER_COUNT[playerCount]?.totalWords ?? 13;
  const cleanupIds = shuffle(utils.helpers.removeDuplicates(selectedWordsIds)).slice(0, totalWords);
  const playerOrder = shuffle([
    TARGET_ID,
    ...utils.players
      .getListOfPlayers(players)
      .flatMap((player) => Array(SETTINGS_PER_PLAYER_COUNT[playerCount]?.pairsToGuess * 2).fill(player.id)),
  ]);

  const board: BoardEntry[] = Array.from({ length: totalWords }).map((_, index) => ({
    id: String(index + 1),
    cardId: cleanupIds[index],
    text: pool.find((card) => card.id === cleanupIds[index])?.text || 'ERROR',
    playerId: playerOrder[index],
  }));

  // Assign words to players
  board.forEach((entry) => {
    if (entry.playerId !== TARGET_ID) {
      if (!players[entry.playerId].assignedWordIds) {
        players[entry.playerId].assignedWordIds = [];
      }
      players[entry.playerId].assignedWordIds.push(entry);
    }
  });

  utils.players.getListOfPlayers(players).forEach((player) => {
    player.assignedWordIds = shuffle(player?.assignedWordIds || []);
    // Divide in chunks based on pairsToGuess
    const chunks: BoardEntry[][] = utils.helpers.sliceInParts(
      player.assignedWordIds,
      SETTINGS_PER_PLAYER_COUNT[playerCount]?.pairsToGuess || 1,
    );
    player.assignedPairs = chunks.map((chunk) => {
      return {
        id: chunk
          .map((item) => item.id)
          .sort()
          .join(SEPARATOR),
        ids: chunk.map((item) => item.id).sort(),
        clue: '',
      };
    });
  });

  // Remove selectedWordsIds from players
  utils.players.removePropertiesFromPlayers(players, ['assignedWordIds', 'selectedWordsIds']);

  // Save
  return {
    update: {
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING,
        players,
        board,
      },
      stateCleanup: ['pool'],
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

  const board: BoardEntry[] = state.board;

  const playerClues: PastClues = {};
  utils.players.getListOfPlayers(players).forEach((player) => {
    player.assignedPairs.forEach((pair, index) => {
      pair.clue = player.clues?.[index] || 'ERROR';
      // Achievement: Word length
      utils.achievements.increase(store, player.id, 'wordLength', pair.clue.length);
      pair.ids.forEach((id: string) => {
        const cardId = board.find((entry) => entry.id === id)?.cardId || 'ERROR';
        playerClues[cardId] = playerClues[cardId] || [];
        playerClues[cardId].push(pair.clue);
      });
    });
  });

  // Save
  return {
    update: {
      store: {
        pastClues: {
          ...store.pastClues,
          ...playerClues,
        },
        achievements: store.achievements,
      },
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.GUESSING,
        players,
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
  const { ranking, happiness, gallery, foundTarget, targetId } = buildRanking(
    store,
    players,
    state.board,
    state.happiness,
  );

  utils.players.unReadyPlayers(players);

  const purchases = store.purchases || {};
  if (foundTarget.length > 0) {
    purchases[state.round.current] = state.board.find((entry: BoardEntry) => entry.id === targetId);
  }

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        purchases,
      },
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.REVEAL,
        ranking,
        gallery,
        happiness,
        players,
        foundTarget,
        targetId,
      },
    },
  };
};

export const prepareGameOverPhase = async (
  gameId: UID,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const happiness = state.happiness;
  const win = happiness.total >= happiness.goal;
  const winners = win ? utils.players.getListOfPlayers(players) : utils.players.determineWinners(players);

  const achievements = getAchievements(store);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.COLEGAS_DE_QUARTO,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data
  await saveData(store.language, store.pastClues);

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
    },
    set: {
      state: {
        phase: COLEGAS_DE_QUARTO_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        happiness: state.happiness,
        winners,
        players,
        achievements,
        purchases: store.purchases,
        gallery: store.pastClues,
      },
    },
  };
};
