// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_DELIVERED_ITEMS: {
    id: 'FEWEST_DELIVERED_ITEMS',
    doc: 'Number of delivered items',
    icon: 'double-arrow-down',
    title: {
      en: 'Economical Deliverer',
      pt: 'Entregador Econômico',
    },
    description: {
      en: 'Delivered the fewest items',
      pt: 'Entregou o menor número de itens',
    },
  },
  MOST_DELIVERED_ITEMS: {
    id: 'MOST_DELIVERED_ITEMS',
    doc: 'Number of delivered items',
    icon: 'double-arrow-up',
    title: {
      en: 'Best Deliverer',
      pt: 'Melhor Entregador',
    },
    description: {
      en: 'Delivered the most items',
      pt: 'Entregou o maior número de itens',
    },
  },
  FEWEST_DELIVERED_AT_ONCE: {
    id: 'FEWEST_DELIVERED_AT_ONCE',
    doc: 'Items delivered at a single round',
    icon: 'arrow-down',
    title: {
      en: 'Drip Feed',
      pt: 'Conta-Gotas',
    },
    description: {
      en: 'Delivered the fewest items in a single round',
      pt: 'Entregou o menor número de itens em uma única rodada',
    },
  },
  MOST_DELIVERED_AT_ONCE: {
    id: 'MOST_DELIVERED_AT_ONCE',
    doc: 'Items delivered at a single round',
    icon: 'arrow-up',
    title: {
      en: 'Heavy Load',
      pt: 'Carga Pesada',
    },
    description: {
      en: 'Delivered the most items in a single round',
      pt: 'Entregou o maior número de itens em uma única rodada',
    },
  },
  FEWEST_NEUTRAL_DELIVERIES: {
    id: 'FEWEST_NEUTRAL_DELIVERIES',
    doc: 'Number of neutral deliveries',
    icon: 'arrow-narrow',
    title: {
      en: 'Least Neutral',
      pt: 'Menos Neutro',
    },
    description: {
      en: 'Delivered the fewest neutral items',
      pt: 'Entregou o menor número de itens neutros',
    },
  },
  MOST_NEUTRAL_DELIVERIES: {
    id: 'MOST_NEUTRAL_DELIVERIES',
    doc: 'Number of neutral deliveries',
    icon: 'arrow-wide',
    title: {
      en: 'Most Neutral',
      pt: 'Mais Neutro',
    },
    description: {
      en: 'Delivered the most neutral items',
      pt: 'Entregou o maior número de itens neutros',
    },
  },
  FEWEST_REQUESTED_AT_ONCE: {
    id: 'FEWEST_REQUESTED_AT_ONCE',
    doc: 'Items requests at a single round',
    icon: 'arrow-left',
    title: {
      en: 'Low Maintenance',
      pt: 'Pouca Exigência',
    },
    description: {
      en: 'Requested the fewest items in a single round',
      pt: 'Pediu o menor número de itens em uma única rodada',
    },
  },
  MOST_REQUESTED_AT_ONCE: {
    id: 'MOST_REQUESTED_AT_ONCE',
    doc: 'Items requests at a single round',
    icon: 'arrow-right',
    title: {
      en: 'Shopping Spree',
      pt: 'Lista de Compras',
    },
    description: {
      en: 'Requested the most items in a single round',
      pt: 'Pediu o maior número de itens em uma única rodada',
    },
  },
  DELIVERED_TABOO: {
    id: 'DELIVERED_TABOO',
    doc: 'Delivered a taboo delivery ending the game',
    icon: 'skull',
    title: {
      en: 'Taboo Deliverer',
      pt: 'Entregador de Tabu',
    },
    description: {
      en: 'Delivered the most taboo items',
      pt: 'Entregou o maior número de itens tabu',
    },
  },
};

export default achievementsReference;
