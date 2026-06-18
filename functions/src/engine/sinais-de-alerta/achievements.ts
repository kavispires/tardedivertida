/**
 * SINAIS_DE_ALERTA ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Sinais De Alerta game
 */
const sinaisDeAlertaAchievements = achievementBuilder('SINAIS_DE_ALERTA')
  .counter('subjectGuesses', {
    doc: 'Times it got the subject right',
    most: 'MOST_SUBJECTS',
    least: 'FEWEST_SUBJECTS',
  })
  .counter('descriptorGuesses', {
    doc: 'Times it got the descriptor right',
    most: 'MOST_DESCRIPTORS',
    least: 'FEWEST_DESCRIPTORS',
  })
  .counter('subjectDrawings', {
    doc: 'Times players got the subject right based on your drawing',
    most: 'BEST_SUBJECT',
    least: 'WORST_SUBJECT',
  })
  .counter('descriptorDrawings', {
    doc: 'Times players got the descriptor right based on your drawing',
    most: 'BEST_DESCRIPTOR',
    least: 'WORST_DESCRIPTOR',
  })
  .counter('chooseForMe', {
    doc: 'Times players pressed the "Choose for me" button',
    most: 'CHOOSE_FOR_ME',
  })
  .counter('tableVotes', {
    doc: 'Times players voted for the table',
    most: 'TABLE_VOTES',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  push: pushAchievement,
  calculate: getAchievements,
} = sinaisDeAlertaAchievements;
