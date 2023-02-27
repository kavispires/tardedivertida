// Constants
import { COMUNICACAO_ALIENIGENA_PHASES, ITEMS_COUNT, ITEM_TYPES, TOTAL_ITEMS } from './constants';
// Utils
import utils from '../../utils';
import {
  ComunicacaoAlienigenaState,
  ComunicacaoAlienigenaStore,
  FirebaseStoreData,
  Item,
  Sign,
  SignKey,
} from './types';

/**
 * Determine the next phase based on the current one
 * @param currentPhase
 * @param round
 * @param isGameOver
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
    HUMAN_ASK,
    ALIEN_ANSWER,
    ALIEN_REQUEST,
    OFFERINGS,
    REVEAL,
    GAME_OVER,
  } = COMUNICACAO_ALIENIGENA_PHASES;
  const hasBot = checkIsBot(store);

  const order = [RULES, SETUP, ALIEN_SELECTION, HUMAN_ASK, ALIEN_ANSWER, ALIEN_REQUEST, OFFERINGS, REVEAL];

  const { phase: currentPhase, round, humanId, turnOrder, status } = state;

  if (currentPhase === REVEAL) {
    if (status.timeLeft < 1) {
      return GAME_OVER;
    }

    if (status.needed === status.found) {
      return GAME_OVER;
    }

    return round.forceLastRound ? GAME_OVER : HUMAN_ASK;
  }

  if (currentPhase === SETUP) {
    return hasBot ? HUMAN_ASK : ALIEN_SELECTION;
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

export const determineAlienResponse = (
  currentInquiry: string[],
  store: ComunicacaoAlienigenaStore,
  signs: Sign[]
) => {
  const totalWeights: NumberDictionary = {};

  for (const itemId of currentInquiry) {
    const item = store.botAlienItemKnowledge[itemId];
    for (const [attribute, weight] of Object.entries(item.attributes)) {
      if (totalWeights[attribute] === undefined) {
        totalWeights[attribute] = 0;
      }
      totalWeights[attribute] += weight;
    }
  }
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
  const uniqueMatches =
    currentInquiry.length > 1
      ? getArrayUniqueness(sortedAttributes, Object.keys(store.botAlienSignKnowledge))
      : [];

  const bestMatch = uniqueMatches?.[0] ?? sortedAttributes[0];

  const matchingSign = signs.find((sign) => sign.key === bestMatch);

  if (matchingSign?.key) {
    if (store.botAlienSignKnowledge[matchingSign.key] === undefined) {
      store.botAlienSignKnowledge[matchingSign.key] = [];
    }

    store.botAlienSignKnowledge[matchingSign.key] = [
      ...store.botAlienSignKnowledge[matchingSign.key],
      ...currentInquiry,
    ];
  }

  return matchingSign?.signId ?? '';
};

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
  return (
    Object.entries(item.attributes)
      .sort(([attrA], [attrB]) => {
        const weightA = item.attributes[attrA];
        const weightB = item.attributes[attrB];

        if (weightA === 5 || weightB === -5) {
          return -1;
        }

        if (weightA === -5 || weightB === 5) {
          return 1;
        }

        if (weightA === 3 || weightB === -3) {
          return -1;
        }

        if (weightA === -3 || weightB === 3) {
          return 1;
        }

        return weightB - weightA;
      })
      // Only include known signs and ignore -1 values
      .filter(([attr, weight]) => knownSigns.includes(attr) && weight !== -1)
      .map(([attr]) => {
        const weight = item.attributes[attr];
        if (weight && weight < 0) {
          return `!${attr}`;
        } else {
          return attr;
        }
      })
      .slice(0, 5)
  );
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
