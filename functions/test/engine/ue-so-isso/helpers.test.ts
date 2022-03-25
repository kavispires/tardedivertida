import 'jest';
import * as helpers from '../../../src/engine/ue-so-isso/helpers';
import { mockUseSoIssoCardDatabase } from '../../mocks';

describe('ue-so-isso/helpers', () => {
  let result: any = null;
  // let sample: any = null;

  describe('buildDeck', () => {
    test('it builds the correct number of words per card', () => {
      result = helpers.buildDeck(mockUseSoIssoCardDatabase, 2);
      expect(result).toHaveLength(2);
      expect(JSON.parse(result[0])).toHaveLength(5);
      expect(JSON.parse(result[1])).toHaveLength(5);
    });
  });
});
