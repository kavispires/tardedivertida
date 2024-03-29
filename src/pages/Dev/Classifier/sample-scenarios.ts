import { InquiryScenario } from './types';

export const INQUIRY_SCENARIOS: InquiryScenario[] = [
  {
    description: 'alive with 1 item',
    inquiry: ['5'],
    attributes: [],
    knownAttributes: [],
    expected: 'alive',
  },
  {
    description: 'alive with 3 item',
    inquiry: ['59', '5'],
    attributes: [],
    knownAttributes: [],
    expected: 'alive',
  },
  {
    description: 'alive with 5 item',
    inquiry: ['99', '88', '82', '162', '225'],
    attributes: [],
    knownAttributes: [],
    expected: 'alive',
  },
  {
    description: 'beautiful with 1 item',
    inquiry: ['20'],
    attributes: [],
    knownAttributes: [],
    expected: 'beautiful',
  },
  {
    description: 'Real life sample with flaviane old',
    inquiry: ['6', '13'],
    attributes: [],
    knownAttributes: [],
    expected: 'old',
  },
  {
    description: 'Real life sample with flaviane metal',
    inquiry: ['3', '10', '12', '17', '21'],
    attributes: [],
    knownAttributes: [],
    expected: 'metal',
  },
  {
    description: 'Real life sample with flaviane sound',
    inquiry: ['4', '10', '12', '23'],
    attributes: [],
    knownAttributes: [],
    expected: 'sound',
  },
  {
    description: 'Real life sample with flaviane long',
    inquiry: ['1', '2', '3', '19', '21'],
    attributes: [],
    knownAttributes: [],
    expected: 'long',
  },
  {
    description: 'Real life sample with flaviane plant',
    inquiry: ['2', '14', '20'],
    attributes: [],
    knownAttributes: [],
    expected: 'plant',
  },
  {
    description: 'Real life sample with flaviane weapon',
    inquiry: ['3', '4'],
    attributes: [],
    knownAttributes: [],
    expected: 'weapon',
  },
  {
    description: 'Real life sample with flaviane clothes',
    inquiry: ['8', '15', '22'],
    attributes: [],
    knownAttributes: [],
    expected: 'clothes',
  },
  {
    description: 'Sample',
    inquiry: ['1'],
    attributes: [],
    knownAttributes: [],
    expected: 'flat',
  },
  {
    description: 'Sample',
    inquiry: ['1'],
    attributes: [],
    knownAttributes: ['flat'],
    expected: 'long',
  },
];
