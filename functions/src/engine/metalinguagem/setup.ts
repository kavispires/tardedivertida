// Constants
import { ITEMS_PER_ROUND, MAX_ROUNDS, METALINGUAGEM_PHASES, WORD_LENGTH_STATUS } from './constants';
import { orderBy, sampleSize } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, GalleryEntry, ResourceData, WordLength } from './types';
// Utils
import utils from '../../utils';
import { GAME_NAMES } from '../../utils/constants';
import {
  setupAchievements,
  increaseAchievement,
  calculateAchievements,
  pushAchievement,
} from './achievements';
import type { ItemData } from '../../types/tdr';
import { cleanupStore, markGameAsComplete } from '../../services/game-session';

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
  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  const wordLengths = utils.helpers.makeArray(6, 3).map((value) => ({
    wordLength: value,
    status: WORD_LENGTH_STATUS.AVAILABLE,
  }));

  const { gameOrder: turnOrder } = utils.turnOrder.create(players);

  // Save
  return {
    update: {
      store: {
        items: additionalData.items,
        achievements,
      },
      state: {
        phase: METALINGUAGEM_PHASES.SETUP,
        players,
        round: {
          current: 0,
          total: MAX_ROUNDS,
        },
        wordLengths,
        turnOrder,
      },
    },
  };
};

