import { isEmpty, shuffle, uniq } from 'lodash';
// Types
import type {
  FirebaseStateData,
  FirebaseStoreData,
  InquiryHistoryEntry,
  OfferingsStatus,
  RequestHistoryEntry,
  ResourceData,
  Seed,
} from './types';
// Constants
import { GAME_NAMES } from '../../constants/games';
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES } from './constants';
// Services
import { cleanupStore, markGameAsComplete } from '../../services/game-session';
import { saveGameToUsers } from '../../services/user';
// Tool Kits
import { type AlienAttribute, alienAttributesUtils, type AlienItem } from '../../tool-kits/alien-attributes';
// Mechanics
import {
  setPlayersReadyState,
  getListOfPlayers,
  getListOfPlayersIds,
  getPlayerCount,
  addPropertiesToPlayers,
  removePropertiesFromPlayers,
  cleanupPlayers,
} from '../../mechanics/players';
import { increaseRound } from '../../mechanics/round';
import { determineWinners } from '../../mechanics/scoring';
// Internal
import { dealItemsToPlayers } from '../../legacy-utils/legacy';
import {
  increaseAchievement,
  setTruthyAchievement,
  setupAchievements,
  calculateAchievements,
} from './achievements';
import { saveUsedItems } from './data';
import { applySeedsToAlienItemKnowledge, checkIsBot, cleanupKnownSpriteIds } from './helpers';

/**
 * Setup phase - initializes game state and resources
 * @param store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 * @param additionalData - Resource data
 */
export const prepareSetupPhase = async (
  store: FirebaseStoreData,
  _state: FirebaseStateData,
  players: Players,
  additionalData: ResourceData,
): Promise<SaveGamePayload> => {
  const hasBot = checkIsBot(store);

  addPropertiesToPlayers(players, { pastOfferings: [], role: 'human' });

  // Determine turn order
  const playerCount = getPlayerCount(players);

  const itemsInfo = ITEMS_COUNT[playerCount];

  const extraInfo: PlainObject = {};
  if (hasBot) {
    extraInfo.shouldPerformSeeding = true;
    extraInfo.alienId = '_a-bot';
    extraInfo.alienBot = true;
    players[extraInfo.alienId].role = 'alien';
  }
  if (store.options.debugMode) {
    extraInfo.debugMode = true;
  }

  const achievements = setupAchievements(getListOfPlayersIds(players));

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
        knownSpriteIds: [],
        ...extraInfo,
      },
    },
  };
};

/**
 * Alien Selection phase - players select who will be the alien
 * @param _store - The Firebase store data
 * @param _state - The Firebase state data
 * @param players - The players object
 */
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

