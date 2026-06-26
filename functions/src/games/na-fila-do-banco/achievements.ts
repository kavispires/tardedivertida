// Constants
import { GAME_KEYS } from '../../constants/games';
// Tool Kits
import { achievementBuilder } from '../../tool-kits/achievements';

/**
 * NA FILA DO BANCO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Na Fila do Banco game
 */
const achievements = achievementBuilder(GAME_KEYS.NA_FILA_DO_BANCO)
  .counter('kid', {
    doc: 'Total Kid cards played',
    most: 'MOST_KID_CARDS',
    least: 'FEWEST_KID_CARDS',
  })
  .counter('retiree', {
    doc: 'Total Retiree cards played',
    most: 'MOST_RETIREE_CARDS',
    least: 'FEWEST_RETIREE_CARDS',
  })
  .counter('veteran', {
    doc: 'Total Veteran cards played',
    most: 'MOST_VETERAN_CARDS',
    least: 'FEWEST_VETERAN_CARDS',
  })
  .counter('motherBaby', {
    doc: 'Total Mother cards played',
    most: 'MOST_MOTHER_CARDS',
    least: 'FEWEST_MOTHER_CARDS',
  })
  .counter('businessman', {
    doc: 'Total Businessman cards played',
    most: 'MOST_BUSINESSMAN_CARDS',
    least: 'FEWEST_BUSINESSMAN_CARDS',
  })
  .counter('student', {
    doc: 'Total Student cards played',
    most: 'MOST_STUDENT_CARDS',
    least: 'FEWEST_STUDENT_CARDS',
  })
  .counter('motoboy', {
    doc: 'Total Motoboy cards played',
    most: 'MOST_MOTOBOY_CARDS',
    least: 'FEWEST_MOTOBOY_CARDS',
  })
  .counter('ownColor', {
    doc: 'Total own color cards played',
    most: 'MOST_OWN_COLOR_CARDS',
    least: 'FEWEST_OWN_COLOR_CARDS',
  })
  .counter('neutral', {
    doc: 'Total neutral color cards played',
    most: 'MOST_NEUTRAL_COLOR_CARDS',
    least: 'FEWEST_NEUTRAL_COLOR_CARDS',
  })
  .counter('cutIns', {
    doc: 'Total times player cut in line',
    most: 'MOST_CUT_INS',
    least: 'FEWEST_CUT_INS',
  })
  .counter('gotCut', {
    doc: 'Total times player got cut in line',
    most: 'MOST_GOT_CUT',
    least: 'FEWEST_GOT_CUT',
  })
  .counter('stays', {
    doc: 'Total times player stayed in place',
    most: 'MOST_STAYS',
    least: 'FEWEST_STAYS',
  })
  .counter('online', {
    doc: 'Total online triggers',
    most: 'MOST_ONLINE_TRIGGERS',
    least: 'FEWEST_ONLINE_TRIGGERS',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, calculateAchievements } = achievements;
