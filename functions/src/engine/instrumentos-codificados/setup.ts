// Interfaces
import { PlainObject, Players, SaveGamePayload } from '../../utils/interfaces';
import { FirebaseStateData, FirebaseStoreData } from './interfaces';
// Constants
import {
  DIGITS,
  INSTRUMENTOS_CODIFICADOS_PHASES,
  INSTRUMENTS,
  TOTAL_IMAGE_CARDS,
  TOTAL_ROUNDS,
} from './constants';
// Utils
import * as gameUtils from '../../utils/game-utils';
import * as imageCards from '../../utils/image-cards';
import * as utils from '../../utils/helpers';
// Internal
import { buildCode, buildCodeFragment, buildTable } from './helpers';

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
  cards: PlainObject
): Promise<SaveGamePayload> => {
  // Get 5 (4 regular rounds + 1 order round) themes
  const themes = gameUtils.getRandomItems(Object.values(cards), TOTAL_ROUNDS);

  // Build final code
  const playerCount = Object.keys(players).length;

  const passCodeOrders = gameUtils.shuffle(DIGITS);

  // Get each player's password fragment, add instrument
  Object.values(players).forEach((player, index) => {
    player.instrument = INSTRUMENTS[passCodeOrders[index]];
    player.order = passCodeOrders[index];
    player.fragment = buildCodeFragment();
  });

  const code = buildCode(players, playerCount);

  const allCards = gameUtils.getRandomItems(imageCards.getImageCards(1), TOTAL_IMAGE_CARDS);
  const table = buildTable(allCards);

  // Save
  return {
    update: {
      store: {
        themes,
      },
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.SETUP,
        code,
        codeLength: code.length,
        table,
      },
      players,
    },
  };
};

export const prepareHintGivingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  const theme = store.themes[state.round.current];

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.HINT_GIVING,
        round: utils.increaseRound(state?.round, TOTAL_ROUNDS),
        theme,
      },
      players,
    },
  };
};

export const prepareHintReceivingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.HINT_RECEIVING,
      },
      players,
    },
  };
};

export const prepareGuessTheCodePhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE,
      },
      players,
    },
  };
};

export const prepareSolutionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE,
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
  const winners = utils.determineWinners(players);

  return {
    update: {
      meta: {
        isComplete: true,
      },
    },
    set: {
      players,
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GAME_OVER,
        winners,
        gameEndedAt: Date.now(),
        round: state.round,
      },
    },
  };
};