/**
 * Alien Seeding phase - players seed unclear attribute values for items
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareAlienSeedingPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready players

  setPlayersReadyState(players, false, { excludeIds: [state.alienId] });

  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;

  const attributesWithUnclearValues = attributes.filter((attr) => {
    return items.some(
      (item) => item.attributes[attr.id] === alienAttributesUtils.ATTRIBUTE_VALUE_DICT.UNCLEAR.value,
    );
  });

  const playersCount = getPlayerCount(players, false);

  const quantityPerPlayer = Math.ceil(attributesWithUnclearValues.length / playersCount);
  dealItemsToPlayers(players, shuffle(attributesWithUnclearValues), quantityPerPlayer, 'seeds', true);

  // For each seed, give only items that have unclear values
  getListOfPlayers(players).forEach((player) => {
    const { seeds = [] } = player;
    const seedItems: Dictionary<Seed> = {};

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

/**
 * Human Ask phase - humans select items to inquire about
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareHumanAskPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;
  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;
  const currentInquiries: InquiryHistoryEntry[] = state.inquiries ?? [];
  const alienResponses: Dictionary<string> = state.alienResponses ?? {};

  if (state.shouldPerformSeeding) {
    applySeedsToAlienItemKnowledge(items, players);
    removePropertiesFromPlayers(players, ['seeds', 'alienSeeds']);
  }

  // Save any inquiry to history
  if (currentInquiries.length > 0 && !isEmpty(alienResponses)) {
    currentInquiries.forEach((inquiry) => {
      const response = alienResponses[inquiry.id];
      if (response) {
        inquiry.answer = response;
      }
    });

    inquiryHistory.unshift(...currentInquiries);
  }

  // Unready players
  setPlayersReadyState(players, false, { excludeIds: [state.alienId] });

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.HUMANS_ASKS,
        inquiryHistory,
        players,
        items,
        attributes,
      },
      stateCleanup: ['alienResponses', 'alienRequest', 'inquiries', 'shouldPerformSeeding'],
    },
  };
};

/**
 * Alien Answer phase - alien provides attribute response to human inquiry
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareAlienAnswerPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const hasBot = !!state.alienBot;
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;
  const round: Round = state.round;
  const knownSpriteIds: string[] = state.knownSpriteIds ?? [];
  const startingAttributesIds: string[] = state.startingAttributesIds;

  // Unready alien player
  setPlayersReadyState(players, false, { excludeIds: [state.alienId] });

  const humans = getListOfPlayers(players).filter((p) => p.role === 'human');

  const inquiries: InquiryHistoryEntry[] = [];

  const itemInquiryCounts: Dictionary<number> = {};

  humans.forEach((player) => {
    const objectIds: string[] = player.objectsIds ?? [];
    const suggestions = alienAttributesUtils
      .getBestAttributes(items, attributes, objectIds, startingAttributesIds)
      .slice(0, 3);

    const inquiry: InquiryHistoryEntry = {
      id: `${round.current}-${player.id}`,
      objectIds: objectIds,
      intention: player.intention ?? 'solid',
      playerId: player.id,
      // Help for the alien
      suggestions: suggestions.map((s) => s.id), // TODO: verify
      // These fields will be filled by the alien later
      answer: hasBot ? suggestions[0].spriteId : '',
      // Bot only
      assumption: hasBot ? suggestions[0].id : '',
    };
    inquiries.push(inquiry);

    if (hasBot) {
      knownSpriteIds.push(inquiry.answer);
    }

    if (inquiry.objectIds.length === 1) {
      // Achievement: Single Inquiry
      increaseAchievement(store.achievements, player.id, 'singleInquiry', 1);
    }

    // Achievement: Total objects
    increaseAchievement(store.achievements, player.id, 'objectInquiries', objectIds.length);

    // If bot, update alien knowledge based on the top suggestion
    if (hasBot && inquiry.answer) {
      const topSuggestion = suggestions[0];
      if (topSuggestion) {
        const attribute = attributes.find((attr) => attr.id === topSuggestion.id);
        if (attribute) {
          attribute.known = true;
        }
      }
    }

    // Update counts for each inquired item
    objectIds.forEach((objectId) => {
      if (!itemInquiryCounts[objectId]) {
        itemInquiryCounts[objectId] = 0;
      }
      itemInquiryCounts[objectId] += 1;
    });
  });

  // Update counts for each item
  items.forEach((item) => {
    const count = itemInquiryCounts[item.id] || 0;
    item.inquiries = (item.inquiries || 0) + count;
  });

  // Cleanup players
  removePropertiesFromPlayers(players, ['objectsIds', 'intention']);

  // Save
  return {
    update: {
      store: {
        achievements: store.achievements,
      },
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_ANSWER,
        inquiries,
        players,
        items,
        attributes,
        knownSpriteIds: cleanupKnownSpriteIds(knownSpriteIds, attributes, startingAttributesIds),
      },
    },
  };
};

/**
 * Alien Request phase - alien requests items from humans
 * @param _store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareAlienRequestPhase = async (
  _store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready alien player
  setPlayersReadyState(players, false, { excludeIds: [state.alienId] });

  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;
  const currentInquiries: InquiryHistoryEntry[] = state.inquiries ?? [];
  const alienResponses: Dictionary<string> = state.alienResponses ?? {};
  const knownSpriteIds: string[] = state.knownSpriteIds ?? {};

  // Save any inquiry to history
  if (currentInquiries.length > 0 && !isEmpty(alienResponses)) {
    currentInquiries.forEach((inquiry) => {
      const response = alienResponses[inquiry.id];
      if (response) {
        inquiry.answer = response;
        knownSpriteIds.push(response);
      }
    });

    inquiryHistory.unshift(...currentInquiries);
  }

  // Save
  return {
    update: {
      state: {
        phase: COMUNICACAO_ALIENIGENA_PHASES.ALIEN_REQUEST,
        inquiryHistory,
        players,
        knownSpriteIds: cleanupKnownSpriteIds(knownSpriteIds, state.attributes, state.startingAttributesIds),
      },
      stateCleanup: ['alienResponses'],
    },
  };
};

/**
 * Offerings phase - humans offer items to the alien based on request
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareOfferingsPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  // Unready alien player
  setPlayersReadyState(players, false, { excludeIds: [state.alienId] });

  const hasBot = !!state.alienBot;
  const items: AlienItem[] = state.items;
  const attributes: AlienAttribute[] = state.attributes;
  const inquiryHistory: InquiryHistoryEntry[] = state.inquiryHistory;
  const requestHistory: RequestHistoryEntry[] = state.requestHistory;
  const startingAttributesIds: string[] = state.startingAttributesIds;
  const currentInquiries: InquiryHistoryEntry[] = state.inquiries ?? [];

  // Since in a Bot Alien game the Alien Request phase is skipped, the inquiry must be saved here
  if (hasBot) {
    // No need to add answer since it is already prefilled for bot games
    if (currentInquiries.length > 0) {
      inquiryHistory.unshift(...currentInquiries);
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

    const recentlyInquiredItemsIds = uniq(currentInquiries.flatMap((inquiry) => inquiry.objectIds));
    const previouslyInquiredItemsIds = uniq([
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
      stateCleanup: ['alienResponses', 'inquiries'],
    },
  };
};

/**
 * Reveal phase - reveals whether offered items matched alien request
 * @param store - The Firebase store data
 * @param state - The Firebase state data
 * @param players - The players object
 */
