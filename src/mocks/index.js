import { setGlobalState } from '../hooks';

const names = ['Abe', 'Bob', 'Cam', 'Doc', 'Eva', 'Fred', 'Gus', 'Hal'];
const random = (array) => array[Math.floor(Math.random() * array.length)];

export const getLanguageControl = () => ({
  _withLanguage: {
    control: 'inline-radio',
    options: ['pt', 'en'],
    defaultValue: 'pt',
    description: '[internal] Changes language',
  },
});

export const getHooksControls = () => ({
  _withUser: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks active user',
  },
  _withAdmin: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks admin user',
  },
  _withLoading: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks app loading state',
  },
  _withPlayers: {
    control: {
      type: 'range',
      min: 0,
      max: 8,
      step: 1,
    },
    defaultValue: 0,
    description: '[internal] Mocks given number of players',
  },
});

export const mockLanguageHook = (args) => {
  mockLanguage(args?._withLanguage ?? 'pt');
};

export const mockHooks = (args) => {
  mockLoading(args._withLoading);
  mockGlobalUser({}, !args._withUser);
  mockAdmin(args._withAdmin);
  const players = args._withPlayers ? mockPlayers(args._withPlayers) : {};
  return { ...args, players };
};

class Player {
  constructor(data) {
    this.id = data.id ?? '_bob';
    this.avatarId = data.avatarId ? `${data.avatarId}` : '1';
    this.name = data.name ?? 'Bob';
    this.ready = data.ready ?? false;
    this.score = data.score ?? 0;
    this.updatedAt = data.updatedAt ?? Date.now();

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

  extend(data) {
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
 * @param {number} quantity
 * @param {boolean} randomize
 * @param {boolean} withTeams
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
    .reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
};

/**
 * Mock Teams
 * Only works with even number of team players
 * @param {number} quantity
 * @param {number} playersPerTeam
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
    .reduce((acc, item) => {
      acc[item.name] = item;
      return acc;
    }, {});
};

/**
 * Mock Global User
 * @param {*} overrideData
 * @param {boolean} reset
 */
export const mockGlobalUser = (overrideData = {}, reset = false) => {
  if (reset) {
    setGlobalState('userId', null);
    setGlobalState('username', null);
    setGlobalState('userAvatarId', null);
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
export const mockGlobalProperty = (propertyName, value) => {
  setGlobalState(propertyName, value);
};

/**
 * Mocks language
 */
export const mockLanguage = (value = 'pt') => {
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
 * @returns {object}
 */
export const mockGameMeta = () => {
  setGlobalState('gameMeta', {
    min: 4,
    max: 8,
  });
};

/**
 * Mock Game Info (static)
 * @returns  {object}
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
