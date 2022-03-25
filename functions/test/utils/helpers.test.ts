import 'jest';
import * as helpers from '../../src/utils/helpers';

describe('helpers', () => {
  let players = {};

  beforeEach(() => {
    players = {
      _abe: {
        id: '_abe',
        name: 'Abe',
        avatarId: '1',
        ready: false,
        score: 0,
        updatedAt: Date.now(),
      },
      _bob: {
        id: '_bob',
        name: 'Bob',
        avatarId: '2',
        ready: false,
        score: 0,
        updatedAt: Date.now(),
      },
      _cam: {
        id: '_cam',
        name: 'Cam',
        avatarId: '3',
        ready: false,
        score: 0,
        updatedAt: Date.now(),
      },
    };
  });

  describe('generateGameId', () => {
    test('it generates a 4 letter game id', () => {
      const result = helpers.generateGameId('A');
      expect(result.startsWith('A')).toBeTruthy();
      expect(result).toHaveLength(4);
    });

    test('it throws an error if game code is invalid', () => {
      function catcher() {
        return helpers.generateGameId('12');
      }

      expect(catcher).toThrow('Invalid game code');
    });
  });

  describe('getPointsToVictory', () => {
    test('it calculates how many points are missing to victory', () => {
      let result = helpers.getPointsToVictory(players, 10);
      expect(result).toBe(10);

      players['_abe'].score = 7;
      result = helpers.getPointsToVictory(players, 10);
      expect(result).toBe(3);

      players['_bob'].score = 10;
      result = helpers.getPointsToVictory(players, 10);
      expect(result).toBe(0);

      players['_cam'].score = 11;
      result = helpers.getPointsToVictory(players, 10);
      expect(result).toBe(0);
    });
  });

  describe('getRoundsToEndGame', () => {
    test('it calculates how many rounds remain to end the game', () => {
      const result = helpers.getRoundsToEndGame(3, 10);
      expect(result).toBe(7);
    });
  });
});
