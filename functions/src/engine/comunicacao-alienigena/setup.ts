// Constants
import {
  ATTRIBUTES,
  COMUNICACAO_ALIENIGENA_PHASES,
  ITEMS_COUNT,
  ITEM_TYPES,
  MAX_ROUNDS,
  TOTAL_GLYPHS,
  UNAVAILABLE_GLYPHS,
} from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  InquiryHistoryEntry,
  Item,
  OfferingsStatus,
  RequestHistoryEntry,
  Sign,
} from './types';
// Utils
import utils from '../../utils';
// Internal
import { getItems } from './helpers';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  utils.players.addPropertiesToPlayers(players, { pastOfferings: [], role: 'human' });

  // Determine turn order
  const playerCount = utils.players.getPlayerCount(players);

  const allGlyphs = utils.game.getRandomUniqueItems(
    utils.game.makeArray(TOTAL_GLYPHS, 1),
    UNAVAILABLE_GLYPHS,
    25
  );

  const items: Item[] = getItems(playerCount).map((itemType, index) => ({
    id: String(allGlyphs[index]),
    type: itemType,
    offerings: [],
  }));

  // Get random list of attributes and signs, then alphabetically order them
  const signs: Sign[] = utils.helpers.orderBy(
    utils.game.shuffle(utils.game.makeArray(ATTRIBUTES.length)).map((id, index) => ({
      attribute: ATTRIBUTES[id],
      signId: index,
    })),
    `attribute.${store.language}`,
    'asc'
  );

  // Save
  return {
    update: {
      players,

      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.SETUP,
        round: {
          current: 1,
          total: MAX_ROUNDS,
        },
        items,
        signs,
        inquiryHistory: [],
        requestHistory: [],
        status: {
          timeLeft: MAX_ROUNDS,
          needed: ITEMS_COUNT[playerCount].required,
          total: ITEMS_COUNT[playerCount].answers,
          found: 0,
          curses: {},
          totalCurses: ITEMS_COUNT[playerCount].curses,
        },
      },
    },
  };
};

export const prepareAlienSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION,
      },
      players,
    },
  };
};

export const prepareHumanAskPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Update alien
  if (state.round.current === 1) {
    players[state.alienId].role = 'alien';
  }

  // Save any inquiry to history
  const inquiryHistory = state.inquiryHistory as InquiryHistoryEntry[];
  if (state.currentInquiry && state.humanId) {
    inquiryHistory.push({
      answer: state.alienResponse,
      objectIds: state.currentInquiry,
      playerId: state.humanId,
    });
  }

  // Make player order if it doesn't exist
  const turnOrder =
    state.turnOrder ??
    utils.players.buildGameOrder(players).gameOrder.filter((playerId) => playerId !== state.alienId);

  // Unready current human player
  const humanId = utils.players.getNextPlayer(turnOrder, state.humanId ?? utils.game.getLastItem(turnOrder));
  utils.players.unReadyPlayer(players, humanId);

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.HUMAN_ASK,
        turnOrder,
        humanId,
        inquiryHistory,
        alienResponse: utils.firebase.deleteValue(),
        alienRequest: utils.firebase.deleteValue(),
        currentInquiry: utils.firebase.deleteValue(),
        wasCurseSelected: utils.firebase.deleteValue(),
        curses: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareAlienAnswerPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready alien player
  utils.players.unReadyPlayers(players, state.alienId);

  // Add player question to the state
  const currentInquiry = players[state.humanId].objectsIds ?? [];

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER,
        currentInquiry,
      },
      players,
    },
  };
};

export const prepareAlienRequestPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready alien player
  utils.players.unReadyPlayer(players, state.alienId);

  // Save any inquiry to history
  const inquiryHistory = state.inquiryHistory as InquiryHistoryEntry[];
  if (state.currentInquiry && state.humanId) {
    inquiryHistory.push({
      answer: state.alienResponse,
      objectIds: state.currentInquiry,
      playerId: state.humanId,
    });
  }

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST,
        inquiryHistory,
        alienResponse: utils.firebase.deleteValue(),
        currentInquiry: utils.firebase.deleteValue(),
        humanId: utils.firebase.deleteValue(),
      },
      players,
    },
  };
};

export const prepareOfferingsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready alien player
  utils.players.unReadyPlayers(players, state.alienId);

  // Save any inquiry to history
  const requestHistory = state.requestHistory as RequestHistoryEntry[];

  requestHistory.push({
    request: store.alienRequest,
    offers: [],
  });

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS,
        requestHistory,
      },
      players,
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  const status: OfferingsStatus = {
    ...state.status,
    timeLeft: state.status.timeLeft - 1,
  };

  const requestHistory = state.requestHistory as RequestHistoryEntry[];

  const items: Item[] = state.items;
  const offerings: Record<string, PlayerId[]> = {};
  const curses: Record<string, PlayerId[]> = {};
  utils.players.getListOfPlayers(players).forEach((player) => {
    const offering = items.find((i) => i.id === player.offeringId);
    if (offering) {
      requestHistory[requestHistory.length - 1].offers.push({
        playerId: player.id,
        objectId: offering.id,
      });

      if (offering.type === ITEM_TYPES.ITEM) {
        if (offerings[offering.id] === undefined) {
          offerings[offering.id] = [];
        }

        offerings[offering.id].push(player.id);
        status.found += 1;
        player.score += 1;
      }

      if (offering.type === ITEM_TYPES.CURSE) {
        if (curses[offering.id] === undefined) {
          curses[offering.id] = [];
        }

        curses[offering.id].push(player.id);
        player.score -= 1;
      }

      player.pastOfferings.push(offering.id);
      offering.offerings.push(player.id);
      offering.offered = true;
    }
  });

  // If anybody offered a curse, lose 1 time unit per curse (not offering)
  status.timeLeft -= Object.keys(curses).length;
  status.curses = {
    ...status.curses,
    ...curses,
  };

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.REVEAL,
        round,
        items,
        status,
        wasCurseSelected: Object.keys(curses).length > 0,
        offerings,
        curses,
        requestHistory,
      },
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
        phase: COMUNICACAO_ALIENIGENA_PHASES.GAME_OVER,
        round: state.round,
        gameEndedAt: Date.now(),
        winners,
        items: state.items,
        signs: state.signs,
        inquiryHistory: state.inquiryHistory,
        requestHistory: state.requestHistory,
        status: state.status,
      },
    },
  };
};
