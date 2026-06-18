// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  MOST_ATTRIBUTE_CIRCLE: {
    id: 'MOST_ATTRIBUTE_CIRCLE',
    doc: 'items placed in the attribute circle',
    icon: 'check-mark',
    title: {
      en: 'Most Attributes',
      pt: 'Mais Atributos',
    },
    description: {
      en: 'Placed things in the blue circle (attribute) the most',
      pt: 'Posicionou coisas no círculo azul (atributo) mais vezes',
    },
  },
  MOST_CONTEXT_CIRCLE: {
    id: 'MOST_CONTEXT_CIRCLE',
    doc: 'items placed in the context circle',
    icon: 'arrow-wide',
    title: {
      en: 'Most Contexts',
      pt: 'Mais Contextos',
    },
    description: {
      en: 'Placed things in the green circle (context) the most',
      pt: 'Posicionou coisas no círculo verde (contexto) mais vezes',
    },
  },
  MOST_INTERSECTIONS: {
    id: 'MOST_INTERSECTIONS',
    doc: 'items placed in an intersection',
    icon: 'brain',
    title: {
      en: 'Most Intersections',
      pt: 'Mais Interseções',
    },
    description: {
      en: 'Placed things in intersections the most',
      pt: 'Posicionou coisas em interseções mais vezes',
    },
  },
  THE_JUDGE: {
    id: 'THE_JUDGE',
    doc: 'was the judge',
    icon: 'brain',
    title: {
      en: 'The Judge',
      pt: 'O Juiz',
    },
    description: {
      en: 'Was the judge',
      pt: 'Foi o juiz',
    },
  },
  MOST_OUTSIDE: {
    id: 'MOST_OUTSIDE',
    doc: 'items placed outside the circles',
    icon: 'target',
    title: {
      en: 'Most Outside',
      pt: 'Mais Fora',
    },
    description: {
      en: 'Placed things outside the circles the most',
      pt: 'Posicionou coisas fora dos círculos mais vezes',
    },
  },
  MOST_WORD_CIRCLE: {
    id: 'MOST_WORD_CIRCLE',
    doc: 'items placed in the word circle',
    icon: 'people',
    title: {
      en: 'Most Words',
      pt: 'Mais Palavras',
    },
    description: {
      en: 'Placed things in the yellow circle (word) the most',
      pt: 'Posicionou coisas no círculo amarelo (palavra) mais vezes',
    },
  },
  MOST_WRONG: {
    id: 'MOST_WRONG',
    doc: 'was wrong',
    icon: 'face-embarrassed',
    title: {
      en: 'Most Wrong',
      pt: 'Mais Errado',
    },
    description: {
      en: 'Placed things wrong the most',
      pt: 'Posicionou coisas erradas mais vezes',
    },
  },
};

export default achievementsReference;
