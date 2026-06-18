/**
 * TEORIA_DE_CONJUNTOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Teoria De Conjuntos game
 */
const teoriaDeConjuntosAchievements = achievementBuilder('TEORIA_DE_CONJUNTOS')
  .counter('attributeCircle', {
    doc: 'items placed in the attribute circle',
    most: 'MOST_ATTRIBUTE_CIRCLE',
  })
  .counter('wordCircle', {
    doc: 'items placed in the word circle',
    most: 'MOST_WORD_CIRCLE',
  })
  .counter('contextCircle', {
    doc: 'items placed in the context circle',
    most: 'MOST_CONTEXT_CIRCLE',
  })
  .counter('outside', {
    doc: 'items placed outside the circles',
    most: 'MOST_OUTSIDE',
  })
  .counter('intersection', {
    doc: 'items placed in an intersection',
    most: 'MOST_INTERSECTIONS',
  })
  .counter('judge', {
    doc: 'was the judge',
    most: 'THE_JUDGE',
  })
  .counter('wrong', {
    doc: 'was wrong',
    most: 'MOST_WRONG',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = teoriaDeConjuntosAchievements;
