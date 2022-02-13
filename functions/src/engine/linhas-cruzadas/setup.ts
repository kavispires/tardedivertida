// Constants
import { LINHAS_CRUZADAS_PHASES } from './constants';
// Types
import { FirebaseStateData, FirebaseStoreData, ResourceData } from './types';
import { Players, SaveGamePayload } from '../../utils/types';
// Utils
import * as utils from '../../utils/helpers';
// import * as firebaseUtils from '../../utils/firebase';
import * as gameUtils from '../../utils/game-utils';
import { addSlideToAlbum, assignSlideToPlayers, buildAlbum, dealPromptOptions } from './helpers';
// Internal

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
  const { gameOrder, playerCount } = utils.buildGameOrder(players);

  const expressionsDeck = gameUtils.getRandomItems(resourceData.allExpressions, playerCount);
  const wordsDeck = gameUtils.getRandomItems(resourceData.allWords, playerCount);

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
  utils.unReadyPlayers(players);

  dealPromptOptions(players, store.expressionsDeck, store.wordsDeck);

  // Save
  return {
    update: {
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
    album = buildAlbum(players, store.expressionsDeck, store.wordsDeck);
    isFirstSlide = true;
  } else {
    album = addSlideToAlbum(album, players);
  }

  // Assign next slide name
  assignSlideToPlayers(album, players, state.gameOrder, isFirstSlide);

  // Unready players
  utils.unReadyPlayers(players);
  utils.removePropertiesFromPlayers(players, ['prompts', 'promptId', 'guess']);

  // Save
  return {
    update: {
      state: {
        phase: LINHAS_CRUZADAS_PHASES.NAMING,
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
  utils.unReadyPlayers(players);
  utils.removePropertiesFromPlayers(players, ['drawing']);

  // Save
  return {
    update: {
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

  utils.removePropertiesFromPlayers(players, ['guess']);

  // Save
  return {
    update: {
      state: {
        phase: LINHAS_CRUZADAS_PHASES.NAMING,
        album: Object.values(album),
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
        group: {
          score: 100,
          victory: 100,
        },
      },
    },
  };
};
