// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * ESQUIADORES ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Esquiadores game
 */
const achievements = achievementBuilder('ESQUIADORES')
  .counter('lodges', {
    doc: 'Number of lodges player placed bets on',
    most: 'MOST_LODGES',
    least: 'FEWEST_LODGES',
  })
  .counter('bets', {
    doc: 'Group bets placed with other players',
    most: 'MOST_GROUP_BETS',
    least: 'FEWEST_GROUP_BETS',
  })
  .counter('initial', {
    doc: 'Initial bets with other players',
    most: 'MOST_GROUP_INITIAL_BETS',
    least: 'FEWEST_GROUP_INITIAL_BETS',
  })
  .counter('boost', {
    doc: 'Boost bets with other players',
    most: 'MOST_GROUP_BOOST_BETS',
    least: 'FEWEST_GROUP_BOOST_BETS',
  })
  .counter('final', {
    doc: 'Final bets with other players',
    most: 'MOST_GROUP_FINAL_BETS',
    least: 'FEWEST_GROUP_FINAL_BETS',
  })
  .counter('onlyLodge', {
    doc: 'Solo bets placed (player was alone in a lodge)',
    most: 'ONLY_LODGE',
  })
  .counter('players', {
    doc: 'Number of different players bet with',
    most: 'MOST_PLAYER_BETS',
    least: 'FEWEST_PLAYER_BETS',
  })
  .counter('betOn', {
    doc: 'Times player was bet on by others',
    most: 'MOST_BET_ON_PLAYER',
    least: 'LEAST_BET_ON_PLAYER',
  })
  .array('highestBet', {
    doc: 'Highest bet values per round to find overall highest',
    extremes: {
      highest: 'HIGHEST_BET',
    },
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  achievements;
