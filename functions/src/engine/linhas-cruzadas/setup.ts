// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
// Types
import type { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import type { PlayerId, Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils';
// Internal
import { addSlideToAlbum, assignSlideToPlayers, buildAlbum, dealPromptOptions } from './helpers';

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
  const { gameOrder, playerCount } = utils.helpers.buildGameOrder(players);

  const expressionsDeck = utils.game.getRandomItems(
    resourceData.allExpressions,
    playerCount * (store.options.singleWordOnly ? 0 : 2)
  );
  const wordsDeck = utils.game.getRandomItems(
    resourceData.allWords,
    playerCount * (store.options.singleWordOnly ? 4 : 2)
  );

  // Save
  return {
    update: {
      store: {
        expressionsDeck,
        wordsDeck,
        album: {},
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
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  dealPromptOptions(players, store.expressionsDeck, store.wordsDeck, store.options);

  // Save
  return {
    update: {
      store: {
        expressionsDeck: utils.firebase.deleteValue(),
        wordsDeck: utils.firebase.deleteValue(),
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.PROMPT_SELECTION,
      },
      players,
    },
  };
};

export const prepareDrawingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
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

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['prompts', 'promptId', 'guess']);

  // Save
  return {
    update: {
      store: {
        album,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.DRAWING,
        round: utils.helpers.increaseRound(state.round),
      },
      players,
    },
  };
};

export const prepareNamingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const album = addSlideToAlbum(store.album, players);

  // Assign next slide name
  assignSlideToPlayers(album, players, state.gameOrder);

  // Unready players
  utils.players.unReadyPlayers(players);
  utils.players.removePropertiesFromPlayers(players, ['drawing']);

  // Save
  return {
    update: {
      store: {
        album: store.album,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.NAMING,
      },
      players,
    },
  };
};

export const preparePresentationPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const album = addSlideToAlbum(store.album, players);

  utils.players.removePropertiesFromPlayers(players, ['guess']);

  const orderedAlbum = state.gameOrder.map((playerId: PlayerId) => album[playerId]);

  // Save
  return {
    update: {
      store: {
        album,
      },
      state: {
        phase: LINHAS_CRUZADAS_PHASES.PRESENTATION,
        album: orderedAlbum,
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
  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: LINHAS_CRUZADAS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        album: state.album,
        group: {
          score: 100,
          victory: 100,
        },
      },
    },
  };
};
