// Constants
import {
  ATTRIBUTES,
  COMUNICACAO_ALIENIGENA_ACHIEVEMENTS,
  COMUNICACAO_ALIENIGENA_PHASES,
  ITEMS_COUNT,
  ITEM_TYPES,
  TOTAL_ITEMS,
} from './constants';
import { AlienItem } from '../../types/tdr';
// Utils
import utils from '../../utils';
import {
  ComunicacaoAlienigenaAchievement,
  ComunicacaoAlienigenaState,
  ComunicacaoAlienigenaStore,
  FirebaseStoreData,
  Item,
  ItemId,
  Sign,
  SignKey,
} from './types';
import { SEPARATOR } from '../../utils/constants';

/**
 * Determine the next phase based on the current one
 * @param state
 * @param store
 * @returns
 */
export const determineNextPhase = (
  state: ComunicacaoAlienigenaState,
  store: ComunicacaoAlienigenaStore
): string => {
  const {
    RULES,
    SETUP,
    ALIEN_SELECTION,
    ALIEN_SEEDING,
    HUMAN_ASK,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  } = COMUNICACAO_ALIENIGENA_PHASES;
  const hasBot = checkIsBot(store);

  const order = [RULES, SETUP, ALIEN_SELECTION, HUMAN_ASK, ALIEN_ANSWER, ALIEN_REQUEST, OFFERINGS, REVEAL];

  const { phase: currentPhase, round, humanId, turnOrder, status, items } = state;

  if (currentPhase === REVEAL) {
    if (status && (status.timeLeft < 1 || items.every((item: Item) => item.offered))) {
      return GAME_OVER;
    }

    if (status && status.needed === status.found) {
      return GAME_OVER;
    }

    return round.forceLastRound ? GAME_OVER : HUMAN_ASK;
  }

  if (currentPhase === SETUP) {
    return hasBot ? ALIEN_SEEDING : ALIEN_SELECTION;
  }

  if (currentPhase === ALIEN_SEEDING) {
    return HUMAN_ASK;
  }

  // If the last player answer, go to alien request otherwise the next human
  // But if it's a bot alien game, skip alien request and go directly to offerings
  if (currentPhase === ALIEN_ANSWER && turnOrder) {
    const isLastHuman = turnOrder.indexOf(humanId) === turnOrder.length - 1;

    if (!isLastHuman) return HUMAN_ASK;

    return hasBot ? OFFERINGS : ALIEN_REQUEST;
  }

  const currentPhaseIndex = order.indexOf(currentPhase);

  if (currentPhaseIndex > -1) {
    return order[currentPhaseIndex + 1];
  }
  console.warn('Missing phase check');
  return HUMAN_ASK;
};

/**
 * Generates the 25 items getting the appropriate number of wanted items and cursed items
 * @param playerCount
 * @returns
 */
export const getItems = (playerCount: number) => {
  const counts = ITEMS_COUNT[playerCount];
  const answers = new Array(counts.answers).fill(ITEM_TYPES.ITEM);
  const cursers = new Array(counts.curses).fill(ITEM_TYPES.CURSE);
  const rest = new Array(TOTAL_ITEMS - counts.answers - counts.curses).fill(ITEM_TYPES.BLANK);
  return utils.game.shuffle([...answers, ...cursers, ...rest]);
};

/**
 * Check if game has an alien bot
 * @param store
 * @returns
 */
export const checkIsBot = (store: FirebaseStoreData) => Boolean(store?.options?.botAlien);

const PRIORITY_ORDER = [
  'food',
  'weapon',
  'plant',
  'valuable',
  'liquid',
  'clothes',
  'beautiful',
  'sharp',
  'human',
  'flight',
  'alive',
  'power',
  'warm',
  'sound',
  'machine',
  'knowledge',
  'bright',
  'round',
  'danger',
  'construction',
  'defense',
  'fast',
  'toy',
  'tool',
  'long',
  'metal',
  'odor',
  'old',
  'fragile',
  'multiple',
  'flat',
  'soft',
  'holdable',
  'personal',
  'heavy',
  'big',
  'solid',
];

