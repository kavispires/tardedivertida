// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
// Constants
import {
  DIGITS,
  INSTRUMENTOS_CODIFICADOS_PHASES,
  INSTRUMENTS,
  TOTAL_IMAGE_CARDS,
  TOTAL_ROUNDS,
} from './constants';
// Utils
import utils from '../../utils';
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
  const themes = utils.game.getRandomItems(Object.values(cards), TOTAL_ROUNDS);

  // Build final code
  const playerCount = Object.keys(players).length;

  const passCodeOrders = utils.game.shuffle(DIGITS);

  // Get each player's password fragment, add instrument
  Object.values(players).forEach((player, index) => {
    player.instrument = INSTRUMENTS[passCodeOrders[index]];
    player.order = passCodeOrders[index];
    player.fragment = buildCodeFragment();
  });

  const code = buildCode(players, playerCount);

  const allCards = await utils.imageCards.getImageCards(TOTAL_IMAGE_CARDS);
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
  utils.players.unReadyPlayers(players);

  const theme = store.themes[state.round.current];

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.HINT_GIVING,
        round: utils.helpers.increaseRound(state?.round, TOTAL_ROUNDS),
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
  utils.players.unReadyPlayers(players);

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
  utils.players.unReadyPlayers(players);

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
  utils.players.unReadyPlayers(players);

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
  gameId: GameId,
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const winners = utils.players.determineWinners(players);

  await utils.firebase.markGameAsComplete(gameId);

  return {
    set: {
      players,
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
      },
    },
  };
};
