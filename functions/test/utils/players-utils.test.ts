import 'jest';
import * as helpers from '../../src/utils/players-utils';

describe('players-utils', () => {
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
        type: 'player',
      },
      _bob: {
        id: '_bob',
        name: 'Bob',
        avatarId: '2',
        ready: false,
        score: 0,
        updatedAt: Date.now(),
        type: 'player',
      },
      _cam: {
        id: '_cam',
        name: 'Cam',
        avatarId: '3',
        ready: false,
        score: 0,
        updatedAt: Date.now(),
        type: 'player',
      },
    };
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
      expect(result).toHaveProperty('type', 'player');
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
          type: 'player',
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
