// Constants
import {
  COMUNICACAO_ALIENIGENA_ACHIEVEMENTS,
  COMUNICACAO_ALIENIGENA_PHASES,
  ITEMS_COUNT,
  ITEM_TYPES,
  TOTAL_ITEMS,
} from './constants';
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

/**
 * Generates the Alien response when a player asks about a set of items
 * @param currentInquiry
 * @param store
 * @param signs
 * @returns the attributes related to the set of items
 */
export const determineAlienResponse = (
  currentInquiry: string[],
  store: ComunicacaoAlienigenaStore,
  signs: Sign[]
) => {
  // Calculate total weight of attributes in current inquiry
  const totalWeights = calculateTotalWeights(currentInquiry, store.botAlienItemKnowledge);
  //
  const sortedAttributes = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([, weightA], [, weightB]) => weightB - weightA)
    // Remove any attribute that could be negative for any item
    .filter(([attribute]) => {
      return currentInquiry.every((itemId) => store.botAlienItemKnowledge[itemId].attributes[attribute] > 0);
    })
    // Get attribute name only
    .map(([attribute]) => attribute);

  // Filter only attributes that will be new to players, however, if only one item, return the best one
  let uniqueMatches =
    currentInquiry.length > 1
      ? getArrayUniqueness(sortedAttributes, Object.keys(store.botAlienSignKnowledge))
      : [];

  let bestMatch = uniqueMatches?.[0] ?? sortedAttributes[0];

  let matchingSign = signs.find((sign) => sign.key === bestMatch);

  // Save that the humans know about this sign now
  if (matchingSign?.key) {
    if (store.botAlienSignKnowledge[matchingSign.key] === undefined) {
      store.botAlienSignKnowledge[matchingSign.key] = [];
    }

    store.botAlienSignKnowledge[matchingSign.key] = [
      ...store.botAlienSignKnowledge[matchingSign.key],
      ...currentInquiry,
    ];
  }

  let result = matchingSign?.signId ?? '';

  if (result) {
    return result;
  }

  // If no positive attribute is found, try the most known negative
  const sortedAttributesReverse = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([, weightA], [, weightB]) => weightA - weightB)
    // Remove any attribute that could be negative for any item
    .filter(([attribute]) => {
      return currentInquiry.every((itemId) => store.botAlienItemKnowledge[itemId].attributes[attribute] < 0);
    })
    // Get attribute name only
    .map(([attribute]) => attribute);

  // Filter only attributes that will be new to players, however, if only one item, return the best one
  uniqueMatches =
    currentInquiry.length > 1
      ? getArrayUniqueness(sortedAttributesReverse, Object.keys(store.botAlienSignKnowledge))
      : [];

  bestMatch = uniqueMatches?.[0] ?? sortedAttributesReverse[0];

  matchingSign = signs.find((sign) => sign.key === bestMatch);

  result = matchingSign?.signId ?? '';

  if (result) {
    return result;
  }

  // If still there's no good icon, respond with the best one regardless if every one is positive
  const sortedAttributesAny = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([, weightA], [, weightB]) => weightA - weightB)
    // Get attribute name only
    .map(([attribute]) => attribute);
  bestMatch = sortedAttributesAny[0];

  matchingSign = signs.find((sign) => sign.key === bestMatch);

  return matchingSign?.signId ?? '?';
};

/**
 * Calculate the total eights for a set of items for each attribute
 * @param itemIds
 * @param botAlienItemKnowledge
 * @returns
 */
export const calculateTotalWeights = (
  itemIds: ItemId[],
  botAlienItemKnowledge: Record<string, AlienItem>
) => {
  const totalWeights: NumberDictionary = {};

  itemIds.forEach((itemId) => {
    const item = botAlienItemKnowledge[itemId];
    Object.entries(item.attributes).forEach(([attribute, weight]) => {
      if (totalWeights[attribute] === undefined) {
        totalWeights[attribute] = 0;
      }
      totalWeights[attribute] += weight;
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
          '-3': 1,
          '-1': 0,
          '1': 1,
          3: 2,
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
export function applySeedsToAlienItemKnowledge(store: FirebaseStoreData, players: Players, items: Item[]) {
  utils.players.getListOfPlayers(players).forEach((player) => {
    if (player.alienSeeds) {
      Object.entries(player.alienSeeds).forEach(([attributeKey, itemsSeeds]) => {
        const selectedItems = itemsSeeds as string[];
        const notSelectedItems = items
          .filter((item) => !selectedItems.includes(item.id))
          .map((item) => item.id);

        // For selected items, make any selected attribute a 3 (or keep it as 5 if already 5)
        selectedItems.forEach((itemId) => {
          if (store.botAlienItemKnowledge[itemId]) {
            const value = store.botAlienItemKnowledge[itemId].attributes[attributeKey] ?? 0;
            if (store.botAlienItemKnowledge[itemId].attributes[attributeKey] !== undefined) {
              if (value < 5) {
                store.botAlienItemKnowledge[itemId].attributes[attributeKey] = 3;
              }
            }
          }
        });

        // For not selected items, make any selected attribute a -3 (or keep it as -5 if already -5)
        notSelectedItems.forEach((itemId) => {
          if (store.botAlienItemKnowledge[itemId]) {
            const value = store.botAlienItemKnowledge[itemId].attributes[attributeKey] ?? 0;
            if (store.botAlienItemKnowledge[itemId].attributes[attributeKey] !== undefined) {
              if (value === 5) {
                store.botAlienItemKnowledge[itemId].attributes[attributeKey] = 3;
              }
              if (value === 3) {
                store.botAlienItemKnowledge[itemId].attributes[attributeKey] = 1;
              }
              if (value < 3 && value !== -5) {
                store.botAlienItemKnowledge[itemId].attributes[attributeKey] = -3;
              }
            }
          }
        });
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

  const itemsWithInformation = getKeysSortedByValue(itemsWithInformationDict);

  const knownSigns = Object.keys(store.botAlienSignKnowledge);

  // Get all needed items that haven't been offered
  const neededItemsIds = sortArrayByPriority(
    items.filter((item) => !item.offered && item.type === 'ITEM').map((e) => e.id),
    itemsWithInformation
  );

  const neededItems = neededItemsIds.map((id) => store.botAlienItemKnowledge[id]);

  // Get all cursed items that haven't been offered
  const cursedItems = utils.game
    .shuffle(items.filter((item) => !item.offered && item.type === 'CURSE'))
    .map((e) => e.id)
    .map((id) => store.botAlienItemKnowledge[id]);

  const bestAttributesDict: string[][] = [];

  neededItems.forEach((neededItem) => {
    bestAttributesDict.push(sortItemAttributesBySpecificWeight(neededItem, knownSigns));
  });

  const bestCursedAttributesDict: string[][] = [];

  cursedItems.forEach((cursedItem) => {
    bestCursedAttributesDict.push(sortItemAttributesBySpecificWeight(cursedItem, knownSigns));
  });

  const signKeyIdDict = signs.reduce((acc, sign) => {
    acc[sign.key] = sign.signId;
    acc[`!${sign.key}`] = `!${sign.signId}`;
    return acc;
  }, {});

  for (let i = 0; i < bestAttributesDict.length; i++) {
    const needList = bestAttributesDict[i];
    const isMatched = bestCursedAttributesDict.some((cursedList) => {
      return needList.every((attr) => cursedList.includes(attr));
    });

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
      } else {
        return attr;
      }
    })
    .slice(0, 5);
}

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