export const prepareRevealPhase = async (
  store: FirebaseStoreData,
  state: FirebaseStateData,
  players: Players,
): Promise<SaveGamePayload> => {
  const round = increaseRound(state.round);
  const status: OfferingsStatus = {
    ...state.status,
    timeLeft: state.status.timeLeft - 1,
  };

  const items: AlienItem[] = state.items;
  const requestHistory: RequestHistoryEntry[] = state.requestHistory;

  const curses: Record<string, UID[]> = {};
  const found: Record<string, true> = {};
  getListOfPlayers(players).forEach((player) => {
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
            increaseAchievement(store.achievements, player.id, 'correct', 1);
          }

          if (offering.type === ITEM_TYPES.CURSE) {
            if (curses[offering.id] === undefined) {
              curses[offering.id] = [];
            }

            curses[offering.id].push(player.id);
            player.score -= 1;
            // Achievement: curse
            increaseAchievement(store.achievements, player.id, 'cursed', 1);
          }

          if (offering.type === ITEM_TYPES.BLANK) {
            // Achievement: blank
            increaseAchievement(store.achievements, player.id, 'blank', 1);
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

  setPlayersReadyState(players, false);

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
  const winners = determineWinners(players);
  const hasBot = checkIsBot(store);

  // Final achievements
  if (!hasBot) {
    setTruthyAchievement(store.achievements, state.alienId, 'alien');
  } else {
    getListOfPlayersIds(players).forEach((playerId) => {
      if (playerId !== state.alienId) {
        setTruthyAchievement(store.achievements, playerId, 'human');
      }
    });
  }

  const nonAlienPlayersIds = getListOfPlayersIds(players).filter((playerId) => playerId !== state.alienId);
  const hasMoreThanOneHuman = nonAlienPlayersIds.length > 1;

  const achievements = calculateAchievements(store.achievements, {
    objectInquiries: hasMoreThanOneHuman ? [] : nonAlienPlayersIds,
    singleInquiry: hasMoreThanOneHuman ? [] : nonAlienPlayersIds,
    correct: hasMoreThanOneHuman ? [] : nonAlienPlayersIds,
    blank: hasMoreThanOneHuman ? [] : nonAlienPlayersIds,
    cursed: hasMoreThanOneHuman ? [] : nonAlienPlayersIds,
  });

  await markGameAsComplete(gameId);

  await saveGameToUsers({
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

  cleanupPlayers(players, ['role', 'notes']);

  return {
    update: {
      storeCleanup: cleanupStore(store, []),
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
