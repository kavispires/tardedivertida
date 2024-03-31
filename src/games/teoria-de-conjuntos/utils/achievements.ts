import { AchievementReference } from 'types/achievements';

export const ACHIEVEMENTS = {
  MOST_ATTRIBUTE_CIRCLE: 'MOST_ATTRIBUTE_CIRCLE',
  MOST_WORD_CIRCLE: 'MOST_WORD_CIRCLE',
  MOST_CONTEXT_CIRCLE: 'MOST_CONTEXT_CIRCLE',
  MOST_OUTSIDE: 'MOST_OUTSIDE',
  MOST_INTERSECTIONS: 'MOST_INTERSECTIONS',
  THE_JUDGE: 'THE_JUDGE',
  MOST_WRONG: 'MOST_WRONG',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_ATTRIBUTE_CIRCLE]: {
    icon: 'check-mark',
    title: {
      pt: 'Mais Atributos',
      en: 'Most Attributes',
    },
    description: {
      pt: 'Posicionou coisas no círculo azul (atributo) mais vezes',
      en: 'Placed things in the blue circle (attribute) the most',
    },
  },
  [ACHIEVEMENTS.MOST_WORD_CIRCLE]: {
    icon: 'people',
    title: {
      pt: 'Mais Palavras',
      en: 'Most Words',
    },
    description: {
      pt: 'Posicionou coisas no círculo amarelo (palavra) mais vezes',
      en: 'Placed things in the yellow circle (word) the most',
    },
  },
  [ACHIEVEMENTS.MOST_CONTEXT_CIRCLE]: {
    icon: 'arrow-wide',
    title: {
      pt: 'Mais Contextos',
      en: 'Most Contexts',
    },
    description: {
      pt: 'Posicionou coisas no círculo verde (contexto) mais vezes',
      en: 'Placed things in the green circle (context) the most',
    },
  },
  [ACHIEVEMENTS.MOST_OUTSIDE]: {
    icon: 'target',
    title: {
      pt: 'Mais Fora',
      en: 'Most Outside',
    },
    description: {
      pt: 'Posicionou coisas fora dos círculos mais vezes',
      en: 'Placed things outside the circles the most',
    },
  },
  [ACHIEVEMENTS.MOST_INTERSECTIONS]: {
    icon: 'brain',
    title: {
      pt: 'Mais Interseções',
      en: 'Most Intersections',
    },
    description: {
      pt: 'Posicionou coisas em interseções mais vezes',
      en: 'Placed things in intersections the most',
    },
  },
  [ACHIEVEMENTS.THE_JUDGE]: {
    icon: 'brain',
    title: {
      pt: 'O Juiz',
      en: 'The Judge',
    },
    description: {
      pt: 'Foi o juiz',
      en: 'Was the judge',
    },
  },
  [ACHIEVEMENTS.MOST_WRONG]: {
    icon: 'face-embarrassed',
    title: {
      pt: 'Mais Errado',
      en: 'Most Wrong',
    },
    description: {
      pt: 'Posicionou coisas erradas mais vezes',
      en: 'Placed things wrong the most',
    },
  },
};

export default achievementsReference;
