/**
 * List of urls residing in the public folder
 */
export const PUBLIC_URL = {
  BANNERS: `${process.env.PUBLIC_URL}/images/banners/`,
  RULES: `${process.env.PUBLIC_URL}/images/rules/`,
};

/**
 * List of tags translation and color
 */
export const TAG_DICT = {
  competitive: {
    label: 'competitivo',
    color: 'red',
  },
  cooperative: {
    label: 'cooperativo',
    color: 'green',
  },
  traitor: {
    label: 'inimigo',
    color: 'volcano',
  },
  'real-time': {
    label: 'juntos',
    color: 'volcano',
  },
  'turn-based': {
    label: 'vez',
    color: 'volcano',
  },
  timed: {
    label: 'tempo',
    color: 'orange',
  },
  drawing: {
    label: 'desenho',
    color: 'gold',
  },
  guessing: {
    label: 'adivinhar',
    color: 'cyan',
  },
  writing: {
    label: 'escrever',
    color: 'blue',
  },
  images: {
    label: 'imagens',
    color: 'purple',
  },
  discussion: {
    label: 'discussão/fala',
    color: 'geekblue',
  },
};
