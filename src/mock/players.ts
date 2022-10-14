import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem } from 'utils/helpers';

/**
 * Random names used during Dev
 */
const DEV_NAMES: string[] =
  'Abe,Bob,Cam,Dan,Eva,Fin,Gus,Hal,Ian,Jan,Kim,Leo,Max,Nic,Ole,Pat,Quinn,Roy,Tim'.split(',');
// const DEV_NAMES: string[] =
//   'Abigail,Bartolomeu,Cameron,Daniella,Evelyn,Frederick,Gordon,Hector,Isaac,Jacklyn,Madonna,Nathaniel'.split(
//     ','
//   );

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
  cache: BooleanDictionary = {}
) => {
  let randomItem = '';
  while (!randomItem || cache[randomItem] || used?.includes(randomItem)) {
    randomItem = getRandomItem(source);
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
  quantity: number = 10,
  properties?: PlainObject
): GamePlayers {
  if (Object.keys(cacheMockedPlayers).length > 1) {
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

  const mockedPlayers: Player[] = Array(neededQuantity)
    .fill(0)
    .map((e, i) => {
      const name = mockPlayerName(Object.keys(usedNames));

      return {
        id: `_${name.toLowerCase()}`,
        name,
        avatarId: getRandomUniqueItemFromList(AVAILABLE_AVATAR_IDS, Object.keys(usedAvatars), cacheAvatars),
        updatedAt: Date.now(),
        ready: true,
        ...properties,
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
