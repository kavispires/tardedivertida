// Constants
import { GAME_NAMES } from '../../utils/constants';
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES } from './constants';
// Types
import { AlienItem } from '../../types/tdr';
import type {
  ComunicacaoAlienigenaStore,
  FirebaseStateData,
  FirebaseStoreData,
  InquiryHistoryEntry,
  Item,
  ItemId,
  OfferingsStatus,
  RequestHistoryEntry,
  ResourceData,
  Sign,
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

  const extraInfo: BooleanDictionary = {};
  if (hasBot) {
    extraInfo.shouldPerformSeeding = true;
  }
  if (store.options.debugMode) {
    extraInfo.debugMode = true;
  }

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
        botAlienItemKnowledge: additionalData.botAlienItemKnowledge,
        botAlienSignKnowledge: {},
        achievements,
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.SETUP,
        round: {
          current: 1,
          total: itemsInfo.rounds,
        },
        players,
        alienId: hasBot ? '_a-bot' : utils.firestore.deleteValue(),
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
        // TODO: tell alien bot that these are known
        startingAttributes: additionalData.startingAttributes,
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

export const prepareAlienSeedingPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, state.alienId);

  const botAlienItemKnowledge: Collection<AlienItem> = store.botAlienItemKnowledge;

  // Tell alien about the starting attributes
  const startingAttributes: Sign[] = state.startingAttributes;
  const items: Item[] = state.items;
  const botAlienSignKnowledge = store.botAlienSignKnowledge as Record<string, ItemId[]>;
  items.forEach((item) => {
    startingAttributes.forEach((sign) => {
      const itemInfo = botAlienItemKnowledge[item.id];
      if (itemInfo.attributes[sign.key] > 1) {
        if (botAlienSignKnowledge[sign.key] === undefined) {
          botAlienSignKnowledge[sign.key] = [];
        }
        botAlienSignKnowledge[sign.key].push(item.id);
      }
    });
  });

  const alienItems: AlienItem[] = Object.values(botAlienItemKnowledge);

  // Distribute attributes to players to seed the alien information. Players will select objects they think match each attribute
  const signs: Sign[] = state.signs;

  const playersCount = utils.players.getPlayerCount(players);

  const quantityPerPlayer = Math.floor(signs.length / playersCount);
  utils.players.dealItemsToPlayers(players, utils.game.shuffle(signs), quantityPerPlayer, 'seeds');

  // For each seed, give only items that have -1 or 1 as values
  utils.players.getListOfPlayers(players).forEach((player) => {
    const { seeds = [] } = player;
    const seedItems = {};

    seeds.forEach((seed: Sign) => {
      alienItems.forEach((item) => {
        if ([-1, 0, 1].includes(item.attributes[seed.key])) {
          if (seedItems[seed.key] === undefined) {
            seedItems[seed.key] = {
              attribute: seed,
              items: [],
            };
          }
          seedItems[seed.key].items.push(item);
        }
      });
    });

    player.seeds = seedItems;
  });

  // Save
  return {
    update: {
      store: {
        botAlienSignKnowledge,
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
    applySeedsToAlienItemKnowledge(store, players);
    storeUpdate.store = {
      botAlienItemKnowledge: store.botAlienItemKnowledge,
    };

    utils.players.removePropertiesFromPlayers(players, ['seeds', 'seedItems']);
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
      intention: state.currentIntention ?? '',
      assumption: store.assumption ?? '?',
      confidence: store.confidence ?? 0,
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
      ...storeUpdate,
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.HUMAN_ASK,
        turnOrder,
        humanId,
        inquiryHistory,
        players,
      },
      stateCleanup: [
        'alienResponse',
        'alienRequest',
        'currentInquiry',
        'currentIntention',
        'shouldPerformSeeding',
      ],
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
  utils.players.unReadyPlayers(players, state.alienId);

  // Add player question to the state
  const currentInquiry = [...(players[state.humanId].objectsIds ?? [])];
  const currentIntention = players[state.humanId].intention ?? 'solid';

  // Achievement: Single Inquiry
  if (currentInquiry.length === 1) {
    utils.achievements.increase(store, state.humanId, 'singleInquiry', 1);
  }
  // Achievement: Total objects
  utils.achievements.increase(store, state.humanId, 'objectInquiries', currentInquiry.length);

  const alienResponse = hasBot
    ? determineAlienResponse(
        currentInquiry,
        store as ComunicacaoAlienigenaStore,
        state.signs,
        currentIntention
      )
    : utils.firestore.deleteValue();

  // Cleanup players
  utils.players.removePropertiesFromPlayers(players, ['objectsIds', 'intention']);

  // Added inquired count to each selected item
  currentInquiry.forEach((objectId) => {
    const item = (state.items as Item[]).find((i) => i.id === objectId);
    if (item) {
      item.inquired = (item.inquired ?? 0) + 1;
    }
  });

  let storeUpdate = {};
  if (hasBot) {
    storeUpdate = {
      botAlienSignKnowledge: store.botAlienSignKnowledge,
      assumption: store.assumption ?? '?',
      confidence: store.confidence ?? 0,
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
        currentIntention,
        alienResponse,
        players,
        items: state.items,
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
      intention: state.currentIntention ?? '',
      assumption: store.assumption ?? '',
      confidence: store.confidence ?? 0,
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
      stateCleanup: ['alienResponse', 'currentInquiry', 'currentIntention', 'humanId'],
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

  // Since in a Bot Alien game the Alien Request phase is skipped, the inquiry must be saved here
  const inquiryHistory = state.inquiryHistory as InquiryHistoryEntry[];
  if (state.alienBot) {
    // Save any inquiry to history
    if (state.currentInquiry && state.humanId) {
      inquiryHistory.unshift({
        answer: state.alienResponse,
        objectIds: state.currentInquiry,
        playerId: state.humanId,
        intention: state.currentIntention ?? '',
        assumption: store.assumption ?? '',
        confidence: store.confidence ?? 0,
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
      stateCleanup: ['alienResponse', 'currentInquiry', 'currentIntention', 'humanId'],
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
        turnOrder: state.turnOrder.reverse(),
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

  await utils.firestore.markGameAsComplete(gameId);

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
  await saveUsedItems(state.items);

  utils.players.cleanup(players, ['role']);

  return {
    update: {
      storeCleanup: utils.firestore.cleanupStore(store, []),
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
        startingAttributes: state.startingAttributes,
        status: state.status,
        alienId: state.alienId,
        isAlienBot: state.alienBot,
        achievements,
      },
    },
  };
};
