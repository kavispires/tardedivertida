import 'jest';
import * as helpers from '../../../src/engine/arte-ruim/helpers';
import { mockArteRuimCardDatabase } from '../../mocks';

describe('arte-ruim/helpers', () => {
  let result: any = null;
  // let sample: any = null;

  describe('buildDeck', () => {
    test('it builds a deck with the correct number of cards per level', () => {
      result = helpers.buildDeck(mockArteRuimCardDatabase, [], [], 7, false, 'REGULAR_GAME');

      expect(result).toHaveLength(42);
      expect(result[0].level).toBe(3);
      expect(result[result.length - 1].level).toBe(1);
    });
  });
});
