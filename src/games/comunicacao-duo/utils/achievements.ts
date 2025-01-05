// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  DELIVERED_TABOO: 'DELIVERED_TABOO',
  MOST_REQUESTED_AT_ONCE: 'MOST_REQUESTED_AT_ONCE',
  FEWEST_REQUESTED_AT_ONCE: 'FEWEST_REQUESTED_AT_ONCE',
  MOST_DELIVERED_ITEMS: 'MOST_DELIVERED_ITEMS',
  FEWEST_DELIVERED_ITEMS: 'FEWEST_DELIVERED_ITEMS',
  MOST_DELIVERED_AT_ONCE: 'MOST_DELIVERED_AT_ONCE',
  FEWEST_DELIVERED_AT_ONCE: 'FEWEST_DELIVERED_AT_ONCE',
  MOST_NEUTRAL_DELIVERIES: 'MOST_NEUTRAL_DELIVERIES',
  FEWEST_NEUTRAL_DELIVERIES: 'FEWEST_NEUTRAL_DELIVERIES',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.DELIVERED_TABOO]: {
    icon: 'skull',
    title: {
      pt: 'Entregador de Tabu',
      en: 'Taboo Deliverer',
    },
    description: {
      pt: 'Entregou o maior número de itens tabu',
      en: 'Delivered the most taboo items',
    },
  },
  [ACHIEVEMENTS.MOST_REQUESTED_AT_ONCE]: {
    icon: 'dialog',
    title: {
      pt: 'Melhores Dicas',
      en: 'Best Clues',
    },
    description: {
      pt: 'Fez o maior número de pedidos de uma vez',
      en: 'Made the most requests at once',
    },
  },
  [ACHIEVEMENTS.FEWEST_REQUESTED_AT_ONCE]: {
    icon: 'thought',
    title: {
      en: 'Most Specific Clues',
      pt: 'Dicas Mais Específicas',
    },
    description: {
      pt: 'Fez o menor número de pedidos de uma vez',
      en: 'Made the fewest requests at once',
    },
  },
  [ACHIEVEMENTS.MOST_DELIVERED_ITEMS]: {
    icon: 'double-arrow-up',
    title: {
      pt: 'Melhor Entregador',
      en: 'Best Deliverer',
    },
    description: {
      pt: 'Entregou o maior número de itens',
      en: 'Delivered the most items',
    },
  },
  [ACHIEVEMENTS.FEWEST_DELIVERED_ITEMS]: {
    icon: 'double-arrow-down',
    title: {
      pt: 'Entregador Econômico',
      en: 'Economical Deliverer',
    },
    description: {
      pt: 'Entregou o menor número de itens',
      en: 'Delivered the fewest items',
    },
  },
  [ACHIEVEMENTS.MOST_DELIVERED_AT_ONCE]: {
    icon: 'plus',
    title: {
      pt: 'Mais Eficiente',
      en: 'Most Efficient',
    },
    description: {
      pt: 'Entregou o maior número de itens de uma vez',
      en: 'Delivered the most items at once',
    },
  },
  [ACHIEVEMENTS.FEWEST_DELIVERED_AT_ONCE]: {
    icon: 'minus',
    title: {
      pt: 'Mais Comedido',
      en: 'Most Reserved',
    },
    description: {
      pt: 'Entregou o menor número de itens de uma vez',
      en: 'Delivered the fewest items at once',
    },
  },
  [ACHIEVEMENTS.MOST_NEUTRAL_DELIVERIES]: {
    icon: 'arrow-wide',
    title: {
      pt: 'Mais Neutro',
      en: 'Most Neutral',
    },
    description: {
      pt: 'Entregou o maior número de itens neutros',
      en: 'Delivered the most neutral items',
    },
  },
  [ACHIEVEMENTS.FEWEST_NEUTRAL_DELIVERIES]: {
    icon: 'arrow-narrow',
    title: {
      pt: 'Menos Neutro',
      en: 'Least Neutral',
    },
    description: {
      pt: 'Entregou o menor número de itens neutros',
      en: 'Delivered the fewest neutral items',
    },
  },
};

export default achievementsReference;
