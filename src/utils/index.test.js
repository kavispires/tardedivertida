import * as utils from './index';

describe('/utils', function () {
  describe('getGameIdFromURL', function () {
    const history = {
      location: {
        pathname: '/ABCD',
      },
    };

    it('gets gameId from the history object', function () {
      expect(utils.getGameIdFromURL(history)).toBe('ABCD');
    });

    it('gets gameId from the history object with an empty pathname', function () {
      history.location.pathname = '';
      expect(utils.getGameIdFromURL(history)).toBe('');
    });

    it('gets empty string if history is not provided', function () {
      expect(utils.getGameIdFromURL()).toBe('');
    });
  });

  describe('getGameIdFromLocation', function () {
    const location = {
      pathname: '/ABCD',
    };

    it('gets gameId from the history object', function () {
      expect(utils.getGameIdFromLocation(location)).toBe('ABCD');
    });

    it('gets gameId from the history object with an empty pathname', function () {
      location.pathname = '';
      expect(utils.getGameIdFromLocation(location)).toBe('');
    });

    it('gets empty string if history is not provided', function () {
      expect(utils.getGameIdFromLocation()).toBe('');
    });
  });

  describe('getRandomItem', function () {
    it('gets random item from list', function () {
      const sampleArray = ['A', 'B', 'C', 'D'];
      const result = utils.getRandomItem(sampleArray);
      expect(typeof result === 'string').toBeTruthy();
      expect(sampleArray.includes(result)).toBeTruthy();
    });
  });

  describe('isValidGameId', function () {
    it('checks if gameId is valid', function () {
      expect(utils.isValidGameId('ABCD')).toBeTruthy();
      expect(utils.isValidGameId('1234')).toBeTruthy();
      expect(utils.isValidGameId('ABC')).toBeFalsy();
      expect(utils.isValidGameId('?')).toBeFalsy();
      expect(utils.isValidGameId('')).toBeFalsy();
      expect(utils.isValidGameId()).toBeFalsy();
    });
  });

  describe('getColorFromIndex', function () {
    it('gets color based on given index', function () {
      expect(utils.getColorFromIndex(0)).toBe('red');
      expect(utils.getColorFromIndex(1)).toBe('blue');
      expect(utils.getColorFromIndex(2)).toBe('green');
      expect(utils.getColorFromIndex(3)).toBe('yellow');
      expect(utils.getColorFromIndex(4)).toBe('pink');
      expect(utils.getColorFromIndex(5)).toBe('purple');
      expect(utils.getColorFromIndex(6)).toBe('teal');
      expect(utils.getColorFromIndex(7)).toBe('orange');
      expect(utils.getColorFromIndex(8)).toBe('coffee');
      expect(utils.getColorFromIndex(9)).toBe('navy');
      expect(utils.getColorFromIndex(10)).toBe('light-green');
      expect(utils.getColorFromIndex(11)).toBe('brown');
      expect(utils.getColorFromIndex(12)).toBe('hot-pink');
      expect(utils.getColorFromIndex(13)).toBe('violet');
      expect(utils.getColorFromIndex(14)).toBe('forest');
      expect(utils.getColorFromIndex(15)).toBe('cream');
      expect(utils.getColorFromIndex(16)).toBe('none');
      expect(utils.getColorFromIndex()).toBe('none');
    });
  });

  describe('getColorFromLetter', function () {
    it('gets color based on given letter', function () {
      expect(utils.getColorFromLetter('A')).toBe('red');
      expect(utils.getColorFromLetter('B')).toBe('blue');
      expect(utils.getColorFromLetter('C')).toBe('green');
      expect(utils.getColorFromLetter('D')).toBe('yellow');
      expect(utils.getColorFromLetter('E')).toBe('pink');
      expect(utils.getColorFromLetter('F')).toBe('purple');
      expect(utils.getColorFromLetter('G')).toBe('teal');
      expect(utils.getColorFromLetter('H')).toBe('orange');
      expect(utils.getColorFromLetter('I')).toBe('coffee');
      expect(utils.getColorFromLetter('J')).toBe('navy');
      expect(utils.getColorFromLetter('K')).toBe('light-green');
      expect(utils.getColorFromLetter('L')).toBe('brown');
      expect(utils.getColorFromLetter('M')).toBe('hot-pink');
      expect(utils.getColorFromLetter('N')).toBe('violet');
      expect(utils.getColorFromLetter('O')).toBe('forest');
      expect(utils.getColorFromLetter('P')).toBe('cream');
      expect(utils.getColorFromLetter('Q')).toBe('red');
      expect(utils.getColorFromLetter('R')).toBe('blue');
      expect(utils.getColorFromLetter('S')).toBe('green');
      expect(utils.getColorFromLetter('T')).toBe('yellow');
      expect(utils.getColorFromLetter('U')).toBe('pink');
      expect(utils.getColorFromLetter('V')).toBe('purple');
      expect(utils.getColorFromLetter('W')).toBe('teal');
      expect(utils.getColorFromLetter('X')).toBe('none');
      expect(utils.getColorFromLetter('Y')).toBe('orange');
      expect(utils.getColorFromLetter('Z')).toBe('coffee');

      expect(utils.getColorFromIndex()).toBe('none');
    });
  });

  describe('getOppositeTeam', function () {
    it('gets the opposite team', function () {
      const teams = ['A', 'B'];
      expect(utils.getOppositeTeam(teams, 'A')).toBe('B');
      expect(utils.getOppositeTeam(teams, 'B')).toBe('A');
    });

    it('returns `?` with odd cases', function () {
      expect(utils.getOppositeTeam()).toBe('?');
      expect(utils.getOppositeTeam(['A', 'B', 'C'], 'A')).toBe('?');
      expect(utils.getOppositeTeam(['A'])).toBe('?');
      expect(utils.getOppositeTeam(null, 'A')).toBe('?');
    });
  });

  describe('getPlayersFromIds', function () {
    const players = {
      _adam: {
        id: '_adam',
        name: 'Adam',
      },
      _bob: {
        id: '_bob',
        name: 'Bob',
      },
    };

    it('gets players objects from list of ids', function () {
      expect(utils.getPlayersFromIds(['_bob'], players)).toStrictEqual([
        {
          id: '_bob',
          name: 'Bob',
        },
      ]);
    });

    it('gets players names from list of ids', function () {
      expect(utils.getPlayersFromIds(['_bob'], players, true)).toStrictEqual(['Bob']);
    });
  });

  describe('orderBy', function () {
    const list = [
      { name: 'Bob', age: 30 },
      { name: 'Andy', age: 10 },
      { name: 'Adam', age: 20 },
    ];

    it('orders list by property', function () {
      expect(utils.orderBy(list, 'name')).toStrictEqual([
        { age: 20, name: 'Adam' },
        { age: 10, name: 'Andy' },
        { age: 30, name: 'Bob' },
      ]);

      expect(utils.orderBy(list, 'age')).toStrictEqual([
        { age: 10, name: 'Andy' },
        { age: 20, name: 'Adam' },
        { age: 30, name: 'Bob' },
      ]);
    });

    it('orders list by two or more properties', function () {
      expect(utils.orderBy(list, ['age', 'name'])).toStrictEqual([
        { age: 10, name: 'Andy' },
        { age: 20, name: 'Adam' },
        { age: 30, name: 'Bob' },
      ]);
    });

    it('orders list in descending order', function () {
      expect(utils.orderBy(list, 'name', 'desc')).toStrictEqual([
        { age: 30, name: 'Bob' },
        { age: 10, name: 'Andy' },
        { age: 20, name: 'Adam' },
      ]);
    });
  });

  describe('pluralize', function () {
    it('pluralizes word', function () {
      expect(utils.pluralize(1, 'mouse', 'mice')).toBe('mouse');
      expect(utils.pluralize(2, 'mouse', 'mice')).toBe('mice');
      expect(utils.pluralize(0, 'mouse', 'mice')).toBe('mice');
      expect(utils.pluralize(null, 'mouse', 'mice')).toBe('mice');
    });
  });
});