/**
 * Determines the alien's response based on the current inquiry, store, and available signs.
 * @param currentInquiry - Array of item IDs in the current inquiry.
 * @param store - The communication store containing alien knowledge.
 * @param signs - Array of signs available for communication.
 * @returns The sign ID representing the alien's response.
 */
export const determineAlienResponse = (
  currentInquiry: string[],
  store: ComunicacaoAlienigenaStore,
  signs: Sign[],
  intention: string
) => {
  // Step 1: Calculate total weight of attributes in the current inquiry
  const totalWeights = calculateTotalWeights(currentInquiry, store.botAlienItemKnowledge);

  // Get the best match
  let bestMatch = getBestMatch(currentInquiry, store, signs, totalWeights, 1, false, intention);

  if (bestMatch) {
    return bestMatch;
  }

  // Retry without carrying about uniqueness
  bestMatch = getBestMatch(currentInquiry, store, signs, totalWeights, 2, true, intention);

  if (bestMatch) {
    return bestMatch;
  }

  // Recalculate totals with any values
  const totalWeightsAny = calculateTotalWeights(currentInquiry, store.botAlienItemKnowledge, true);

  // Retry without carrying only about positive values
  bestMatch = getBestMatch(currentInquiry, store, signs, totalWeightsAny, 3, false, intention);

  if (bestMatch) {
    return bestMatch;
  }

  // Retry without caring about anything
  bestMatch = getBestMatch(currentInquiry, store, signs, totalWeightsAny, 4, true, intention);

  if (bestMatch) {
    return bestMatch;
  }

  store.confidence = 0;
  return (
    signs.find((sign) => sign.key === intention)?.signId ??
    signs.find((sign) => sign.key === 'solid')?.signId ??
    signs[0].signId
  );
};

/**
 *
 * @param currentInquiry
 * @param store
 * @param signs
 * @param totalWeights
 * @param attempt
 * @returns
 */
const getBestMatch = (
  currentInquiry: string[],
  store: ComunicacaoAlienigenaStore,
  signs: Sign[],
  totalWeights: NumberDictionary,
  attempt: number,
  unique: boolean,
  intention: string
) => {
  // Step 2: Sort attributes by total weight and priority order
  const sortedAttributes = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([attributeA, weightA], [attributeB, weightB]) => {
      if (weightA === weightB) {
        const indexA = PRIORITY_ORDER.indexOf(attributeA);
        const indexB = PRIORITY_ORDER.indexOf(attributeB);

        return indexA - indexB;
      }

      return weightB - weightA;
    })
    // Remove any attribute that could be negative for any item
    .filter(([attribute]) => {
      return currentInquiry.every((itemId) => store.botAlienItemKnowledge[itemId].attributes[attribute] > 1);
    })
    // Get attribute key only
    .map(([attribute]) => attribute);

  // Step 3: If there is more than one item in the inquiry, filter only new attributes (that haven't been presented before)
  const topMatch = sortedAttributes[0];
  const uniqueMatches = getArrayUniqueness(sortedAttributes, Object.keys(store.botAlienSignKnowledge));
  const uniqueMatch = uniqueMatches[0];
  const useTopMatch = !unique || totalWeights[topMatch] > (uniqueMatch ? totalWeights[uniqueMatch] : 0);

  // Step 4: Determine the best matching attribute
  const bestMatch = useTopMatch ? topMatch : uniqueMatch;

  // Step 5: Find the matching sign for the best attribute
  const matchingSign = signs.find((sign) => sign.key === bestMatch);

  const wasAttributePresentedBefore = !!store.botAlienSignKnowledge[matchingSign?.key ?? ''];

  // Step 6: Update knowledge if a positive match is found
  if (matchingSign?.key) {
    if (store.botAlienSignKnowledge[matchingSign.key] === undefined) {
      store.botAlienSignKnowledge[matchingSign.key] = [];
    }

    store.botAlienSignKnowledge[matchingSign.key] = [
      ...store.botAlienSignKnowledge[matchingSign.key],
      ...currentInquiry,
    ];
  }

  const result = matchingSign?.signId ?? '';

  // Step 7: If a positive match is found, update assumptions and return the result
  store.assumption = '?';
  if (result) {
    store.assumption = signs.find((sign) => sign.signId === result)?.key ?? '?';
    // Determine the base points for the match (minimum 5 points per item)
    const matchBasePoints = currentInquiry.length * 5;
    store.confidence = Math.round((100 * totalWeights[bestMatch]) / matchBasePoints);
    if (wasAttributePresentedBefore) {
      store.confidence = store.confidence / 1.25;
    }
    store.confidence = Math.round(store.confidence / attempt);

    // If it is different than the intention, reduce confidence
    if (result !== intention) {
      store.confidence = store.confidence / 2;
    }

    return result;
  }
};

