import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { getRandomItem } from 'utils/helpers';

/**
 * Random names used during Dev
 */
const DEV_NAMES: string[] =
  'Abe,Bob,Cam,Dan,Eva,Fin,Gus,Hal,Ian,Jan,Kim,Leo,Max,Nic,Ole,Pat,Quinn,Roy,Tim'.split(',');

const cacheNames: BooleanDictionary = {};

const getRandomUniqueFromList = (source: string[], used: string[] = [], cache: BooleanDictionary = {}) => {
  let randomItem = '';
  while (!randomItem || cache[randomItem] || used?.includes(randomItem)) {
    randomItem = getRandomItem(source);
  }
  cache[randomItem] = true;
  return randomItem;
};

export function mockPlayerName(used?: string[]): string {
  return getRandomUniqueFromList(DEV_NAMES, used, cacheNames);
}

export function mockPlayers(
  players: GamePlayers,
  quantity: number = 10,
  properties?: PlainObject
): GamePlayers {
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
        avatarId: getRandomUniqueFromList(AVAILABLE_AVATAR_IDS, Object.keys(usedAvatars)),
        updatedAt: Date.now(),
        ready: true,
        ...properties,
      };
    });

  return {
    ...mockedPlayers.reduce((acc: GamePlayers, player) => {
      acc[player.id] = player;
      return acc;
    }, {}),
    ...players,
  };
}
