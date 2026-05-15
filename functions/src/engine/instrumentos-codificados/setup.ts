// Types
import type { FirebaseStateData, FirebaseStoreData } from './types';
import { sampleSize, shuffle } from 'lodash';
// Constants
import {
  DIGITS,
  INSTRUMENTOS_CODIFICADOS_PHASES,
  INSTRUMENTS,
  TOTAL_IMAGE_CARDS,
  TOTAL_ROUNDS,
} from './constants';
import { GAME_NAMES } from '../../utils/constants';
// Utils
import utils from '../../utils';
// Internal
import { buildCode, buildCodeFragment, buildTable } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param cards - Resource data
 */
export const prepareSetupPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  cards: PlainObject,
): Promise<SaveGamePayload> => {
  // Get 5 (4 regular rounds + 1 order round) themes
  const themes = sampleSize(Object.values(cards), TOTAL_ROUNDS);

  // Build final code
  const playerCount = utils.players.getPlayerCount(players);

  const passCodeOrders = shuffle(DIGITS);

  // Get each player's password fragment, add instrument
  utils.players.getListOfPlayers(players).forEach((player, index) => {
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
        players,
        code,
        codeLength: code.length,
        table,
      },
    },
  };
};

/**
 * Hint Giving phase - players give hints for code fragments
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareHintGivingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  const theme = store.themes[state.round.current];

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.HINT_GIVING,
        round: utils.game.increaseRound(state?.round, TOTAL_ROUNDS),
        players,
        theme,
      },
    },
  };
};

/**
 * Hint Receiving phase - players receive and review hints
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareHintReceivingPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.HINT_RECEIVING,
        players,
      },
    },
  };
};

/**
 * Guess The Code phase - players attempt to guess the code
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareGuessTheCodePhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE,
        players,
      },
    },
  };
};

/**
 * Solution phase - reveals the code and evaluates guesses
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareSolutionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players);

  // Save
  return {
    update: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GUESS_THE_CODE,
        players,
      },
    },
  };
};

/**
 * Game Over phase - determines winners and saves game data
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
  const winners = utils.players.determineWinners(players);

  await utils.firestore.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.INSTRUMENTOS_CODIFICADOS,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements: [],
    language: store.language,
  });

  return {
    set: {
      state: {
        phase: INSTRUMENTOS_CODIFICADOS_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        players,
      },
    },
  };
};
