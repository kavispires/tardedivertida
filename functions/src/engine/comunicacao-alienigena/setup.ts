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
import {
  applySeedsToAlienItemKnowledge,
  checkIsBot,
  determineAlienRequest,
  determineAlienResponse,
  getAchievements,
} from './helpers';
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

  // Determine turn order
  const playerCount = utils.players.getPlayerCount(players);

  const itemsInfo = ITEMS_COUNT[playerCount];

  const extraInfo: PlainObject = {};
  if (hasBot) {
    extraInfo.shouldPerformSeeding = true;
  }

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
        ...extraInfo,
      },
    },
  };
};

export const prepareAlienSelectionPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    objectInquiries: 0,
    singleInquiry: 0,
    correct: 0,
    cursed: 0,
    blank: 0,
    alien: 0,
  });

  // Save
  return {
    update: {
      store: {
        achievements,
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SELECTION,
        players,
      },
    },
  };
};

export const prepareAlienSeedingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  const achievements = utils.achievements.setup(players, store, {
    objectInquiries: 0,
    singleInquiry: 0,
    correct: 0,
    cursed: 0,
    blank: 0,
    alien: 0,
  });

  // Distribute attributes to players to seed the alien information. Players will select objects they think match each attribute
  const signs = state.signs as string[];
  const playersCount = utils.players.getPlayerCount(players);
  const quantityPerPlayer = Math.floor(signs.length / playersCount);
  utils.players.dealItemsToPlayers(players, utils.game.shuffle(signs), quantityPerPlayer, 'seeds');

  utils.players.unReadyPlayers(players, state.alienId);

  // Save
  return {
    update: {
      store: {
        achievements,
        alienSeeds: {},
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_SEEDING,
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
  const storeUpdate: PlainObject = {};
  if (state.shouldPerformSeeding) {
    applySeedsToAlienItemKnowledge(store, players, state.items as Item[]);
    storeUpdate.store = {
      botAlienItemKnowledge: store.botAlienItemKnowledge,
    };
    utils.players.removePropertiesFromPlayers(players, ['seeds']);
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

  utils.players.readyPlayers(players, humanId);

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
      ...storeUpdate,
      stateCleanup: ['alienResponse', 'alienRequest', 'currentInquiry'],
      storeCleanup: ['alienSeeds'],
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

  // Achievement: Single Inquiry
  if (currentInquiry.length === 1) {
    utils.achievements.increase(store, state.humanId, 'singleInquiry', 1);
  }
  // Achievement: Total objects
  utils.achievements.increase(store, state.humanId, 'objectInquiries', currentInquiry.length);

  const alienResponse = hasBot
    ? determineAlienResponse(currentInquiry, store as ComunicacaoAlienigenaStore, state.signs)
    : utils.firebase.deleteValue();

  let storeUpdate = {};
  if (hasBot) {
    storeUpdate = {
      botAlienSignKnowledge: store.botAlienSignKnowledge,
    };
  }

  // Save
  return {
    update: {
      store: {
        ...storeUpdate,
        achievements: store.achievements,
      },
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
        // Achievement: correct
        utils.achievements.increase(store, player.id, 'correct', 1);
      }

      if (offering.type === ITEM_TYPES.CURSE) {
        if (curses[offering.id] === undefined) {
          curses[offering.id] = [];
        }

        curses[offering.id].push(player.id);
        player.score -= 1;
        // Achievement: curse
        utils.achievements.increase(store, player.id, 'cursed', 1);
      }

      if (offering.type === ITEM_TYPES.BLANK) {
        // Achievement: blank
        utils.achievements.increase(store, player.id, 'blank', 1);
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
      store: {
        achievements: store.achievements,
      },
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
  const hasBot = checkIsBot(store);
  if (!hasBot) {
    utils.achievements.increase(store, state.alienId, 'alien', 1);
  }

  const achievements = getAchievements(
    store,
    hasBot,
    utils.players.getListOfPlayers(players).length,
    state.alienId
  );

  await utils.firebase.markGameAsComplete(gameId);

  await utils.user.saveGameToUsers({
    gameName: GAME_NAMES.COMUNICACAO_ALIENIGENA,
    gameId,
    startedAt: store.createdAt,
    players,
    winners,
    achievements,
    language: store.language,
  });

  // Save data (alien items)
  await saveUsedItems(utils.helpers.buildIdDictionary(state.items));

  utils.players.cleanup(players, ['role']);

  return {
    update: {
      storeCleanup: utils.firebase.cleanupStore(store, []),
    },
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
        achievements,
      },
    },
  };
};
