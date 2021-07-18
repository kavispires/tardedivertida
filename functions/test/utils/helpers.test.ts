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

  describe('createPlayer', () => {
    test('it creates a player', () => {
      const result = helpers.createPlayer('_abe', 'ABE', '1');
      expect(result).toHaveProperty('avatarId', '1');
      expect(result).toHaveProperty('id', '_abe');
      expect(result).toHaveProperty('name', 'ABE');
      expect(result).toHaveProperty('score', 0);
      expect(result).toHaveProperty('ready', false);
      expect(result).toHaveProperty('updatedAt');
    });

    test('it assigned a random avatar to player if chosen avatar is in use', () => {
      const result = helpers.createPlayer('_abe', 'ABE', '1', {
        2: {
          id: '_bob',
          name: 'BOB',
          avatarId: '1',
          ready: false,
          score: 0,
          updatedAt: Date.now(),
        },
      });

      expect(result).toHaveProperty('avatarId');
      expect(result.avatarId).not.toBe('1');
      expect(result).toHaveProperty('id', '_abe');
      expect(result).toHaveProperty('name', 'ABE');
      expect(result).toHaveProperty('score', 0);
      expect(result).toHaveProperty('ready', false);
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('readyPlayer', () => {
    test('it switches a [player].ready property to true', () => {
      const result = helpers.readyPlayer(players, '_abe');
      expect(result['_abe']).toHaveProperty('ready', true);
      expect(result['_bob']).toHaveProperty('ready', false);
      expect(result['_cam']).toHaveProperty('ready', false);
    });
  });

  describe('readyPlayers', () => {
    test('it switches the ready property to true in all players', () => {
      const result = helpers.readyPlayers(players);
      expect(result['_abe']).toHaveProperty('ready', true);
      expect(result['_bob']).toHaveProperty('ready', true);
      expect(result['_cam']).toHaveProperty('ready', true);
    });

    test('it excludes the player on given id if `butThisOne` is provided', () => {
      const result = helpers.readyPlayers(players, '_bob');
      expect(result['_abe']).toHaveProperty('ready', true);
      expect(result['_bob']).toHaveProperty('ready', false);
      expect(result['_cam']).toHaveProperty('ready', true);
    });
  });

  describe('unReadyPlayers', () => {
    beforeEach(() => {
      players['_abe'].ready = true;
      players['_bob'].ready = true;
      players['_cam'].ready = true;
    });

    test('it switches the ready property to true in all players', () => {
      expect(players['_abe']).toHaveProperty('ready', true);
      expect(players['_bob']).toHaveProperty('ready', true);
      expect(players['_cam']).toHaveProperty('ready', true);
      const result = helpers.unReadyPlayers(players);
      expect(result['_abe']).toHaveProperty('ready', false);
      expect(result['_bob']).toHaveProperty('ready', false);
      expect(result['_cam']).toHaveProperty('ready', false);
    });

    test('it excludes the player on given id if `butThisOne` is provided', () => {
      const result = helpers.unReadyPlayers(players, '_bob');
      expect(result['_abe']).toHaveProperty('ready', false);
      expect(result['_bob']).toHaveProperty('ready', true);
      expect(result['_cam']).toHaveProperty('ready', false);
    });
  });

  describe('modifyPlayers', () => {
    test('it modifies given property to given value in all players', () => {
      expect(players['_abe']).toHaveProperty('score', 0);
      expect(players['_bob']).toHaveProperty('score', 0);
      expect(players['_cam']).toHaveProperty('score', 0);
      const result = helpers.modifyPlayers(players, 'score', 10);
      expect(result['_abe']).toHaveProperty('score', 10);
      expect(result['_bob']).toHaveProperty('score', 10);
      expect(result['_cam']).toHaveProperty('score', 10);
    });

    test('it excludes the player on given id if `butThisOne` is provided', () => {
      expect(players['_abe']).toHaveProperty('score', 0);
      expect(players['_bob']).toHaveProperty('score', 0);
      expect(players['_cam']).toHaveProperty('score', 0);
      const result = helpers.modifyPlayers(players, 'score', 15, '_bob');
      expect(result['_abe']).toHaveProperty('score', 15);
      expect(result['_bob']).toHaveProperty('score', 0);
      expect(result['_cam']).toHaveProperty('score', 15);
    });
  });

  describe('resetPlayers', () => {
    test('it resets players to their default values', () => {
      players['_abe'].ready = true;
      players['_bob'].hand = ['A'];
      players['_cam'].score = 100;

      const result = helpers.resetPlayers(players);

      expect(result['_abe']).toHaveProperty('ready', false);
      expect(result['_bob']).not.toHaveProperty('hand');
      expect(result['_cam']).toHaveProperty('score', 0);
    });
  });

  describe('removePropertiesFromPlayers', () => {
    test('it remove given properties from players', () => {
      players['_abe'].team = 'B';
      players['_bob'].team = 'A';
      players['_cam'].isTraitor = true;

      const result = helpers.removePropertiesFromPlayers(players, ['team', 'isTraitor']);

      expect(result['_abe']).not.toHaveProperty('team');
      expect(result['_abe']).not.toHaveProperty('isTraitor');
      expect(result['_bob']).not.toHaveProperty('team');
      expect(result['_bob']).not.toHaveProperty('isTraitor');
      expect(result['_cam']).not.toHaveProperty('team');
      expect(result['_cam']).not.toHaveProperty('isTraitor');
    });
  });

  describe('isEverybodyReady', () => {
    test('it checks if everybody is ready', () => {
      let result = helpers.isEverybodyReady(players);
      expect(result).toBeFalsy();

      players['_abe'].ready = true;
      result = helpers.isEverybodyReady(players);
      expect(result).toBeFalsy();

      players['_bob'].ready = true;
      players['_cam'].ready = true;
      result = helpers.isEverybodyReady(players);
      expect(result).toBeTruthy();
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

  describe('determineTeams', () => {
    test('it distributes players in teams', () => {
      const result = helpers.determineTeams(players, 2);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result).toHaveProperty('A');
      expect(result['A'].members.length).toBe(2);
      expect(result).toHaveProperty('B');
      expect(result['B'].members.length).toBe(1);
    });

    test('it grants extra points to team if provided', () => {
      const result = helpers.determineTeams(players, 3, [3, 5]);
      expect(Object.keys(result)).toHaveLength(3);
      expect(result).toHaveProperty('A');
      expect(result['A'].score).toBe(3);
      expect(result).toHaveProperty('B');
      expect(result['B'].score).toBe(5);
      expect(result).toHaveProperty('C');
      expect(result['C'].score).toBe(0);
    });
  });

  describe('determineWinners', () => {
    test('it gets a list of players who had the highest scores', () => {
      let result = helpers.determineWinners(players);
      expect(result).toHaveLength(3);

      players['_bob'].score = 10;
      players['_cam'].score = 7;

      result = helpers.determineWinners(players);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('_bob');
    });

    test('it accepts ties', () => {
      players['_bob'].score = 8;
      players['_cam'].score = 8;

      const result = helpers.determineWinners(players);
      expect(result).toHaveLength(2);
    });
  });
});