/**
 * Calculate the total weights for a set of items for each attribute
 * @param itemIds
 * @param botAlienItemKnowledge
 * @returns
 */
export const calculateTotalWeights = (
  itemIds: ItemId[],
  botAlienItemKnowledge: Record<string, AlienItem>,
  anyValue?: boolean
) => {
  const totalWeights: NumberDictionary = {};

  itemIds.forEach((itemId) => {
    const item = botAlienItemKnowledge[itemId];
    Object.entries(item.attributes).forEach(([attribute, weight]) => {
      if (totalWeights[attribute] === undefined) {
        totalWeights[attribute] = 0;
      }
      if (anyValue) {
        totalWeights[attribute] += weight;
        // Ignore "-3" as they don't necessarily negate and might just mean not relevant
      } else if (weight > -3 || weight === -5) {
        totalWeights[attribute] += weight;
      }
    });
  });

  return totalWeights;
};

/**
 * Calculates the usage of attributes for a list of items. It prioritizes 5s and -5s
 * @param items
 * @returns
 */
export const calculateAttributeUsage = (items: AlienItem[]) => {
  const fiveUsage: NumberDictionary = {};
  const totalUsage: NumberDictionary = {};

  items.forEach((item) => {
    Object.entries(item.attributes).forEach(([attribute, weight]) => {
      if (!ATTRIBUTES[attribute]) {
        return;
      }
      // Count any fives
      if (weight === 5) {
        if (fiveUsage[attribute] === undefined) {
          fiveUsage[attribute] = 5;
        }

        fiveUsage[attribute] += 1;
      }

      // Count other weights
      if (totalUsage[attribute] === undefined) {
        totalUsage[attribute] = 0;
      }

      totalUsage[attribute] +=
        {
          '-5': 2,
          '-3': 0,
          '-1': 0,
          '1': 0,
          3: 3,
        }?.[weight] ?? 0;
    });
  });

  const fiveAttributes = Object.entries(fiveUsage)
    // Sort counts by total count of useful values
    .sort(([, countA], [, countB]) => countB - countA)
    // Get attribute name only
    .map(([attribute]) => attribute);

  const otherAttributes = Object.entries(totalUsage)
    // Sort counts by total count of useful values
    .sort(([, countA], [, countB]) => countB - countA)
    // Get attribute name only
    .map(([attribute]) => attribute);

  return (
    utils.game
      .removeDuplicates([...fiveAttributes, ...otherAttributes])
      // Get only the necessary
      .slice(0, TOTAL_ITEMS)
  );
};

/**
 * Integrate players seeds into the bot knowledge
 */
export function applySeedsToAlienItemKnowledge(store: FirebaseStoreData, players: Players) {
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.alienSeeds) {
      Object.entries(player.alienSeeds).forEach(([itemAttributeKey, value]) => {
        const [itemId, attributeKey] = itemAttributeKey.split(SEPARATOR);
        if (store.botAlienItemKnowledge[itemId]) {
          store.botAlienItemKnowledge[itemId].attributes[attributeKey] = value;
        }
      });
    }
  });
}

/**
 * Determines the alien's request based on the current state of the game.
 * @param store - The store containing the bot's knowledge of the game.
 * @param signs - The list of all available signs.
 * @param  items - The list of all available items.
 * @returns An object containing the alien's request and intention.
 */
