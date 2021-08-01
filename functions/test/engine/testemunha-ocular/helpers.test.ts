import 'jest';
import * as helpers from '../../../src/engine/testemunha-ocular/helpers';
import { generatePLayerId } from '../../../src/utils/helpers';

const mockPlayer = ({ name, ready = true, score = 0, additionalInfo }) => ({
  id: generatePLayerId(name),
  name,
  ready,
  score,
  ...additionalInfo,
});

describe('testemunha-ocular', () => {
  let result: any = null;
  let sample: any = null;
  describe('determineTurnOrder', () => {
    test('it counts the scores correctly', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam'], (name, index) =>
        mockPlayer({ name, additionalInfo: { vote: index % 2 === 0 ? '_bob' : '_cam' } })
      ).reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {});

      result = helpers.determineTurnOrder(sample, '_cam');
      expect(result).toHaveLength(2);
      expect(result.includes('_cam')).toBeFalsy();
    });
  });
});
