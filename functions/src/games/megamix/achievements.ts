// Constants
import { GAME_KEYS } from '../../constants/games';
import { SIDES } from './constants';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * MEGAMIX ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Megamix game
 */
const megamixAchievements = achievementBuilder(GAME_KEYS.MEGAMIX)
  .counter('solitaryWinner', {
    doc: 'Times player was alone in VIP area',
    most: 'SOLITARY_VIP',
  })
  .counter('solitaryLoser', {
    doc: 'Times player was alone in loser area',
    most: 'SOLITARY_LOSER',
  })
  .array('longestVIP', {
    doc: 'Longest consecutive run in VIP area',
    run: {
      value: SIDES.WINNER,
      longest: 'LONGEST_VIP',
    },
  })
  .array('longestLoser', {
    doc: 'Longest consecutive run in loser area',
    run: {
      value: SIDES.LOSER,
      longest: 'LONGEST_LOSER',
    },
  })
  .counter('switchedTeam', {
    doc: 'Number of team switches',
    most: 'MOST_SWITCHED',
    least: 'LEAST_SWITCHED',
  })
  .counter('joinedVIP', {
    doc: 'Times moved from loser to VIP',
    most: 'MOST_JOIN',
  })
  .counter('leftVIP', {
    doc: 'Times moved from VIP to loser',
    most: 'MOST_LEFT',
  })
  .counter('catchupBonus', {
    doc: 'Points gained from catchup bonus',
    most: 'MOST_CATCHUP_BONUS',
  })
  .counter('catchupPenalty', {
    doc: 'Points lost from catchup penalty',
    most: 'MOST_CATCHUP_PENALTY',
  })
  .build();

/**
 * Achievement definitions and tracking helpers configured for `megamix`.
 */
export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  megamixAchievements;
