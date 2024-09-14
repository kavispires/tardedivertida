// Types
import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_FIRST_POSITIONS: 'MOST_FIRST_POSITIONS',
  FEWEST_FIRST_POSITIONS: 'FEWEST_FIRST_POSITIONS',
  MOST_SECOND_POSITIONS: 'MOST_SECOND_POSITIONS',
  FEWEST_SECOND_POSITIONS: 'FEWEST_SECOND_POSITIONS',
  MOST_THIRD_POSITIONS: 'MOST_THIRD_POSITIONS',
  FEWEST_THIRD_POSITIONS: 'FEWEST_THIRD_POSITIONS',
  MOST_FOURTH_POSITIONS: 'MOST_FOURTH_POSITIONS',
  FEWEST_FOURTH_POSITIONS: 'FEWEST_FOURTH_POSITIONS',
  MOST_FIFTH_POSITIONS: 'MOST_FIFTH_POSITIONS',
  FEWEST_FIFTH_POSITIONS: 'FEWEST_FIFTH_POSITIONS',
  BEST_COMMON_SENSE: 'BEST_COMMON_SENSE',
  WORST_COMMON_SENSE: 'WORST_COMMON_SENSE',
  PERFECT_GUESS: 'PERFECT_GUESS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_FIRST_POSITIONS]: {
    icon: 'one',
    title: {
      pt: 'Melhores 1s',
      en: 'Best #1s',
    },
    description: {
      pt: 'Acertou cenários na posição 1 mais vezes',
      en: 'Guessed scenarios in the #1 position correctly the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_FIRST_POSITIONS]: {
    icon: 'one',
    title: {
      pt: 'Piores 1s',
      en: 'Worst #1s',
    },
    description: {
      pt: 'Errou cenários na posição 1 mais vezes',
      en: 'Guessed scenarios in the #1 position wrong the most times',
    },
  },
  [ACHIEVEMENTS.MOST_SECOND_POSITIONS]: {
    icon: 'two',
    title: {
      pt: 'Melhores 2s',
      en: 'Best #2s',
    },
    description: {
      pt: 'Acertou cenários na posição 2 mais vezes',
      en: 'Guessed scenarios in the #2 position correctly the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_SECOND_POSITIONS]: {
    icon: 'two',
    title: {
      pt: 'Piores 2s',
      en: 'Worst #2s',
    },
    description: {
      pt: 'Errou cenários na posição 2 mais vezes',
      en: 'Guessed scenarios in the #2 position wrong the most times',
    },
  },
  [ACHIEVEMENTS.MOST_THIRD_POSITIONS]: {
    icon: 'three',
    title: {
      pt: 'Melhores 3s',
      en: 'Best #3s',
    },
    description: {
      pt: 'Acertou cenários na posição 3 mais vezes',
      en: 'Guessed scenarios in the #3 position correctly the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_THIRD_POSITIONS]: {
    icon: 'three',
    title: {
      pt: 'Piores 3s',
      en: 'Worst #3s',
    },
    description: {
      pt: 'Errou cenários na posição 3 mais vezes',
      en: 'Guessed scenarios in the #3 position wrong the most times',
    },
  },
  [ACHIEVEMENTS.MOST_FOURTH_POSITIONS]: {
    icon: 'four',
    title: {
      pt: 'Melhores 4s',
      en: 'Best #4s',
    },
    description: {
      pt: 'Acertou cenários na posição 4 mais vezes',
      en: 'Guessed scenarios in the #4 position correctly the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_FOURTH_POSITIONS]: {
    icon: 'four',
    title: {
      pt: 'Piores 4s',
      en: 'Worst #4s',
    },
    description: {
      pt: 'Errou cenários na posição 4 mais vezes',
      en: 'Guessed scenarios in the #4 position wrong the most times',
    },
  },
  [ACHIEVEMENTS.MOST_FIFTH_POSITIONS]: {
    icon: 'five',
    title: {
      pt: 'Melhores 5s',
      en: 'Best #5s',
    },
    description: {
      pt: 'Acertou cenários na posição 5 mais vezes',
      en: 'Guessed scenarios in the #5 position correctly the most times',
    },
  },
  [ACHIEVEMENTS.FEWEST_FIFTH_POSITIONS]: {
    icon: 'five',
    title: {
      pt: 'Piores 5s',
      en: 'Worst #5s',
    },
    description: {
      pt: 'Errou cenários na posição 5 mais vezes',
      en: 'Guessed scenarios in the #5 position wrong the most times',
    },
  },
  [ACHIEVEMENTS.BEST_COMMON_SENSE]: {
    icon: 'scale',
    title: {
      pt: 'Melhor Senso Comum',
      en: 'Best Common Sense',
    },
    description: {
      pt: 'Teve jogadores acertando seus cenários mais vezes',
      en: 'Had players guessing your scenarios the most times',
    },
  },
  [ACHIEVEMENTS.WORST_COMMON_SENSE]: {
    icon: 'person',
    title: {
      pt: 'Mais individualista',
      en: 'Most Individualistic',
    },
    description: {
      pt: 'Teve jogadores acertando seus cenários menos vezes',
      en: 'Had players guessing your scenarios the fewest times',
    },
  },
  [ACHIEVEMENTS.PERFECT_GUESS]: {
    icon: 'graph-increase',
    title: {
      pt: 'Mais Completamente Correto',
      en: 'Most Perfect Kills',
    },
    description: {
      pt: 'Acertou todos cenários nem mais rodadas',
      en: 'Guessed all scenarios correctly in more rounds',
    },
  },
};

export default achievementsReference;
