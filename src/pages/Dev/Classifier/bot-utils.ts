import { removeDuplicates, shuffle } from 'utils/helpers';
import { AlienItem, AlienItemDict, AlienSignKnowledge, Attribute, ItemId, SignKey } from './types';

/**
 * Generates the Alien response when a player asks about a set of items
 * @param currentInquiry
 * @param store
 * @param signs
 * @returns the attributes related to the set of items
 */
export const determineAlienResponse = (
  currentInquiry: ItemId[],
  botAlienItemKnowledge: AlienItemDict,
  botAlienSignKnowledge: AlienSignKnowledge,
  signs: Sign[]
) => {
  // Calculate total weight of attributes in current inquiry
  const totalWeights = calculateTotalWeights(currentInquiry, botAlienItemKnowledge);

  const sortedAttributes = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([, weightA], [, weightB]) => weightB - weightA)
    // Remove any attribute that could be negative for any item
    .filter(([attribute]) => {
      return currentInquiry.every(
        (itemId) => botAlienItemKnowledge[itemId].attributes[attribute as Attribute] > 0
      );
    })
    // Get attribute name only
    .map(([attribute]) => attribute);

  console.log({ sortedAttributes });

  // Filter only attributes that will be new to players, however, if only one item, return the best one
  let uniqueMatches =
    currentInquiry.length > 1 ? getArrayUniqueness(sortedAttributes, Object.keys(botAlienSignKnowledge)) : [];

  let bestMatch = uniqueMatches?.[0] ?? sortedAttributes[0];

  let matchingSign = signs.find((sign) => sign.key === bestMatch);

  // Save that the humans know about this sign now
  if (matchingSign?.key) {
    if (botAlienSignKnowledge[matchingSign.key] === undefined) {
      botAlienSignKnowledge[matchingSign.key] = [];
    }

    botAlienSignKnowledge[matchingSign.key] = [...botAlienSignKnowledge[matchingSign.key], ...currentInquiry];
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
      return currentInquiry.every(
        (itemId) => botAlienItemKnowledge[itemId].attributes[attribute as Attribute] < 0
      );
    })
    // Get attribute name only
    .map(([attribute]) => attribute);

  // Filter only attributes that will be new to players, however, if only one item, return the best one
  uniqueMatches =
    currentInquiry.length > 1
      ? getArrayUniqueness(sortedAttributesReverse, Object.keys(botAlienSignKnowledge))
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
 * Calculates and returns a list of attributes sorted by priority in a inquiry response
 * @param currentInquiry
 * @param botAlienItemKnowledge
 * @returns
 */
export const determineAttributePriorityResponse = (
  currentInquiry: ItemId[],
  botAlienItemKnowledge: AlienItemDict
) => {
  // Calculate total weight of attributes in current inquiry
  const totalWeights = calculateTotalWeights(currentInquiry, botAlienItemKnowledge);

  //
  const sortedAttributes = Object.entries(totalWeights)
    // Sort counts by total weight
    .sort(([, weightA], [, weightB]) => weightB - weightA)
    // Remove any attribute that could be negative for any item
    .filter(([attribute]) => {
      return currentInquiry.every(
        (itemId) => botAlienItemKnowledge[itemId].attributes[attribute as Attribute] > 1
      );
    })
    // Get attribute name only
    .map(([attribute]) => attribute);

  return sortedAttributes as Attribute[];
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
          0: 0,
          1: 1,
          3: 2,
          5: 0,
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
    removeDuplicates([...fiveAttributes, ...otherAttributes])
      // Get only the necessary
      .slice(0, 25)
  );
};

/**
 * Determines the alien's request based on the current state of the game.
 * @param store - The store containing the bot's knowledge of the game.
 * @param signs - The list of all available signs.
 * @param  items - The list of all available items.
 * @returns An object containing the alien's request and intention.
 */
export function determineAlienRequest(
  botAlienSignKnowledge: AlienSignKnowledge,
  botAlienItemKnowledge: AlienItemDict,
  signs: Sign[],
  items: Item[]
) {
  const itemsWithInformationDict = Object.values(botAlienSignKnowledge).reduce(
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

  const knownSigns = Object.keys(botAlienSignKnowledge);

  // Get all needed items that haven't been offered
  const neededItemsIds = sortArrayByPriority(
    items.filter((item) => !item.offered && item.type === 'ITEM').map((e) => e.id),
    itemsWithInformation
  );

  const neededItems = neededItemsIds.map((id) => botAlienItemKnowledge[id]);

  // Get all cursed items that haven't been offered
  const cursedItems = shuffle(items.filter((item) => !item.offered && item.type === 'CURSE'))
    .map((e) => e.id)
    .map((id) => botAlienItemKnowledge[id]);

  const bestAttributesDict: string[][] = [];

  neededItems.forEach((neededItem) => {
    bestAttributesDict.push(sortItemAttributesBySpecificWeight(neededItem, knownSigns));
  });

  const bestCursedAttributesDict: string[][] = [];

  cursedItems.forEach((cursedItem) => {
    bestCursedAttributesDict.push(sortItemAttributesBySpecificWeight(cursedItem, knownSigns));
  });

  const signKeyIdDict = signs.reduce((acc: Record<string, string>, sign) => {
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
    const valueA = item.attributes[a as Attribute];
    const valueB = item.attributes[b as Attribute];

    const indexA = order.indexOf(valueA);
    const indexB = order.indexOf(valueB);

    return indexA - indexB;
  });
  // Only include known signs and ignore -1 values
  return keys
    .filter((attribute) => knownSigns.includes(attribute) && item.attributes[attribute as Attribute] !== -1)
    .map((attr) => {
      const weight = item.attributes[attr as Attribute];
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
