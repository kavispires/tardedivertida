// Types
import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_QUESTIONED_OBJECTS: 'MOST_QUESTIONED_OBJECTS',
  FEWEST_QUESTIONED_OBJECTS: 'FEWEST_QUESTIONED_OBJECTS',
  SINGLE_OBJECT_INQUIRY: 'SINGLE_OBJECT_INQUIRY',
  MOST_CORRECT_OBJECTS: 'MOST_CORRECT_OBJECTS',
  MOST_BLANK_OBJECTS: 'MOST_BLANK_OBJECTS',
  MOST_CURSED_OBJECTS: 'MOST_CURSED_OBJECTS',
  PLAYED_AS_ALIEN: 'PLAYED_AS_ALIEN',
};
export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_QUESTIONED_OBJECTS]: {
    icon: 'loupe',
    title: {
      pt: 'Mais Curioso',
      en: 'Most Curious',
    },
    description: {
      pt: 'Perguntou sobre mais itens que os outros',
      en: 'Inquired more items than anybody else',
    },
  },
  [ACHIEVEMENTS.FEWEST_QUESTIONED_OBJECTS]: {
    icon: 'arrow-narrow',
    title: {
      pt: 'Mais sucinto',
      en: 'Most Succinct',
    },
    description: {
      pt: 'Usou o menor número de itens durante as perguntas',
      en: 'Use the fewest number of items during the inquiries',
    },
  },
  [ACHIEVEMENTS.SINGLE_OBJECT_INQUIRY]: {
    icon: 'one',
    title: {
      pt: 'Mais Objetivo',
      en: 'Most Objective',
    },
    description: {
      pt: 'Fez uma pergunta com apenas um item mais vezes',
      en: 'Made an inquiry with a single item the most',
    },
  },
  [ACHIEVEMENTS.MOST_CORRECT_OBJECTS]: {
    icon: 'check-mark',
    title: {
      pt: 'Mais Preciso',
      en: 'Most Precise',
    },
    description: {
      pt: 'Ofereceu items corretos mais vezes',
      en: 'Offered correct items the most',
    },
  },
  [ACHIEVEMENTS.MOST_CURSED_OBJECTS]: {
    icon: 'skull',
    title: {
      pt: 'Mais Sombrio',
      en: 'Darkest',
    },
    description: {
      pt: 'Ofereceu items amaldiçoados mais vezes',
      en: 'Offered cursed items the most',
    },
  },
  [ACHIEVEMENTS.MOST_BLANK_OBJECTS]: {
    icon: 'box',
    title: {
      pt: 'Mais Neutro',
      en: 'Most Neutral',
    },
    description: {
      pt: 'Ofereceu items neutros mais vezes',
      en: 'Offered neutral items the most',
    },
  },
  [ACHIEVEMENTS.PLAYED_AS_ALIEN]: {
    icon: 'alien',
    title: {
      pt: 'O alienígena',
      en: 'The Alien',
    },
    description: {
      pt: 'Jogou como alienígena',
      en: 'Played as the alien',
    },
  },
};

export default achievementsReference;
