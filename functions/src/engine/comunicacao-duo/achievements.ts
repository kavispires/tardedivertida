/**
 * COMUNICACAO DUO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Comunicacao Duo game
 */
const achievements = achievementBuilder('COMUNICACAO_DUO')
  .array('requestsPerRound', {
    doc: 'Items requests at a single round',
    extremes: {
      highest: 'MOST_REQUESTED_AT_ONCE',
      lowest: 'FEWEST_REQUESTED_AT_ONCE',
    },
  })
  .array('deliveriesPerRound', {
    doc: 'Items delivered at a single round',
    extremes: {
      highest: 'MOST_DELIVERED_AT_ONCE',
      lowest: 'FEWEST_DELIVERED_AT_ONCE',
    },
  })
  .counter('correctDeliveries', {
    doc: 'Number of delivered items',
    most: 'MOST_DELIVERED_ITEMS',
    least: 'FEWEST_DELIVERED_ITEMS',
  })
  .counter('neutralDeliveries', {
    doc: 'Number of neutral deliveries',

    most: 'MOST_NEUTRAL_DELIVERIES',
    least: 'FEWEST_NEUTRAL_DELIVERIES',
  })
  .truthy('tabooDelivery', {
    doc: 'Delivered a taboo delivery ending the game',
    key: 'DELIVERED_TABOO',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
  setTruthy: setTruthyAchievement,
  addToLast: addToLastAchievement,
} = achievements;