export function determineAlienRequest(store: ComunicacaoAlienigenaStore, signs: Sign[], items: Item[]) {
  // Step 1: Count the occurrences of each item in the bot's knowledge of signs
  const itemsWithInformationDict = Object.values(store.botAlienSignKnowledge).reduce(
    (acc: NumberDictionary, itemIds) => {
      itemIds.forEach((itemId) => {
        if (acc[itemId] === undefined) {
          acc[itemId] = 0;
        }

        acc[itemId] += 1;
      });

      return acc;
    },
    {}
  );

  // Step 2: Sort items by the number of occurrences in the bot's knowledge
  const itemsWithInformation = getKeysSortedByValue(itemsWithInformationDict);

  const knownSigns = Object.keys(store.botAlienSignKnowledge);

  // Step 3: Get needed items that haven't been offered and sort them by priority
  const neededItems = sortArrayByPriority(
    items.filter((item) => !item.offered && item.type === 'ITEM').map((e) => e.id),
    itemsWithInformation
  ).map((id) => store.botAlienItemKnowledge[id]);

  // Step 4: Get cursed items that haven't been offered and shuffle them
  const cursedItems = utils.game
    .shuffle(items.filter((item) => !item.offered && item.type === 'CURSE'))
    .map((e) => e.id)
    .map((id) => store.botAlienItemKnowledge[id]);

  // Step 5: For each needed item, find the best attributes sorted by specific weight
  const bestAttributesDict: string[][] = [];
  neededItems.forEach((neededItem) => {
    bestAttributesDict.push(sortItemAttributesBySpecificWeight(neededItem, knownSigns));
  });

  // Step 6: For each cursed item, find the best attributes sorted by specific weight
  const bestCursedAttributesDict: string[][] = [];
  cursedItems.forEach((cursedItem) => {
    bestCursedAttributesDict.push(sortItemAttributesBySpecificWeight(cursedItem, knownSigns));
  });

  // Step 7: Create a dictionary to map sign keys to sign IDs
  const signKeyIdDict = signs.reduce((acc, sign) => {
    acc[sign.key] = sign.signId;
    acc[`!${sign.key}`] = `!${sign.signId}`;
    acc[`+${sign.key}`] = `+${sign.signId}`;
    return acc;
  }, {});

  // Step 8: Check for matching attributes between needed and cursed items
  for (let i = 0; i < bestAttributesDict.length; i++) {
    const needList = bestAttributesDict[i];
    const isMatched = bestCursedAttributesDict.some((cursedList) => {
      return needList.every((attr) => cursedList.includes(attr));
    });

    // Step 9: If no match is found, return the request and intention
    if (!isMatched) {
      return {
        request: needList.map((attributeKey) => signKeyIdDict[attributeKey]),
        intention: neededItems[i].id,
      };
    }
  }

  return {
    request: bestAttributesDict[0].map((attributeKey) => signKeyIdDict[attributeKey]),
    intention: neededItems[0].id,
  };
}

/**
 * Sorts an item's attributes by specific weights and returns a list of up to 5 known attributes,
 * marked with a '!' prefix if they have a negative weight.
 *
 * @param item - The item to sort and filter the attributes of.
 * @param knownSigns - The list of known attributes to filter the result by.
 * @returns The list of up to 5 attributes sorted by weight and filtered by the known attributes.
 */
function sortItemAttributesBySpecificWeight(item: AlienItem, knownSigns: SignKey[]) {
  const order = [5, 3, -5, 1, -3, -1];
  const keys = Object.keys(item.attributes);

  // Sort the keys by their values according to the order
  keys.sort((a, b) => {
    const valueA = item.attributes[a];
    const valueB = item.attributes[b];

    const indexA = order.indexOf(valueA);
    const indexB = order.indexOf(valueB);

    return indexA - indexB;
  });
  // Only include known signs and ignore -1 values
  return keys
    .filter((attribute) => knownSigns.includes(attribute) && item.attributes[attribute] !== -1)
    .map((attr) => {
      const weight = item.attributes[attr];
      if (weight && weight < 0) {
        return `!${attr}`;
      } else if (weight && weight === 5) {
        return `+${attr}`;
      } else {
        return attr;
      }
    })
    .slice(0, 5);
}

