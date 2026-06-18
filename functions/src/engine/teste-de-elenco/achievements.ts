/**
 * TESTE_DE_ELENCO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Teste De Elenco game
 */
const testeDeElencoAchievements = achievementBuilder('TESTE_DE_ELENCO')
  .counter('alone', {
    doc: 'Times they voted alone in an actor',
    most: 'ALONE_VOTES',
  })
  .counter('together', {
    doc: 'Times they voted together in an actor',
    most: 'TOGETHER_VOTES',
  })
  .counter('cast', {
    doc: 'Times they cast an actor',
    most: 'MOST_CAST',
    least: 'FEWEST_CAST',
  })
  .counter('actors', {
    doc: 'How many different actors they voted for',
    most: 'CHANGELING',
    least: 'CONSISTENCY',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = testeDeElencoAchievements;
