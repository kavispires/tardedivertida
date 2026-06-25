// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * CORREIO_DO_AMOR ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for CorreioDoAmor game
 */
const achievements = achievementBuilder('CORREIO_DO_AMOR')
  .counter('playedRank0', {
    doc: 'Number of plays of rank 0 cards',
    most: 'MOST_PLAYED_RANK_0',
  })
  .counter('playedRank1', {
    doc: 'Number of plays of rank 1 cards',
    most: 'MOST_PLAYED_RANK_1',
  })
  .counter('playedRank2', {
    doc: 'Number of plays of rank 2 cards',
    most: 'MOST_PLAYED_RANK_2',
  })
  .counter('playedRank3', {
    doc: 'Number of plays of rank 3 cards',
    most: 'MOST_PLAYED_RANK_3',
  })
  .counter('playedRank4', {
    doc: 'Number of plays of rank 4 cards',
    most: 'MOST_PLAYED_RANK_4',
  })
  .counter('playedRank5', {
    doc: 'Number of plays of rank 5 cards',
    most: 'MOST_PLAYED_RANK_5',
  })
  .counter('playedRank6', {
    doc: 'Number of plays of rank 6 cards',
    most: 'MOST_PLAYED_RANK_6',
  })
  .counter('playedRank7', {
    doc: 'Number of plays of rank 7 cards',
    most: 'MOST_PLAYED_RANK_7',
  })
  .counter('playedRank8', {
    doc: 'Number of plays of rank 8 cards',
    most: 'MOST_PLAYED_RANK_8',
  })
  .counter('playedRank9', {
    doc: 'Number of plays of rank 9 cards',
    most: 'MOST_PLAYED_RANK_9',
  })
  .counter('playedRank10', {
    doc: 'Number of plays of rank 10 cards',
    most: 'MOST_PLAYED_RANK_10',
  })
  .counter('playedRank11', {
    doc: 'Number of plays of rank 11 cards',
    most: 'MOST_PLAYED_RANK_11',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
