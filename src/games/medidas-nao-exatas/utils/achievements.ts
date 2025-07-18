// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_DOUBLE_GUESSES: 'MOST_DOUBLE_GUESSES',
  FEWEST_DOUBLE_GUESSES: 'FEWEST_DOUBLE_GUESSES',
  WORST_METRICS: 'WORST_METRICS',
  BEST_METRICS: 'BEST_METRICS',
  MOST_LEVEL_1_GUESSES: 'MOST_LEVEL_1_GUESSES',
  MOST_LEVEL_2_GUESSES: 'MOST_LEVEL_2_GUESSES',
  MOST_LEVEL_3_GUESSES: 'MOST_LEVEL_3_GUESSES',
  MOST_LEVEL_4_GUESSES: 'MOST_LEVEL_4_GUESSES',
  MOST_LEVEL_5_GUESSES: 'MOST_LEVEL_5_GUESSES',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_DOUBLE_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Indeciso',
      en: 'Most Indecisive',
    },
    description: {
      pt: 'Trocou de palpite mais vezes',
      en: 'Changed guesses the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_DOUBLE_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Decidido',
      en: 'Most Decisive',
    },
    description: {
      pt: 'Trocou de palpite menos vezes',
      en: 'Changed guesses the least times',
    },
  },
  [ACHIEVEMENTS.WORST_METRICS]: {
    icon: 'trophy',
    title: {
      pt: 'Consultor de Nicho',
      en: 'Niche Consultant',
    },
    description: {
      pt: 'Teve métricas que ninguém acertou mais vezes',
      en: 'Had metrics that no one guessed correctly the most times',
    },
  },
  [ACHIEVEMENTS.BEST_METRICS]: {
    icon: 'trophy',
    title: {
      pt: 'Consultor de Massa',
      en: 'Mass Consultant',
    },
    description: {
      pt: 'Teve métricas que todos acertaram mais vezes',
      en: 'Had metrics that everyone guessed correctly the most times',
    },
  },
  [ACHIEVEMENTS.MOST_LEVEL_1_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Esperto',
      en: 'Smartest',
    },
    description: {
      pt: 'Fez mais palpites quanto somente uma métrica estava visível',
      en: 'Made the most guesses when only one metric was visible',
    },
  },
  [ACHIEVEMENTS.MOST_LEVEL_2_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Perspicaz',
      en: 'Most Insightful',
    },
    description: {
      pt: 'Fez mais palpites quando duas métricas estavam visíveis',
      en: 'Made the most guesses when two metrics were visible',
    },
  },
  [ACHIEVEMENTS.MOST_LEVEL_3_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Observador',
      en: 'Most Observant',
    },
    description: {
      pt: 'Fez mais palpites quando três métricas estavam visíveis',
      en: 'Made the most guesses when three metrics were visible',
    },
  },
  [ACHIEVEMENTS.MOST_LEVEL_4_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Perceptivo',
      en: 'Most Perceptive',
    },
    description: {
      pt: 'Fez mais palpites quando quatro métricas estavam visíveis',
      en: 'Made the most guesses when four metrics were visible',
    },
  },
  [ACHIEVEMENTS.MOST_LEVEL_5_GUESSES]: {
    icon: 'trophy',
    title: {
      pt: 'Mais Visionário',
      en: 'Most Visionary',
    },
    description: {
      pt: 'Fez mais palpites quando todas as métricas estavam visíveis',
      en: 'Made the most guesses when all metrics were visible',
    },
  },
};

export default achievementsReference;
