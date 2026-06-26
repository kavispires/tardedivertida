// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * TEORIA_DE_CONJUNTOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Teoria De Conjuntos game
 */
const teoriaDeConjuntosAchievements = achievementBuilder(GAME_KEYS.TEORIA_DE_CONJUNTOS)
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

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  teoriaDeConjuntosAchievements;
