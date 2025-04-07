// Internal
import type { ScaleEntry } from './types';

export const FILEIRA_DE_FATOS_PHASES = {
  ORDERING: 'ORDERING',
  RESULTS: 'RESULTS',
} as const;

export const FILEIRA_DE_FATOS_ACTIONS = {
  SUBMIT_SCENARIO_ORDER: 'SUBMIT_SCENARIO_ORDER',
} as const;

export const POSITIVE_SCALE: ScaleEntry[] = [
  {
    id: '1',
    text: {
      pt: 'Discordo totalmente',
      en: 'Strongly disagree',
    },
  },
  {
    id: '2',
    text: {
      pt: 'Discordo',
      en: 'Disagree',
    },
  },
  {
    id: '3',
    text: {
      pt: 'Neutro',
      en: 'Neutral',
    },
  },
  {
    id: '4',
    text: {
      pt: 'Concordo',
      en: 'Agree',
    },
  },
  {
    id: '5',
    text: {
      pt: 'Concordo totalmente',
      en: 'Strongly agree',
    },
  },
];

export const NEGATIVE_SCALE: ScaleEntry[] = [
  {
    id: '10',
    text: {
      pt: 'Vish',
      en: 'Oh!',
    },
  },
  {
    id: '7',
    text: {
      pt: 'Ah não',
      en: 'Gosh',
    },
  },
  {
    id: '23',
    text: {
      pt: 'Quê?',
      en: 'No way',
    },
  },
  {
    id: '2',
    text: {
      pt: 'PQP',
      en: 'What the...',
    },
  },
  {
    id: '3',
    text: {
      pt: 'Preferia ⭐ Morta',
      en: 'Lord have mercy!',
    },
  },
];
