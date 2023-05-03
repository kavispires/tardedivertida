// Constants
import { GAME_NAMES } from '../../utils/constants';
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES } from './constants';
// Types
import type {
  ComunicacaoAlienigenaStore,
  FirebaseStateData,
  FirebaseStoreData,
  InquiryHistoryEntry,
  Item,
  OfferingsStatus,
  RequestHistoryEntry,
  ResourceData,
} from './types';
// Utils
import utils from '../../utils';
import { checkIsBot, determineAlienRequest, determineAlienResponse } from './helpers';
import { saveUsedItems } from './data';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData
): Promise<SaveGamePayload> => {
  const hasBot = checkIsBot(store);

  utils.players.addPropertiesToPlayers(players, { pastOfferings: [], role: 'human' });

  if (hasBot) {
    utils.players.addBots(players, 1, { role: 'alien' });
  }

  // Determine turn order
  const playerCount = utils.players.getPlayerCount(players);

  const itemsInfo = ITEMS_COUNT[playerCount];

  // Save
  return {
    update: {
      store: {
        botAlienItemKnowledge: additionalData.botAlienItemKnowledge,
        botAlienSignKnowledge: {},
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.SETUP,
        round: {
          current: 1,
          total: itemsInfo.rounds,
        },
        players,
        alienId: hasBot ? '_a-bot' : utils.firebase.deleteValue(),
        items: additionalData.items,
        signs: additionalData.signs,
        inquiryHistory: [],
        requestHistory: [],
        alienBot: hasBot,
        status: {
          timeLeft: itemsInfo.rounds,
          needed: itemsInfo.required,
          total: itemsInfo.answers,
          found: 0,
          curses: {},
          totalCurses: itemsInfo.curses,
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
        players,
      },
    },
  };
};

export const prepareHumanAskPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Update alien
  if (!state.alienBot && state.round.current === 1) {
    players[state.alienId].role = 'alien';
  }

  // Save any inquiry to history
  const inquiryHistory = state.inquiryHistory as InquiryHistoryEntry[];
  if (
    state.currentInquiry &&
    state.humanId &&
    utils.game.getLastItem(state.turnOrder ?? []) !== state.humanId
  ) {
    inquiryHistory.unshift({
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
        players,
      },
      stateCleanup: ['alienResponse', 'alienRequest', 'currentInquiry'],
    },
  };
};

export const prepareAlienAnswerPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const hasBot = checkIsBot(store);

  // Unready alien player
  utils.players.unReadyPlayers(players, hasBot ? undefined : state.alienId);

  // Add player question to the state
  const currentInquiry = players[state.humanId].objectsIds ?? [];

  const alienResponse = hasBot
    ? determineAlienResponse(currentInquiry, store as ComunicacaoAlienigenaStore, state.signs)
    : utils.firebase.deleteValue();

  let storeUpdate = {};
  if (hasBot) {
    storeUpdate = {
      store: {
        botAlienSignKnowledge: store.botAlienSignKnowledge,
      },
    };
  }

  // Save
  return {
    update: {
      ...storeUpdate,
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER,
        currentInquiry,
        alienResponse,
        players,
      },
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
    inquiryHistory.unshift({
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
        players,
      },
      stateCleanup: ['alienResponse', 'currentInquiry', 'humanId'],
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

  // Since in a Bot Alien game the Alien Request phase is skit, the inquiry must be saved here
  const inquiryHistory = state.inquiryHistory as InquiryHistoryEntry[];
  if (state.alienBot) {
    // Save any inquiry to history
    if (state.currentInquiry && state.humanId) {
      inquiryHistory.unshift({
        answer: state.alienResponse,
        objectIds: state.currentInquiry,
        playerId: state.humanId,
      });
    }
  }

  // Add Alien Request
  if (state.alienBot) {
    const request = determineAlienRequest(store as ComunicacaoAlienigenaStore, state.signs, state.items);
    store.alienRequest = request.request;
    store.intention = request.intention;
  }

  // Save any inquiry to history
  const requestHistory = state.requestHistory as RequestHistoryEntry[];

  requestHistory.unshift({
    request: store.alienRequest,
    offers: [],
    intention: store.intention ?? null,
  });

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.OFFERINGS,
        requestHistory,
        inquiryHistory,
        players,
      },
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
  const curses: Record<string, PlayerId[]> = {};
  const found: Record<string, true> = {};
  utils.players.getListOfPlayers(players).forEach((player) => {
    const offering = items.find((i) => i.id === player.offeringId);
    if (offering) {
      requestHistory[0].offers.push({
        playerId: player.id,
        objectId: offering.id,
      });

      if (offering.type === ITEM_TYPES.ITEM) {
        found[offering.id] = true;
        player.score += 3;
      }

      if (offering.type === ITEM_TYPES.CURSE) {
        if (curses[offering.id] === undefined) {
          curses[offering.id] = [];
        }

        curses[offering.id].push(player.id);
        player.score -= 1;
      }

      player.pastOfferings.push(offering.id);

      offering.offered = true;
    }
  });

  status.found += Object.keys(found).length;

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
        players,
        items,
        status,
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

  await saveUsedItems(utils.helpers.buildIdDictionary(state.items));

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.COMUNICACAO_ALIENIGENA,
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
        phase: COMUNICACAO_ALIENIGENA_PHASES.GAME_OVER,
        round: state.round,
        players,
        gameEndedAt: Date.now(),
        winners,
        items: state.items,
        signs: state.signs,
        inquiryHistory: state.inquiryHistory,
        requestHistory: state.requestHistory,
        status: state.status,
        alienId: state.alienId,
        isAlienBot: state.alienBot,
      },
    },
  };
};
