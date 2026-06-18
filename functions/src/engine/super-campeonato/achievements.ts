/**
 * SUPER_CAMPEONATO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Super Campeonato game
 */
const superCampeonatoAchievements = achievementBuilder('SUPER_CAMPEONATO')
  .counter('quarterBets', {
    doc: 'times won during quarter finals',
    most: 'BEST_QUARTER_BETS',
    least: 'WORST_QUARTER_BETS',
  })
  .counter('semiBets', {
    doc: 'times won during semi finals',
    most: 'BEST_SEMI_BETS',
    least: 'WORST_SEMI_BETS',
  })
  .counter('finalBets', {
    doc: 'times won during final',
    most: 'BEST_FINAL_BETS',
    least: 'WORST_FINAL_BETS',
  })
  .counter('bets', {
    doc: 'total bets won',
    most: 'BEST_OVERALL_BETS',
    least: 'WORST_OVERALL_BETS',
  })
  .counter('quarterContender', {
    doc: 'own contender won during quarter finals',
    most: 'BEST_QUARTER_CONTENDERS',
    least: 'WORST_QUARTER_CONTENDERS',
  })
  .counter('semiContender', {
    doc: 'own contender won during semi finals',
    most: 'BEST_SEMI_CONTENDERS',
    least: 'WORST_SEMI_CONTENDERS',
  })
  .counter('finalContender', {
    doc: 'own contender won during final',
    most: 'BEST_FINAL_CONTENDERS',
    least: 'WORST_FINAL_CONTENDERS',
  })
  .counter('contender', {
    doc: 'total contenders won',
    most: 'BEST_CONTENDERS',
    least: 'WORST_CONTENDERS',
  })
  .counter('groupVotes', {
    doc: 'voted on a contender with other players',
    most: 'MOST_GROUP_VOTES',
  })
  .counter('solitaireVote', {
    doc: 'voted on a contender alone',
    most: 'SOLITAIRE_VOTE',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  calculate: getAchievements,
} = superCampeonatoAchievements;