/**
 * Returns a list of strings that are in the first list but not in the second.
 * @param list
 * @param used
 * @returns
 */
function getArrayUniqueness(list: string[], used: string[]) {
  return list.filter((item) => !used.includes(item));
}

/**
 * Sorts an array of strings based on a priority list.
 *
 * @param arr The array to be sorted
 * @param priorityList The priority list to use for sorting
 * @returns The sorted array
 */
function sortArrayByPriority(arr: string[], priorityList: string[]): string[] {
  // Create a new array to store the sorted strings
  const sortedArr: string[] = [];

  // Loop through the priority list
  for (let i = 0; i < priorityList.length; i++) {
    // Loop through the original array to find matching strings
    for (let j = 0; j < arr.length; j++) {
      // If the string in the original array matches the current priority string
      if (arr[j] === priorityList[i]) {
        // Add it to the sorted array
        sortedArr.push(arr[j]);
        // Remove the string from the original array to prevent duplicates
        arr.splice(j, 1);
        // Decrement j since we just removed an element
        j--;
      }
    }
  }

  // Add any remaining strings from the original array to the end of the sorted array
  sortedArr.push(...arr);

  return sortedArr;
}

/**
 * Returns a list of sorted keys in a `Record<string, number>` by value,
 * returning the keys in order from largest to smallest value number.
 * @param dict The dictionary to sort.
 * @returns An array of keys sorted by value in descending order.
 */
function getKeysSortedByValue(dict: Record<string, number>): string[] {
  return Object.keys(dict).sort((a, b) => dict[b] - dict[a]);
}

/**
 * Get achievements
 * @param store
 */
export const getAchievements = (
  store: FirebaseStoreData,
  hasBot: boolean,
  playerCount: number,
  alienId: PlayerId
) => {
  const achievements: Achievement<ComunicacaoAlienigenaAchievement>[] = [];

  if (!hasBot) {
    utils.achievements.increase(store, alienId, 'alien', 1);
  }

  const validAchievement = hasBot ? playerCount > 1 : playerCount > 2;

  const ineligiblePlayers = !hasBot ? [alienId] : [];

  const { most: mostObjects, least: fewestObjects } = utils.achievements.getMostAndLeastOf(
    store,
    'objectInquiries',
    ineligiblePlayers
  );
  // Most Objects: used the most number of objects during inquiries
  if (mostObjects && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_QUESTIONED_OBJECTS,
      playerId: mostObjects.playerId,
      value: mostObjects.value,
    });
  }

  // Fewest Objects: used the fewest number of objects during inquiries
  if (fewestObjects && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.FEWEST_QUESTIONED_OBJECTS,
      playerId: fewestObjects.playerId,
      value: fewestObjects.value,
    });
  }

  // Most correct: guesses the correct objects more times
  const { most: correct } = utils.achievements.getMostAndLeastOf(store, 'correct', ineligiblePlayers);
  if (correct && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_CORRECT_OBJECTS,
      playerId: correct.playerId,
      value: correct.value,
    });
  }

  // Most cursed: guesses the cursed objects more times
  const { most: cursed } = utils.achievements.getMostAndLeastOf(store, 'cursed', ineligiblePlayers);
  if (cursed && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_CURSED_OBJECTS,
      playerId: cursed.playerId,
      value: cursed.value,
    });
  }

  // Most blank: guesses the blank objects more times
  const { most: blank } = utils.achievements.getMostAndLeastOf(store, 'blank', ineligiblePlayers);
  if (blank && validAchievement) {
    achievements.push({
      type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.MOST_BLANK_OBJECTS,
      playerId: blank.playerId,
      value: blank.value,
    });
  }

  if (!hasBot) {
    // Players as alien
    const { most: alien } = utils.achievements.getMostAndLeastOf(store, 'alien');
    if (alien) {
      achievements.push({
        type: COMUNICACAO_ALIENIGENA_ACHIEVEMENTS.PLAYED_AS_ALIEN,
        playerId: alien.playerId,
        value: alien.value,
      });
    }
  }

  return achievements;
};
