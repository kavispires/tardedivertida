// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_FULFILLMENT_ATTEMPTS_OVERALL: {
    id: 'FEWEST_FULFILLMENT_ATTEMPTS_OVERALL',
    doc: 'Attempted to fulfill an order',
    icon: 'snail',
    title: {
      en: 'Relaxed Pace',
      pt: 'Ritmo Leve',
    },
    description: {
      en: 'Attempted to fulfill the fewest orders overall',
      pt: 'Tentou atender ao menor número de pedidos no total',
    },
  },
  MOST_FULFILLMENT_ATTEMPTS_OVERALL: {
    id: 'MOST_FULFILLMENT_ATTEMPTS_OVERALL',
    doc: 'Attempted to fulfill an order',
    icon: 'fire',
    title: {
      en: 'Employee of the Month',
      pt: 'Funcionário do Mês',
    },
    description: {
      en: 'Attempted to fulfill the most orders overall',
      pt: 'Tentou atender ao maior número de pedidos no total',
    },
  },
  FEWEST_FULFILLMENT_ATTEMPTS_ROUND_1: {
    id: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_1',
    doc: 'Attempted to fulfill an order',
    icon: 'one-silver',
    title: {
      en: 'Slow Start',
      pt: 'Aquecendo os Motores',
    },
    description: {
      en: 'Attempted to fulfill the fewest orders in round 1',
      pt: 'Tentou atender ao menor número de pedidos na rodada 1',
    },
  },
  MOST_FULFILLMENT_ATTEMPTS_ROUND_1: {
    id: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_1',
    doc: 'Attempted to fulfill an order',
    icon: 'one',
    title: {
      en: 'Flying Start',
      pt: 'Largada Rápida',
    },
    description: {
      en: 'Attempted to fulfill the most orders in round 1',
      pt: 'Tentou atender ao maior número de pedidos na rodada 1',
    },
  },
  FEWEST_FULFILLMENT_ATTEMPTS_ROUND_2: {
    id: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_2',
    doc: 'Attempted to fulfill an order',
    icon: 'two-silver',
    title: {
      en: 'Mid-Game Break',
      pt: 'Pausa pro Café',
    },
    description: {
      en: 'Attempted to fulfill the fewest orders in round 2',
      pt: 'Tentou atender ao menor número de pedidos na rodada 2',
    },
  },
  MOST_FULFILLMENT_ATTEMPTS_ROUND_2: {
    id: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_2',
    doc: 'Attempted to fulfill an order',
    icon: 'two',
    title: {
      en: 'Peak Efficiency',
      pt: 'Hora do Rush',
    },
    description: {
      en: 'Attempted to fulfill the most orders in round 2',
      pt: 'Tentou atender ao maior número de pedidos na rodada 2',
    },
  },
  FEWEST_FULFILLMENT_ATTEMPTS_ROUND_3: {
    id: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_3',
    doc: 'Attempted to fulfill an order',
    icon: 'three-silver',
    title: {
      en: 'Coasting Home',
      pt: 'Quase Férias',
    },
    description: {
      en: 'Attempted to fulfill the fewest orders in round 3',
      pt: 'Tentou atender ao menor número de pedidos na rodada 3',
    },
  },
  MOST_FULFILLMENT_ATTEMPTS_ROUND_3: {
    id: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_3',
    doc: 'Attempted to fulfill an order',
    icon: 'three',
    title: {
      en: 'Grand Finale',
      pt: 'Arrancada Final',
    },
    description: {
      en: 'Attempted to fulfill the most orders in round 3',
      pt: 'Tentou atender ao maior número de pedidos na rodada 3',
    },
  },
  MOST_FULFILLED_AT_ONCE: {
    id: 'MOST_FULFILLED_AT_ONCE',
    doc: 'Correctly fulfilled orders in a single round',
    icon: 'trophy',
    title: {
      en: 'Combo Master',
      pt: 'Combo Humano',
    },
    description: {
      en: 'Correctly fulfilled the most orders in a single round',
      pt: 'Atendeu corretamente ao maior número de pedidos em uma única rodada',
    },
  },
  FEWEST_CORRECT_OUT_OF_STOCK_ORDERS: {
    id: 'FEWEST_CORRECT_OUT_OF_STOCK_ORDERS',
    doc: 'Correctly identified out of stock orders',
    icon: 'face-oops',
    title: {
      en: 'Eternal Optimist',
      pt: 'Otimista Eterno',
    },
    description: {
      en: 'Correctly identified the fewest out-of-stock orders',
      pt: 'Identificou corretamente o menor número de pedidos sem estoque',
    },
  },
  MOST_CORRECT_OUT_OF_STOCK_ORDERS: {
    id: 'MOST_CORRECT_OUT_OF_STOCK_ORDERS',
    doc: 'Correctly identified out of stock orders',
    icon: 'glasses',
    title: {
      en: 'Eagle Eyed Inspector',
      pt: 'Olho de Águia',
    },
    description: {
      en: 'Correctly identified the most out-of-stock orders',
      pt: 'Identificou corretamente o maior número de pedidos sem estoque',
    },
  },
  FEWEST_OUT_OF_STOCK_ATTEMPTS: {
    id: 'FEWEST_OUT_OF_STOCK_ATTEMPTS',
    doc: 'Orders marked as out of stock',
    icon: 'box',
    title: {
      en: 'Believer in Abundance',
      pt: 'Depósito Cheio',
    },
    description: {
      en: 'Marked the fewest orders as out of stock',
      pt: 'Marcou o menor número de pedidos como sem estoque',
    },
  },
  MOST_OUT_OF_STOCK_ATTEMPTS: {
    id: 'MOST_OUT_OF_STOCK_ATTEMPTS',
    doc: 'Orders marked as out of stock',
    icon: 'empty-box',
    title: {
      en: 'The Skeptic',
      pt: 'Cético do Estoque',
    },
    description: {
      en: 'Marked the most orders as out of stock',
      pt: 'Marcou o maior número de pedidos como sem estoque',
    },
  },
  MOST_SKIPPED_ORDERS: {
    id: 'MOST_SKIPPED_ORDERS',
    doc: 'Skipped orders',
    icon: 'arrow-right',
    title: {
      en: 'Next Please',
      pt: 'Passa a Vez',
    },
    description: {
      en: 'Skipped the most orders',
      pt: 'Pulou o maior número de pedidos',
    },
  },
};

export default achievementsReference;
