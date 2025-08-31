// Constants
import { GAME_NAMES } from '../../utils/constants';
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES } from './constants';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  InquiryHistoryEntry,
  OfferingsStatus,
  RequestHistoryEntry,
  ResourceData,
} from './types';
// Utils
import utils from '../../utils';
import { applySeedsToAlienItemKnowledge, checkIsBot, getAchievements } from './helpers';
import { saveUsedItems } from './data';
import {
  type AlienAttribute,
  alienAttributesUtils,
  type AlienItem,
} from '../../utils/tool-kits/alien-attributes';

/**
 * Setup
 * Resets previous changes to the store
 * @returns
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const hasBot = checkIsBot(store);

  utils.players.addPropertiesToPlayers(players, { pastOfferings: [], role: 'human' });

  // Determine turn order
  const playerCount = utils.players.getPlayerCount(players);

  const itemsInfo = ITEMS_COUNT[playerCount];

  const extraInfo: PlainObject = {};
  if (hasBot) {
    extraInfo.shouldPerformSeeding = true;
    extraInfo.alienId = '_a-bot';
    extraInfo.alienBot = true;
  }
  if (store.options.debugMode) {
    extraInfo.debugMode = true;
  }

  const achievements = utils.achievements.setup(players, {
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
        phase: COMUNICACAO_ALIENIGENA_PHASES.SETUP,
        round: {
          current: 1,
          total: itemsInfo.rounds,
        },
        players,
        items: additionalData.items,
        attributes: additionalData.attributes,
        inquiryHistory: [],
        requestHistory: [],
        status: {
          timeLeft: itemsInfo.rounds,
          needed: itemsInfo.required,
          total: itemsInfo.answers,
          found: 0,
          curses: {},
          totalCurses: itemsInfo.curses,
        },
        startingAttributesIds: additionalData.startingAttributesIds,
        ...extraInfo,
      },
    },
  };
};

export const prepareAlienSelectionPhase = async (
  _store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
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
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players
  utils.players.unReadyPlayers(players, state.alienId);

  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;

  const attributesWithUnclearValues = attributes.filter((attr) => {
    return items.some(
      (item) => item.attributes[attr.id] === alienAttributesUtils.ATTRIBUTE_VALUE_DICT.UNCLEAR.value,
    );
  });

  const playersCount = utils.players.getPlayerCount(players, false);

  const quantityPerPlayer = Math.ceil(attributesWithUnclearValues.length / playersCount);
  utils.players.dealItemsToPlayers(
    players,
    utils.game.shuffle(attributesWithUnclearValues),
    quantityPerPlayer,
    'seeds',
  );

  // For each seed, give only items that have unclear values
  utils.players.getListOfPlayers(players).forEach((player) => {
    const { seeds = [] } = player;
    const seedItems = {};

    seeds.forEach((seed: AlienAttribute) => {
      items.forEach((item) => {
        if (item.attributes[seed.id] === alienAttributesUtils.ATTRIBUTE_VALUE_DICT.UNCLEAR.value) {
          if (seedItems[seed.id] === undefined) {
            seedItems[seed.id] = {
              attribute: seed,
              items: [],
            };
          }
          seedItems[seed.id].items.push(item);
        }
      });
    });

    player.seeds = seedItems;
  });

  // Save
  return {
    update: {
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
  players: Players,
): Promise<SaveGamePayload> => {
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;
  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;

  if (state.shouldPerformSeeding) {
    applySeedsToAlienItemKnowledge(items, players);
    utils.players.removePropertiesFromPlayers(players, ['seeds', 'alienSeeds']);
  }

  // Save any inquiry to history
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
        items,
        attributes,
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
  players: Players,
): Promise<SaveGamePayload> => {
  const hasBot = !!state.alienBot;
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;

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

  // In a Alien Bot game the suggestion is the alien response
  const suggestions = alienAttributesUtils.getBestAttributes(items, attributes, currentInquiry).slice(0, 3);
  const alienResponse = hasBot ? suggestions[0].spriteId : null;
  if (hasBot) {
    attributes.forEach((attr) => {
      if (attr.spriteId === alienResponse) {
        attr.known = true;
      }
    });
  }

  // Cleanup players
  utils.players.removePropertiesFromPlayers(players, ['objectsIds', 'intention']);

  // Added inquired count to each selected item
  currentInquiry.forEach((objectId) => {
    const item = items.find((i) => i.id === objectId);
    if (item) {
      item.inquiries = (item.inquiries ?? 0) + 1;
    }
  });

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER,
        currentInquiry,
        currentIntention,
        alienResponse,
        suggestions,
        players,
        items,
        attributes,
      },
    },
  };
};

export const prepareAlienRequestPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready alien player
  utils.players.unReadyPlayer(players, state.alienId);

  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;

  // Save any inquiry to history
  if (state.currentInquiry && state.humanId) {
    inquiryHistory.unshift({
      answer: state.alienResponse,
      objectIds: state.currentInquiry,
      playerId: state.humanId,
      intention: state.currentIntention ?? '',
      assumption: '',
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
      stateCleanup: ['alienResponse', 'currentInquiry', 'currentIntention', 'humanId', 'suggestions'],
    },
  };
};

export const prepareOfferingsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready alien player
  utils.players.unReadyPlayers(players, state.alienId);

  const hasBot = !!state.alienBot;
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;
  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;
  const requestHistory: RequestHistoryEntry[] = state.requestHistory;
  const suggestions: AlienAttribute[] = state.suggestions;
  const startingAttributesIds: string[] = state.startingAttributesIds;

  // Since in a Bot Alien game the Alien Request phase is skipped, the inquiry must be saved here

  if (state.alienBot) {
    // Save any inquiry to history
    if (state.currentInquiry && state.humanId) {
      inquiryHistory.unshift({
        answer: state.alienResponse,
        objectIds: state.currentInquiry,
        playerId: state.humanId,
        intention: state.currentIntention ?? '',
        assumption: hasBot ? suggestions[0].id : '',
      });
    }
  }

  // Add Alien Request
  if (hasBot) {
    // Check all items that are deterministic for any of the starting attributes and assume they were inquired before
    const deterministicStartingItems = items
      .filter((item) => {
        return (
          startingAttributesIds.filter((attrId) => {
            if (item.attributes[attrId] === alienAttributesUtils.ATTRIBUTE_VALUE_DICT.DETERMINISTIC.value) {
              return true;
            }
            return false;
          }).length > 0
        );
      })
      .map((item) => item.id);

    const recentlyInquiredItemsIds = state.currentInquiry ?? [];
    const previouslyInquiredItemsIds = utils.game.removeDuplicates([
      ...deterministicStartingItems,
      ...inquiryHistory.flatMap((entry) => entry.objectIds),
    ]);

    const request = alienAttributesUtils.getNonClashingItem(
      items,
      attributes,
      previouslyInquiredItemsIds,
      recentlyInquiredItemsIds,
    )[0];
    store.alienRequest = request.signature;
    store.intention = request.item.id;
  }

  // Save any inquiry to history
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
      stateCleanup: ['alienResponse', 'suggestions', 'currentInquiry', 'currentIntention', 'humanId'],
    },
  };
};

export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = utils.helpers.increaseRound(state.round);
  const status: OfferingsStatus = {
    ...state.status,
    timeLeft: state.status.timeLeft - 1,
  };

  const items: AlienItem[] = state.items;
  const requestHistory: RequestHistoryEntry[] = state.requestHistory;

  const curses: Record<string, PlayerId[]> = {};
  const found: Record<string, true> = {};
  utils.players.getListOfPlayers(players).forEach((player) => {
    const offeringsIds: string[] = player.offeringsIds ?? [];

    items
      .filter((i) => offeringsIds.includes(i.id))
      .forEach((offering) => {
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

          offering.offerings.push(player.id);
        }
      });
  });

  status.found += Object.keys(found).length;

  // If anybody offered a curse, lose 1 time unit per curse (not offering)
  status.timeLeft -= Object.keys(curses).length;
  status.curses = {
    ...status.curses,
    ...curses,
  };

  utils.players.unReadyPlayers(players);

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
  players: Players,
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
    state.alienId,
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
        attributes: state.attributes,
        startingAttributesIds: state.startingAttributesIds,
        inquiryHistory: state.inquiryHistory,
        requestHistory: state.requestHistory,
        status: state.status,
        alienId: state.alienId,
        alienBot: !!state.alienBot,
        achievements,
      },
    },
  };
};
