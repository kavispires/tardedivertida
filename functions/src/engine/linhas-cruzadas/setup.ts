// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
import { sampleSize } from 'lodash';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import { addSlideToAlbum, assignSlideToPlayers, buildAlbum, dealPromptOptions } from './helpers';
import { setupAchievements, increaseAchievement, getAchievements } from './achievements';
import { GAME_NAMES } from '../../utils/constants';

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
  const { gameOrder, playerCount } = utils.turnOrder.create(players);

  const expressionsDeck = sampleSize(
    resourceData.allExpressions,
    playerCount * (store.options.singleWordOnly ? 0 : 2),
  );
  const wordsDeck = sampleSize(resourceData.allWords, playerCount * (store.options.singleWordOnly ? 4 : 2));

  const achievements = setupAchievements(utils.players.getListOfPlayersIds(players));

  // Save
  return {
    update: {
      store: {
        expressionsDeck,
        wordsDeck,
        album: {},
        achievements,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.SETUP,
        gameOrder,
        round: {
          current: 0,
          total: Math.floor(playerCount / 2),
        },
      },
    },
  };
};

/**
 * [Prompt Selection Phase] - Players select their prompts for drawing
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
export const preparePromptSelectionPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  dealPromptOptions(players, store.expressionsDeck, store.wordsDeck, store.options);

  // Save
  return {
    update: {
      state: {
        phase: LINHAS_CRUZADAS_PHASES.PROMPT_SELECTION,
        players,
      },
      storeCleanup: ['expressionsDeck', 'wordsDeck'],
    },
  };
};

/**
 * [Drawing Phase] - Players draw based on their selected prompts
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareDrawingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  let album = store.album;
  let isFirstSlide = false;

  // If it is the first drawing phase create album otherwise add naming entry
  if (Object.keys(album).length === 0) {
    album = buildAlbum(players);
    isFirstSlide = true;
  } else {
    album = addSlideToAlbum(album, players);
  }

  // Assign next slide name
  assignSlideToPlayers(album, players, state.gameOrder, isFirstSlide);

  // Achievements: Random Prompt Selection
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.randomSelection) {
      increaseAchievement(store.achievements, player.id, 'randomPromptSelection', 1);
    }
  });

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['prompts', 'promptId', 'guess', 'randomSelection']);

  // Achievements: Drawing
  if (state.round.current > 0) {
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (player.updatedAt) {
        increaseAchievement(
          store.achievements,
          player.id,
          'writingDuration',
          Math.abs(player.updatedAt - state.updatedAt),
        );
      }
    });
  }

  // Save
  return {
    update: {
      store: {
        album,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.DRAWING,
        round: utils.game.increaseRound(state.round),
        players,
      },
    },
  };
};

/**
 * [Naming Phase] - Players name other players' drawings
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareNamingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const album = addSlideToAlbum(store.album, players);

  // Assign next slide name
  assignSlideToPlayers(album, players, state.gameOrder);

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['drawing']);

  // Achievements: Drawing
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.updatedAt) {
      increaseAchievement(
        store.achievements,
        player.id,
        'drawingDuration',
        Math.abs(player.updatedAt - state.updatedAt),
      );
    }
  });

  // Save
  return {
    update: {
      store: {
        album: store.album,
        achievements: store.achievements,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.NAMING,
        players,
      },
    },
  };
};

/**
 * [Presentation Phase] - Display all drawings and names to players
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const preparePresentationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const album = addSlideToAlbum(store.album, players);
  utils.players.unReadyPlayers(players);

  utils.players.removePropertiesFromPlayers(players, ['guess']);

  const orderedAlbum = state.gameOrder.map((playerId: UID) => album[playerId]);

  // Achievements: Writing
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.updatedAt) {
      increaseAchievement(
        store.achievements,
        player.id,
        'writingDuration',
        Math.abs(player.updatedAt - state.updatedAt),
      );
    }
  });

  // Save
  return {
    update: {
      store: {
        album,
        achievements: store.achievements,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.PRESENTATION,
        album: orderedAlbum,
        players,
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
  const achievements = getAchievements(store.achievements);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.LINHAS_CRUZADAS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners: [],
    achievements,
    language: store.language,
  });

  return {
    set: {
      state: {
        phase: LINHAS_CRUZADAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        players,
        album: state.album,
        group: {
          score: 100,
          victory: 100,
          outcome: 'NON_WINNABLE_GAME',
        },
        achievements,
      },
    },
  };
};
