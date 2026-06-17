// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  WORST_METRICS: {
    id: 'WORST_METRICS',
    doc: 'Number of rounds as presenter where no one guessed correctly',
    icon: 'tie',
    title: {
      en: 'Niche Consultant',
      pt: 'Consultor de Nicho',
    },
    description: {
      en: 'Had metrics that no one guessed correctly the most times',
      pt: 'Teve métricas que ninguém acertou mais vezes',
    },
  },
  BEST_METRICS: {
    id: 'BEST_METRICS',
    doc: 'Number of rounds as presenter where everyone guessed correctly',
    icon: 'graph-increase',
    title: {
      en: 'Mass Consultant',
      pt: 'Consultor de Massa',
    },
    description: {
      en: 'Had metrics that everyone guessed correctly the most times',
      pt: 'Teve métricas que todos acertaram mais vezes',
    },
  },
  FEWEST_DOUBLE_GUESSES: {
    id: 'FEWEST_DOUBLE_GUESSES',
    doc: 'Number of times a player made multiple guesses',
    icon: 'check-mark',
    title: {
      en: 'Most Decisive',
      pt: 'Mais Decidido',
    },
    description: {
      en: 'Changed guesses the least times',
      pt: 'Trocou de palpite menos vezes',
    },
  },
  MOST_DOUBLE_GUESSES: {
    id: 'MOST_DOUBLE_GUESSES',
    doc: 'Number of times a player made multiple guesses',
    icon: 'question-mark',
    title: {
      en: 'Most Indecisive',
      pt: 'Mais Indeciso',
    },
    description: {
      en: 'Changed guesses the most times',
      pt: 'Trocou de palpite mais vezes',
    },
  },
  MOST_LEVEL_1_GUESSES: {
    id: 'MOST_LEVEL_1_GUESSES',
    doc: 'Number of guesses made at level 1',
    icon: 'brain',
    title: {
      en: 'Smartest',
      pt: 'Mais Esperto',
    },
    description: {
      en: 'Made the most guesses when only one metric was visible',
      pt: 'Fez mais palpites quanto somente uma métrica estava visível',
    },
  },
  MOST_LEVEL_2_GUESSES: {
    id: 'MOST_LEVEL_2_GUESSES',
    doc: 'Number of guesses made at level 2',
    icon: 'puzzle',
    title: {
      en: 'Most Insightful',
      pt: 'Mais Perspicaz',
    },
    description: {
      en: 'Made the most guesses when two metrics were visible',
      pt: 'Fez mais palpites quando duas métricas estavam visíveis',
    },
  },
  MOST_LEVEL_3_GUESSES: {
    id: 'MOST_LEVEL_3_GUESSES',
    doc: 'Number of guesses made at level 3',
    icon: 'glasses',
    title: {
      en: 'Most Observant',
      pt: 'Mais Observador',
    },
    description: {
      en: 'Made the most guesses when three metrics were visible',
      pt: 'Fez mais palpites quando três métricas estavam visíveis',
    },
  },
  MOST_LEVEL_4_GUESSES: {
    id: 'MOST_LEVEL_4_GUESSES',
    doc: 'Number of guesses made at level 4',
    icon: 'perception',
    title: {
      en: 'Most Perceptive',
      pt: 'Mais Perceptivo',
    },
    description: {
      en: 'Made the most guesses when four metrics were visible',
      pt: 'Fez mais palpites quando quatro métricas estavam visíveis',
    },
  },
  MOST_LEVEL_5_GUESSES: {
    id: 'MOST_LEVEL_5_GUESSES',
    doc: 'Number of guesses made at level 5',
    icon: 'eye',
    title: {
      en: 'Most Visionary',
      pt: 'Mais Visionário',
    },
    description: {
      en: 'Made the most guesses when all metrics were visible',
      pt: 'Fez mais palpites quando todas as métricas estavam visíveis',
    },
  },
};

export default achievementsReference;
