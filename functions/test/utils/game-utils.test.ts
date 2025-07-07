import 'jest';
import * as gameUtils from '../../src/utils/game-utils';

describe('game-utils', () => {
  let result: any = null;
  let sample: any = null;

  describe('shuffle', () => {
    test('it shuffles given list', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.shuffle(sample);
      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining(sample));
    });
  });

  describe('getRandomNumber', () => {
    test('it gets random inclusive number from a min and a max value', () => {
      result = gameUtils.getRandomNumber(0, 0);
      expect(result).toBe(0);

      result = gameUtils.getRandomNumber(0, 1);
      expect([0, 1].includes(result)).toBeTruthy();

      result = gameUtils.getRandomNumber(0, 4);
      expect([0, 1, 2, 3, 4].includes(result)).toBeTruthy();
    });
  });

  describe('getRandomItem', () => {
    test('it gets a random item from a list', () => {
      result = gameUtils.getRandomItem(['a']);
      expect(result).toBe('a');

      result = gameUtils.getRandomItem(['a', 1, true]);
      expect(['a', 1, true].includes(result)).toBeTruthy();

      result = gameUtils.getRandomItem([0, 1, 2, 3, 4]);
      expect([0, 1, 2, 3, 4].includes(result)).toBeTruthy();
    });
  });

  describe('getRandomItems', () => {
    test('it gets any number of random items from a list', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomItems(sample, 1);
      expect(result).toHaveLength(1);
      expect(sample.includes(result[0])).toBeTruthy();

      result = gameUtils.getRandomItems(sample, 2);
      expect(result).toHaveLength(2);
      expect(sample.includes(result[0])).toBeTruthy();
      expect(sample.includes(result[1])).toBeTruthy();

      result = gameUtils.getRandomItems(sample, 4);
      expect(result).toHaveLength(4);
      expect(sample.includes(result[0])).toBeTruthy();
      expect(sample.includes(result[1])).toBeTruthy();
      expect(sample.includes(result[2])).toBeTruthy();
      expect(sample.includes(result[3])).toBeTruthy();
    });

    test('it returns an empty array if no items are requested', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomItems(sample, 0);
      expect(result).toHaveLength(0);
    });

    test('it returns the list when the quantity exceeds the list length', () => {
      sample = ['A', 'B'];
      result = gameUtils.getRandomItems(sample, 3);
      expect(result).toHaveLength(2);
    });
  });

  describe('getRandomUniqueItem', () => {
    test('getRandomUniqueItem', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomUniqueItem(sample, ['B', 'C', 'D']);
      expect(result).toBe('A');

      result = gameUtils.getRandomUniqueItem(sample, ['A']);
      expect(['B', 'C', 'D'].includes(result)).toBeTruthy();
    });
  });

  describe('getRandomUniqueItems', () => {
    test('it gets any number of random unique items from a list', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomUniqueItems(sample, ['B', 'C', 'D']);
      expect(result).toHaveLength(1);
      expect(result).toEqual(['A']);
      expect(result).not.toContain('B');
      expect(result).not.toContain('C');
      expect(result).not.toContain('D');

      result = gameUtils.getRandomUniqueItems(sample, ['A', 'B'], 2);
      expect(result).toHaveLength(2);
      expect(result).not.toContain('A');
      expect(result).not.toContain('B');
      expect(result).toContain('C');
      expect(result).toContain('D');
    });

    test('it returns an empty array if no items are requested', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomUniqueItems(sample, ['A', 'B'], 0);
      expect(result).toHaveLength(0);
    });

    test('it returns an empty array if no unique items are available', () => {
      sample = ['A', 'B', 'C', 'D'];
      result = gameUtils.getRandomUniqueItems(sample, ['A', 'B', 'C', 'D'], 0);
      expect(result).toHaveLength(0);
    });

    test('it returns the maximum of possible when the amount requests is larger than the amount available', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getRandomUniqueItems(sample, ['A', 'B'], 3);
      expect(result).toHaveLength(1);
      expect(result).toEqual(['C']);
    });
  });

  describe('getNextItem', () => {
    test('it gets the next item in the list', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getNextItem(sample, 'B');
      expect(result).toBe('C');
    });

    test('it gets the next item in the list if the next item exceeds the list limits', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getNextItem(sample, 'C');
      expect(result).toBe('A');
    });

    test('it returns null if the next item in the list exceeds the list limits and wrap is false', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getNextItem(sample, 'C', false);
      expect(result).toBe(null);
    });
  });

  describe('getPreviousItem', () => {
    test('it gets the previous item in the list', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getPreviousItem(sample, 'B');
      expect(result).toBe('A');
    });

    test('it gets the previous item in the list if the previous item exceeds the list limits', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getPreviousItem(sample, 'A');
      expect(result).toBe('C');
    });

    test('it returns null if the previous item in the list exceeds the list limits and wrap is false', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.getPreviousItem(sample, 'A', false);
      expect(result).toBe(null);
    });
  });

  describe('removeItem', () => {
    test('it removes item from list returning the new list', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.removeItem(sample, 'A');
      expect(result).toStrictEqual(['B', 'C']);
    });

    test('it removes item string from list returning the new list', () => {
      sample = ['A', 'B', 'C'];
      result = gameUtils.removeItem(sample, 'A');
      expect(result).toStrictEqual(['B', 'C']);
    });

    test('it removes item number from list returning the new list', () => {
      sample = [0, 1, 2];
      result = gameUtils.removeItem(sample, 2);
      expect(result).toStrictEqual([0, 1]);
    });
  });

  describe('sliceIntoChunks', () => {
    test('it slices a list into chunks of given size', () => {
      sample = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      result = gameUtils.sliceIntoChunks(sample);
      expect(result).toStrictEqual([['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I']]);

      result = gameUtils.sliceIntoChunks(sample, 4);
      expect(result).toStrictEqual([['A', 'B', 'C', 'D'], ['E', 'F', 'G', 'H'], ['I']]);
    });

    test('it does its best if the chunk size exceeds the size of the list', () => {
      sample = ['A', 'B'];
      result = gameUtils.sliceIntoChunks(sample, 3);
      expect(result).toStrictEqual([['A', 'B']]);
    });
  });

  describe('sliceInParts', () => {
    test('it slices a list into chance of equal given parts', () => {
      sample = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      result = gameUtils.sliceInParts(sample);
      expect(result).toHaveLength(1);
      expect(result).toStrictEqual([['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']]);

      result = gameUtils.sliceInParts(sample, 2);
      expect(result).toHaveLength(2);
      expect(result).toStrictEqual([
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I'],
      ]);

      result = gameUtils.sliceInParts(sample, 3);
      expect(result).toHaveLength(3);
      expect(result).toStrictEqual([
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ]);

      result = gameUtils.sliceInParts(sample, 4);
      expect(result).toHaveLength(4);
      expect(result).toStrictEqual([
        ['A', 'B', 'C'],
        ['D', 'E'],
        ['F', 'G'],
        ['H', 'I'],
      ]);

      result = gameUtils.sliceInParts(sample, 5);
      expect(result).toHaveLength(5);
      expect(result).toStrictEqual([['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I']]);

      result = gameUtils.sliceInParts(sample, 6);
      expect(result).toHaveLength(6);
      expect(result).toStrictEqual([['A', 'B'], ['C', 'D'], ['E', 'F'], ['G'], ['H'], ['I']]);

      result = gameUtils.sliceInParts(sample, 10);
      expect(result).toHaveLength(9);
      expect(result).toStrictEqual([['A'], ['B'], ['C'], ['D'], ['E'], ['F'], ['G'], ['H'], ['I']]);
    });

    test('it does its best if the number of parts exceeds the size of the list', () => {
      sample = ['A', 'B'];
      result = gameUtils.sliceInParts(sample, 3);
      expect(result).toHaveLength(2);
      expect(result).toStrictEqual([['A'], ['B']]);
    });
  });


});
