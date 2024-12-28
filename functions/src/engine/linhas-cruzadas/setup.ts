// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
// Utils
import utils from '../../utils';
// Internal
import {
  addSlideToAlbum,
  assignSlideToPlayers,
  buildAlbum,
  dealPromptOptions,
  getAchievements,
} from './helpers';
import { GAME_NAMES } from '../../utils/constants';

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
  resourceData: ResourceData,
): Promise<SaveGamePayload> => {
  const { gameOrder, playerCount } = utils.players.buildGameOrder(players);

  const expressionsDeck = utils.game.getRandomItems(
    resourceData.allExpressions,
    playerCount * (store.options.singleWordOnly ? 0 : 2),
  );
  const wordsDeck = utils.game.getRandomItems(
    resourceData.allWords,
    playerCount * (store.options.singleWordOnly ? 4 : 2),
  );

  const achievements = utils.achievements.setup(players, store, {
    drawingDuration: 0,
    writingDuration: 0,
    randomPromptSelection: 0,
  });

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

export const preparePromptSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
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
      utils.achievements.increase(store, player.id, 'randomPromptSelection', 1);
    }
  });

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['prompts', 'promptId', 'guess', 'randomSelection']);

  // Achievements: Drawing
  if (state.round.current > 0) {
    utils.players.getListOfPlayers(players).forEach((player) => {
      if (player.updatedAt) {
        utils.achievements.increase(store, player.id, 'writingDuration', player.updatedAt - state.updatedAt);
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
        round: utils.helpers.increaseRound(state.round),
        players,
      },
    },
  };
};

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
      utils.achievements.increase(store, player.id, 'drawingDuration', player.updatedAt - state.updatedAt);
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

export const preparePresentationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const album = addSlideToAlbum(store.album, players);
  utils.players.unReadyPlayers(players);

  utils.players.removePropertiesFromPlayers(players, ['guess']);

  const orderedAlbum = state.gameOrder.map((playerId: PlayerId) => album[playerId]);

  // Achievements: Writing
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.updatedAt) {
      utils.achievements.increase(store, player.id, 'writingDuration', player.updatedAt - state.updatedAt);
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

export const prepareGameOverPhase = async (
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const achievements = getAchievements(store);

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
