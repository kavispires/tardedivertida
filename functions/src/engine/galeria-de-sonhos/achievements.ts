import { achievementBuilder } from '../../utils/tool-kits';

/**
 * Galeria de Sonhos achievements system
 */
const achievements = achievementBuilder('GALERIA_DE_SONHOS')
  .counter('matches', {
    doc: 'Number of times player matched with other players',
    most: 'MOST_MATCHES',
    least: 'FEWEST_MATCHES',
  })
  .counter('fullMatches', {
    doc: 'Number of rounds where all cards matched',
    most: 'MOST_FULL_MATCHES',
  })
  .counter('dreamCount', {
    doc: 'Total number of dream cards selected',
    most: 'MOST_VISITS',
    least: 'LEAST_ADVENTUROUS',
  })
  .counter('nightmare', {
    doc: 'Number of times player was in a nightmare (had most cards)',
    most: 'MOST_ADVENTUROUS',
  })
  .counter('pairs', {
    doc: 'Number of times player matched with exactly one other player',
    most: 'MOST_PAIRS',
  })
  .counter('noMatches', {
    doc: 'Number of cards that did not match with anyone',
    most: 'MOST_OUT_OF_THE_BOX',
  })
  .counter('zeroMatches', {
    doc: 'Number of rounds where player had zero matches',
    most: 'MOST_LONELY',
  })
  .counter('falls', {
    doc: 'Number of times player fell (nightmare penalty)',
    most: 'POOREST_CHOICES',
    least: 'SMARTEST_CHOICES',
  })
  .build();

export const {
  constants,
  setup: setupAchievements,
  increase: increaseAchievement,
  calculate: getAchievements,
} = achievements;
