// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_STOPS: 'MOST_STOPS',
  NEVER_STOPPED: 'NEVER_STOPPED',
  MOST_FIRST_ANSWERS: 'MOST_FIRST_ANSWERS',
  LEAST_FIRST_ANSWERS: 'LEAST_FIRST_ANSWERS',
  MOST_CELLS: 'MOST_CELLS',
  FEWEST_CELLS: 'FEWEST_CELLS',
  MOST_AUTO_REJECTS: 'MOST_AUTO_REJECTS',
  MOST_REJECTS: 'MOST_REJECTS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_STOPS]: {
    icon: 'siren',
    title: {
      en: 'Most Stops',
      pt: 'Mais Stops',
    },
    description: {
      en: 'Pressed stop the most times.',
      pt: 'Jogador que mais apertou stop.',
    },
  },
  [ACHIEVEMENTS.NEVER_STOPPED]: {
    icon: 'clock',
    title: {
      en: 'Never Stopped',
      pt: 'Nunca Parou',
    },
    description: {
      en: 'Never pressed stop.',
      pt: 'Jogador que nunca apertou stop.',
    },
  },
  [ACHIEVEMENTS.MOST_FIRST_ANSWERS]: {
    icon: 'stopwatch',
    title: {
      en: 'Fastest Fingers',
      pt: 'Ligeirinho',
    },
    description: {
      en: 'First to answer the most times.',
      pt: 'Jogador que mais respondeu primeiro.',
    },
  },
  [ACHIEVEMENTS.LEAST_FIRST_ANSWERS]: {
    icon: 'snail',
    title: {
      en: 'Slow and Steady',
      pt: 'Devagar e Sempre',
    },
    description: {
      en: 'First to answer the least times.',
      pt: 'Jogador que menos respondeu primeiro.',
    },
  },
  [ACHIEVEMENTS.MOST_CELLS]: {
    icon: 'brain',
    title: {
      en: 'Most Answers',
      pt: 'Mais Respostas',
    },
    description: {
      en: 'Answered the most cells.',
      pt: 'Jogador que mais respondeu.',
    },
  },
  [ACHIEVEMENTS.FEWEST_CELLS]: {
    icon: 'minus',
    title: {
      en: 'Fewest Answers',
      pt: 'Menos Respostas',
    },
    description: {
      en: 'Answered the least cells.',
      pt: 'Jogador que menos respondeu.',
    },
  },
  [ACHIEVEMENTS.MOST_AUTO_REJECTS]: {
    icon: 'donkey',
    title: {
      en: 'Most Auto Rejected Answer',
      pt: 'Mais Respostas Erradas',
    },
    description: {
      en: 'Got auto-rejected answers the most for not following the letters.',
      pt: 'Jogador que teve as respostas auto-rejeitadas mais vezes por não seguir as letras.',
    },
  },
  [ACHIEVEMENTS.MOST_REJECTS]: {
    icon: 'block',
    title: {
      en: 'Most Hated by Others',
      pt: 'Mais Odiado pelos outros',
    },
    description: {
      en: 'Got rejected answers the most by other players.',
      pt: 'Jogador que teve as respostas rejeitadas mais vezes pelos outros.',
    },
  },
};

export default achievementsReference;