/**
 * [Word Creation Phase] - Creator makes a word from item names
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareWordCreationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Cleanup
  utils.players.removePropertiesFromPlayers(players, ['guesses', 'newWord', 'names']);

  const round = utils.game.increaseRound(state.round);
  const creatorId = utils.turnOrder.getActivePlayerId(state.turnOrder, round.current);

  const storeItems: ItemData[] = store.items;

  const currentRound = round.current;

  const items = storeItems.slice((currentRound - 1) * ITEMS_PER_ROUND, currentRound * ITEMS_PER_ROUND);

  const targets = sampleSize(items, 2);

  // Unready creator only
  utils.players.readyPlayers(players, creatorId);

  // Save
  return {
    update: {
      state: {
        phase: METALINGUAGEM_PHASES.WORD_CREATION,
        players,
        round,
        creatorId,
        items,
        beginsWith: targets[0].id,
        endsWith: targets[1].id,
      },
      stateCleanup: ['mostVotedItems', 'guessPlayersPerItem'],
    },
  };
};

/**
 * [Guessing Phase] - Players guess which items form the word
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGuessingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const creatorId: UID = state.creatorId;

  const creator = players[creatorId];
  // Unready players
  utils.players.unReadyPlayers(players, creatorId);

  const names: string[] = creator.names;
  const newWord: string = creator.newWord;
  const namesIndexes: number[] = creator.namesIndexes;

  // Save
  return {
    update: {
      state: {
        phase: METALINGUAGEM_PHASES.GUESSING,
        players,
        names,
        namesIndexes,
        newWord,
      },
    },
  };
};

/**
 * [Results Phase] - Display round results and update word lengths
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareResultsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const creatorId: UID = state.creatorId;

  // Achievement: Word Lengths
  increaseAchievement(store.achievements, state.creatorId, 'wordLengths', state.newWord.length);

  const wordLengths: WordLength[] = state.wordLengths;

  const turnOrderWithoutCreator: UID[] = utils.turnOrder
    .reorder(state.turnOrder, creatorId)
    .filter((id: string) => id !== creatorId);

  const guessPlayersPerItem = turnOrderWithoutCreator.reduce((acc: Record<string, string[]>, id: UID) => {
    const player = players[id];
    const [guess1, guess2] = player.guesses as [string, string];
    if (!acc[guess1]) acc[guess1] = [];
    acc[guess1].push(id);
    if (!acc[guess2]) acc[guess2] = [];
    acc[guess2].push(id);

    return acc;
  }, {});

  const answer: UID[] = [state.beginsWith, state.endsWith];

  // Get ordered most voted things, if there's a tie for anything, the turn order is used
  const guessVotes = orderBy(
    Object.entries(guessPlayersPerItem),
    [
      // The most votes goes first
      ([, p]) => p.length,
      // If there's a tie, the winning votes
      ([guess]) => (answer.includes(guess) ? 0 : 1),
      // If there's will a tie, the turn order fixes it
      ([guess]) => turnOrderWithoutCreator.findIndex((id) => players[id].guesses.includes(guess)),
    ],
    ['desc'],
  ).map(([guess]) => guess);

  const [firstGuess, secondGuess] = guessVotes;

  const isFirstCorrect = answer.includes(firstGuess);
  const isSecondCorrect = answer.includes(secondGuess);
  let outcome: string = WORD_LENGTH_STATUS.FAILED;
  const wordLengthIndex = wordLengths.findIndex(
    (wordLength) => wordLength.wordLength === state.newWord.length,
  );
  // If the two most voted things are the correct items, the wordLength is marked as SOLVED
  if (isFirstCorrect && isSecondCorrect) {
    wordLengths[wordLengthIndex].status = WORD_LENGTH_STATUS.SOLVED;
    outcome = WORD_LENGTH_STATUS.SOLVED;
  } else {
    // If the two most voted things are NOT the correct items, the wordLength is marked as ENDANGERED
    if (wordLengths[wordLengthIndex].status === WORD_LENGTH_STATUS.ENDANGERED) {
      wordLengths[wordLengthIndex].status = WORD_LENGTH_STATUS.FAILED;
      outcome = WORD_LENGTH_STATUS.FAILED;
    } else {
      wordLengths[wordLengthIndex].status = WORD_LENGTH_STATUS.ENDANGERED;
      outcome = WORD_LENGTH_STATUS.ENDANGERED;
    }
  }

  // Achievement: Best Words
  let creatorBestWordAchievement = 0;
  if (isFirstCorrect) {
    creatorBestWordAchievement += (guessPlayersPerItem[answer[0]] ?? []).length;
  }
  if (isSecondCorrect) {
    creatorBestWordAchievement += (guessPlayersPerItem[answer[1]] ?? []).length;
  }
  pushAchievement(store.achievements, creatorId, 'bestWords', creatorBestWordAchievement);

  // Achievements: Players
  turnOrderWithoutCreator.forEach((playerId) => {
    const player = players[playerId];
    const correctGuesses = player.guesses.filter((guess) => answer.includes(guess)).length;
    if (correctGuesses === 2) {
      increaseAchievement(store.achievements, player.id, 'twoCorrect', 1);
    }
    if (correctGuesses === 1) {
      increaseAchievement(store.achievements, player.id, 'oneCorrect', 1);
    }
    if (correctGuesses === 0) {
      increaseAchievement(store.achievements, player.id, 'zeroCorrect', 1);
    }
  });

  const gallery: GalleryEntry[] = store.gallery || [];
  gallery.push({
    itemsIds: [state.beginsWith, state.endsWith],
    name: state.newWord,
    names: state.names,
    correct: isFirstCorrect && isSecondCorrect,
  });

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
        gallery,
      },
      state: {
        phase: METALINGUAGEM_PHASES.RESULTS,
        players,
        wordLengths,
        outcome,
        guessPlayersPerItem,
        mostVotedItems: [firstGuess, secondGuess],
      },
    },
  };
};

/**
 * [Game Over Phase] - Finalize game and save results
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
  const winners = state.outcome === WORD_LENGTH_STATUS.FAILED ? [] : utils.players.determineWinners(players);

  const achievements = calculateAchievements(store.achievements);

  await markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.METALINGUAGEM,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  utils.players.cleanup(players, []);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
    },
    set: {
      state: {
        phase: METALINGUAGEM_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
        gallery: store.gallery,
        achievements,
      },
    },
  };
};
