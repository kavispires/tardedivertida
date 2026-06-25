// Tool Kits
import { achievementBuilder } from '../../utils/tool-kits';

/**
 * SENSO_LITERARIO ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

/**
 * Build achievement utilities for Senso Literario game
 */
const sensoLiterarioAchievements = achievementBuilder('SENSO_LITERARIO')
  .counter('childrens', {
    doc: 'How many matches on childrens books',
    most: 'MOST_CHILDRENS_BOOKS_MATCHES',
  })
  .counter('romance', {
    doc: 'How many matches on romance books',
    most: 'MOST_ROMANCE_BOOKS_MATCHES',
  })
  .counter('technical', {
    doc: 'How many matches on technical books',
    most: 'MOST_TECHNICAL_BOOKS_MATCHES',
  })
  .counter('blue', {
    doc: 'How many matches on blue books',
    most: 'MOST_BLUE_BOOKS_MATCHES',
  })
  .counter('yellow', {
    doc: 'How many matches on yellow books',
    most: 'MOST_YELLOW_BOOKS_MATCHES',
  })
  .counter('red', {
    doc: 'How many matches on red books',
    most: 'MOST_RED_BOOKS_MATCHES',
  })
  .counter('A', {
    doc: 'How many matches on A-titled books',
    most: 'MOST_LETTER_A_BOOKS_MATCHES',
  })
  .counter('B', {
    doc: 'How many matches on B-titled books',
    most: 'MOST_LETTER_B_BOOKS_MATCHES',
  })
  .counter('C', {
    doc: 'How many matches on C-titled books',
    most: 'MOST_LETTER_C_BOOKS_MATCHES',
  })
  .counter('D', {
    doc: 'How many matches on D-titled books',
    most: 'MOST_LETTER_D_BOOKS_MATCHES',
  })
  .counter('E', {
    doc: 'How many matches on E-titled books',
    most: 'MOST_LETTER_E_BOOKS_MATCHES',
  })
  .counter('noMatches', {
    doc: 'How many rounds with no matches',
    most: 'MOST_NO_MATCHES',
  })
  .counter('fullMatches', {
    doc: 'How many rounds with full matches',
    most: 'MOST_FULL_MATCHES',
    least: 'FEWEST_FULL_MATCHES',
  })
  .build();

export const { constants, setupAchievements, increaseAchievement, pushAchievement, calculateAchievements } =
  sensoLiterarioAchievements;
