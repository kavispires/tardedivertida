// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * CONTROLE DE ESTOQUE ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Controle de Estoque game
 */
const achievements = achievementBuilder('CONTROLE_DE_ESTOQUE')
  .counter('attempts', {
    doc: 'Attempted to fulfill an order',
    most: 'MOST_FULFILLMENT_ATTEMPTS_OVERALL',
    least: 'FEWEST_FULFILLMENT_ATTEMPTS_OVERALL',
  })
  .counter('attemptsRound1', {
    doc: 'Attempted to fulfill an order',
    most: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_1',
    least: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_1',
  })
  .counter('attemptsRound2', {
    doc: 'Attempted to fulfill an order',
    most: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_2',
    least: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_2',
  })
  .counter('attemptsRound3', {
    doc: 'Attempted to fulfill an order',
    most: 'MOST_FULFILLMENT_ATTEMPTS_ROUND_3',
    least: 'FEWEST_FULFILLMENT_ATTEMPTS_ROUND_3',
  })
  .array('correctAtOnce', {
    doc: 'Correctly fulfilled orders in a single round',
    extremes: {
      highest: 'MOST_FULFILLED_AT_ONCE',
    },
  })
  .counter('skips', {
    doc: 'Skipped orders',
    most: 'MOST_SKIPPED_ORDERS',
  })
  .counter('outOfStockAttempts', {
    doc: 'Orders marked as out of stock',
    most: 'MOST_OUT_OF_STOCK_ATTEMPTS',
    least: 'FEWEST_OUT_OF_STOCK_ATTEMPTS',
  })
  .counter('correctOutOfStock', {
    doc: 'Correctly identified out of stock orders',
    most: 'MOST_CORRECT_OUT_OF_STOCK_ORDERS',
    least: 'FEWEST_CORRECT_OUT_OF_STOCK_ORDERS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements, pushAchievement } =
  achievements;
