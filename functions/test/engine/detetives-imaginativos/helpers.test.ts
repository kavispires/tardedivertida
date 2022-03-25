import 'jest';
import * as helpers from '../../../src/engine/detetives-imaginativos/helpers';
import { generatePlayerId } from '../../../src/utils/players-utils';

const mockPlayer = ({ name, ready = true, score = 0, additionalInfo }) => ({
  id: generatePlayerId(name),
  name,
  ready,
  score,
  ...additionalInfo,
});

describe('clube-detetives', () => {
  let result: any = null;
  let sample: any = null;

  describe('countImpostorVotes', () => {
    test('it counts the votes correctly', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name, index) =>
        mockPlayer({ name, additionalInfo: { vote: index % 2 === 0 ? '_bob' : '_cam' } })
      );

      result = helpers.countImpostorVotes(sample, '_bob');
      expect(result).toEqual(2);

      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name) =>
        mockPlayer({ name, additionalInfo: { vote: name === 'Bob' ? '_cam' : '_bob' } })
      );

      result = helpers.countImpostorVotes(sample, '_bob');
      expect(result).toEqual(3);

      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name) =>
        mockPlayer({ name, additionalInfo: { vote: '_cam' } })
      );

      result = helpers.countImpostorVotes(sample, '_bob');
      expect(result).toEqual(0);
    });
  });

  describe('calculateNewScores', () => {
    test('it counts the scores correctly', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan', 'Eve', 'Fin'], (name, index) =>
        mockPlayer({ name, additionalInfo: { vote: index % 2 === 0 ? '_bob' : '_cam' } })
      );

      result = helpers.calculateNewScores(sample, 3, '_bob', '_dan');
      expect(result['_abe']).toStrictEqual([0, 3, 3]);
      expect(result['_bob']).toStrictEqual([0, 0, 0]);
      expect(result['_cam']).toStrictEqual([0, 3, 3]);
      expect(result['_dan']).toStrictEqual([0, 0, 0]);
      expect(result['_eve']).toStrictEqual([0, 3, 3]);
      expect(result['_fin']).toStrictEqual([0, 0, 0]);

      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan', 'Eve', 'Fin'], (name) =>
        mockPlayer({ name, additionalInfo: { vote: '_cam' } })
      );

      result = helpers.calculateNewScores(sample, 0, '_bob', '_dan');

      expect(result['_abe']).toStrictEqual([0, 0, 0]);
      expect(result['_bob']).toStrictEqual([0, 5, 5]);
      expect(result['_cam']).toStrictEqual([0, 0, 0]);
      expect(result['_dan']).toStrictEqual([0, 4, 4]);
      expect(result['_eve']).toStrictEqual([0, 0, 0]);
      expect(result['_fin']).toStrictEqual([0, 0, 0]);

      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan', 'Eve', 'Fin'], (name, index) =>
        mockPlayer({ name, additionalInfo: { vote: index % 2 === 0 ? '_bob' : '_cam', score: index + 1 } })
      );

      result = helpers.calculateNewScores(sample, 3, '_bob', '_dan');
      expect(result['_abe']).toStrictEqual([1, 3, 4]);
      expect(result['_bob']).toStrictEqual([2, 0, 2]);
      expect(result['_cam']).toStrictEqual([3, 3, 6]);
      expect(result['_dan']).toStrictEqual([4, 0, 4]);
      expect(result['_eve']).toStrictEqual([5, 3, 8]);
      expect(result['_fin']).toStrictEqual([6, 0, 6]);

      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan', 'Eve', 'Fin'], (name, index) =>
        mockPlayer({ name, additionalInfo: { vote: '_cam', score: index } })
      );

      result = helpers.calculateNewScores(sample, 0, '_bob', '_dan');

      expect(result['_abe']).toStrictEqual([0, 0, 0]);
      expect(result['_bob']).toStrictEqual([1, 5, 6]);
      expect(result['_cam']).toStrictEqual([2, 0, 2]);
      expect(result['_dan']).toStrictEqual([3, 4, 7]);
      expect(result['_eve']).toStrictEqual([4, 0, 4]);
      expect(result['_fin']).toStrictEqual([5, 0, 5]);
    });
  });
});
