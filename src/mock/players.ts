// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem } from 'utils/helpers';

/**
 * Random names used during Dev
 */
const DEV_NAMES: string[] =
  'Abigail,Bob,Cameron,Daniel,Eva,Finley,Gus,Helen,Ian,Jennifer,Kim,Laura,Max,Nicky,Oliver,Patrick,Quinn,Roy,Samuel,Tim,Una,Victor,Will,Xavier,Yara,Zoe'.split(
    ',',
  );

const cacheNames: BooleanDictionary = {};
const cacheAvatars: BooleanDictionary = {};

let cacheMockedPlayers: GamePlayers = {};

/**
 * Gets a random unique item from list based on the cached dictionary or used dictionary
 * @param source
 * @param used
 * @param cache
 * @returns
 */
const getRandomUniqueItemFromList = (
  source: string[],
  used: string[] = [],
  cache: BooleanDictionary = {},
) => {
  let randomItem = '';
  let tries = 0;
  while (!randomItem || cache[randomItem] || used?.includes(randomItem) || tries < 50) {
    randomItem = getRandomItem(source);
    tries += 1;
  }
  cache[randomItem] = true;
  return randomItem;
};

/**
 * Get random user name
 * @param used
 * @returns
 */
export function mockPlayerName(used?: string[]): string {
  return getRandomUniqueItemFromList(DEV_NAMES, used, cacheNames);
}

/**
 * Mock players to be used during dev
 * @param players
 * @param quantity
 * @param properties
 * @returns
 */
export function mockPlayers(
  players: GamePlayers,
  quantity = 10,
  properties: PlainObject | GenericFunction = {},
): GamePlayers {
  if (Object.keys(cacheMockedPlayers).length === quantity) {
    return {
      ...cacheMockedPlayers,
      ...players,
    };
  }

  const usedNames: BooleanDictionary = {};
  const usedAvatars: BooleanDictionary = {};
  Object.values(players).forEach((player) => {
    usedNames[player.name] = true;
    usedAvatars[player.avatarId] = true;
  });

  const neededQuantity = quantity - Object.keys(players).length;

  const mockedPlayers: GamePlayer[] = Array(neededQuantity)
    .fill(0)
    .map((_, i) => {
      const name = mockPlayerName(Object.keys(usedNames));

      return {
        id: `_${name.toLowerCase()}`,
        name: `${name}`,
        avatarId: getRandomUniqueItemFromList(AVAILABLE_AVATAR_IDS, Object.keys(usedAvatars), cacheAvatars),
        updatedAt: Date.now(),
        ready: true,
        ...(typeof properties === 'function' ? properties(i) : properties),
      };
    });

  const newMockedPlayers: GamePlayers = {
    ...mockedPlayers.reduce((acc: GamePlayers, player) => {
      acc[player.id] = player;
      return acc;
    }, {}),
    ...players,
  };

  cacheMockedPlayers = newMockedPlayers;
  return cacheMockedPlayers;
}
