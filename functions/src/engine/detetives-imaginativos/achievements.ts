/**
 * DETETIVES IMAGINATIVOS ACHIEVEMENTS
 * Type-safe achievement definitions using the achievements toolkit
 */

import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Build achievement utilities for Detetives Imaginativos game
 */
const achievements = achievementBuilder('DETETIVES_IMAGINATIVOS')
  .counter('artistPoints', {
    doc: 'Points earned as the leader/artist',
    most: 'MOST_LEADER',
  })
  .counter('impostorPoints', {
    doc: 'Points earned as the impostor',
    most: 'MOST_IMPOSTOR',
  })
  .counter('clueLength', {
    doc: 'Total length of clues given',
    most: 'LONGEST_CLUES',
    least: 'SHORTEST_CLUES',
  })
  .counter('defenseTime', {
    doc: 'Total time spent defending',
    most: 'LONGEST_DEFENSE',
    least: 'SHORTEST_DEFENSE',
  })
  .counter('votedForImpostor', {
    doc: 'Times voting for the impostor',
    most: 'VOTED_FOR_IMPOSTOR',
  })
  .counter('votedForInnocent', {
    doc: 'Times voting for innocent players',
    most: 'VOTED_FOR_INNOCENT',
  })
  .counter('receivedVotes', {
    doc: 'Votes received from other players',
    most: 'RECEIVED_VOTES',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  calculate: getAchievements,
} = achievements;
