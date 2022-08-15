import 'jest';
import * as helpers from '../../../src/engine/super-campeonato/helpers';
import { generatePlayerId } from '../../../src/utils/players-utils';

const mockPlayer = ({ name, ready = true, score = 0, additionalInfo }) => ({
  id: generatePlayerId(name),
  name,
  ready,
  score,
  ...additionalInfo,
});

const mockChallenges = [
  {
    id: 'A',
    text: 'Challenge A',
  },
  {
    id: 'B',
    text: 'Challenge B',
  },
];

describe('super-campeonato', () => {
  let result: any = null;
  let sample: any = null;
  describe('getMostVotedChallenge', () => {
    test('it determines the most voted correctly when unanimous', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name) =>
        mockPlayer({ name, additionalInfo: { challengeId: 'A' } })
      ).reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {});

      result = helpers.getMostVotedChallenge(sample, mockChallenges);
      expect(result.id).toBe('A');
    });

    test('it determines the most voted correctly when voting is uneven', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name, index) =>
        mockPlayer({ name, additionalInfo: { challengeId: index < 3 ? 'A' : 'B' } })
      ).reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {});

      result = helpers.getMostVotedChallenge(sample, mockChallenges);
      expect(result.id).toBe('A');
    });

    test('it determines the most voted correctly when voting is even', () => {
      sample = Array.from(['Abe', 'Bob', 'Cam', 'Dan'], (name, index) =>
        mockPlayer({ name, additionalInfo: { challengeId: index % 2 === 0 ? 'A' : 'B' } })
      ).reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {});

      result = helpers.getMostVotedChallenge(sample, mockChallenges);
      expect(['A', 'B'].includes(result.id)).toBeTruthy();
    });
  });
});
