import { setGlobalState } from 'hooks';

const names = ['Abe', 'Bob', 'Cam', 'Doc', 'Eva', 'Fred', 'Gus', 'Hal', 'Ira', 'Jay'];
const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

type PlayerArgs = {
  id?: string;
  avatarId?: string;
  name?: string;
  ready?: boolean;
  score?: number;
  updatedAt?: number;
  [key: string]: any;
};

class Player {
  id: string = '_bob';
  avatarId: string = '1';
  name: string = 'Bob';
  ready: boolean = false;
  score: number = 0;
  updatedAt: number = Date.now();
  [key: string]: any;

  constructor(data: PlayerArgs) {
    // Build id or name if either is not available
    if (data.id && !data.name) {
      this.id = data.id;
      this.name = data.id;
    } else if (data.name && !data.id) {
      this.id = `_${data.name.toLowerCase()}`;
      this.name = data.name;
    }

    this.extend(data);
  }

  extend(data: PlayerArgs) {
    for (const property in data) {
      this[property] = data[property];
    }
    return this;
  }

  randomize() {
    this.ready = random([true, false]);
    this.score = random([1, 2, 2, 3, 3, 5, 7, 11, 13, 17]);
    return this;
  }
}

/**
 * Mocks a player (default: bob)
 * @param {*} overrideData
 * @returns
 */
export const mockPlayer = (overrideData = {}) => new Player(overrideData);

/**
 * Mocks up to 8 players
 * @param quantity
 * @param randomize
 * @param withTeams
 * @returns
 */
export const mockPlayers = (quantity = 2, randomize = false, withTeams = false) => {
  return Array(quantity)
    .fill(0)
    .map((_, index) => {
      const newPlayer = new Player({
        id: `_${names[index].toLowerCase()}`,
        avatarId: `${index}`,
        name: names[index],
      });

      if (randomize) {
        newPlayer.randomize();
      }

      if (withTeams) {
        newPlayer.extend({ team: index % 2 === 0 ? 'A' : 'B' });
      }
      return newPlayer;
    })
    .reduce((acc: PlainObject, item: PlainObject) => {
      acc[item.id] = item;
      return acc;
    }, {});
};

/**
 * Mock Teams
 * Only works with even number of team players
 * @param quantity
 * @param playersPerTeam
 * @returns
 */
export const mockTeams = (quantity = 2, playersPerTeam = 2) => {
  const letters = 'ABCD';
  const players = Object.keys(mockPlayers(quantity * playersPerTeam));

  return Array(quantity)
    .fill(0)
    .map((_, index) => {
      return {
        members: players.slice(index * playersPerTeam, (index + 1) * playersPerTeam),
        name: letters[index],
        score: random([1, 3, 7, 11]),
      };
    })
    .reduce((acc: PlainObject, item: PlainObject) => {
      acc[item.name] = item;
      return acc;
    }, {});
};

/**
 * Mock Global User
 * @param overrideData
 * @param reset
 */
export const mockGlobalUser = (overrideData: PlainObject = {}, reset = false) => {
  if (reset) {
    setGlobalState('userId', null);
    setGlobalState('username', '');
    setGlobalState('userAvatarId', '');
  } else {
    setGlobalState('userId', overrideData.userId ?? '_bob');
    setGlobalState('username', overrideData.username ?? 'Bob');
    setGlobalState('userAvatarId', overrideData.userAvatarId ?? '1');
  }
};

/**
 * Mock Authentication
 * @param {boolean} value
 */
export const mockAuthenticated = (value = true) => {
  setGlobalState('isAuthenticated', value);
};

/**
 * Mock Admin
 * @param {boolean} value
 */
export const mockAdmin = (value = true) => {
  setGlobalState('isAdmin', value);
};

/**
 * Mock Global Property
 * @param {string} propertyName
 * @param {*} value
 */
export const mockGlobalProperty = (propertyName: keyof Primitive, value: any) => {
  setGlobalState(propertyName, value);
};

/**
 * Mocks language
 */
export const mockLanguage = (value: 'pt' | 'en' = 'pt') => {
  setGlobalState('language', value);
};

/**
 *
 */
export const mockLoading = (value = true) => {
  setGlobalState('loaders', { testing: value });
};

/**
 * Mock Game Meta (firebase)
 * @returns
 */
export const mockGameMeta = () => {
  setGlobalState('gameMeta', {
    gameId: '',
    gameName: '',
    createdAt: 0,
    createdBy: '',
    isComplete: false,
    isLocked: false,
    language: 'en',
    max: 4,
    min: 8,
    replay: 0,
  });
};

/**
 * Mock Game Info (static)
 * @returns
 */
export const mockInfo = () => ({
  title: {
    pt: 'O Nome do Jogo',
    en: 'The Game Title',
  },
  gameName: 'game-name',
  summary: {
    pt: 'It is a game!',
    en: 'É um jogo!',
  },
  rules: {
    pt: ['Regra 1', 'Regra 2', 'Regra 3'],
    en: ['Rule 1', 'Rule 2', 'Rule 3'],
  },
});
