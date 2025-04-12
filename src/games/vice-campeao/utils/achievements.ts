// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_FIRST_PLACE: 'MOST_FIRST_PLACE',
  MOST_SECOND_PLACE: 'MOST_SECOND_PLACE',
  MOST_THIRD_PLACE: 'MOST_THIRD_PLACE',
  MOST_LAST_PLACE: 'MOST_LAST_PLACE',
  MOST_SECOND_TO_LAST_PLACE: 'MOST_SECOND_TO_LAST_PLACE',
  MOST_NO_MOVEMENT: 'MOST_NO_MOVEMENT', // ok
  MOST_SELF_CARDS: 'MOST_SELF_CARDS', // ok
  MOST_OTHER_CARDS: 'MOST_OTHER_CARDS', // ok
  MOST_MOVEMENT: 'MOST_MOVEMENT', // ok
  LEAST_MOVEMENT: 'LEAST_MOVEMENT', // ok
} as const;

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_FIRST_PLACE]: {
    icon: 'one',
    title: {
      pt: 'Mais primeiros lugares',
      en: 'Most first places',
    },
    description: {
      pt: 'Esteve em primeiro lugar mais rodadas que qualquer outro jogador.',
      en: 'You were in first place more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_SECOND_PLACE]: {
    icon: 'two',
    title: {
      pt: 'Mais segundos lugares',
      en: 'Most second places',
    },
    description: {
      pt: 'Esteve em segundo lugar mais rodadas que qualquer outro jogador.',
      en: 'You were in second place more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_THIRD_PLACE]: {
    icon: 'three',
    title: {
      pt: 'Mais terceiros lugares',
      en: 'Most third places',
    },
    description: {
      pt: 'Esteve em terceiro lugar mais rodadas que qualquer outro jogador.',
      en: 'You were in third place more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_LAST_PLACE]: {
    icon: 'zero',
    title: {
      pt: 'Mais últimos lugares',
      en: 'Most last places',
    },
    description: {
      pt: 'Esteve em último lugar mais rodadas que qualquer outro jogador.',
      en: 'You were in last place more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_SECOND_TO_LAST_PLACE]: {
    icon: 'x',
    title: {
      pt: 'Mais penúltimos lugares',
      en: 'Most second to last places',
    },
    description: {
      pt: 'Esteve em penúltimo lugar mais rodadas que qualquer outro jogador.',
      en: 'You were in second to last place more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_NO_MOVEMENT]: {
    icon: 'face-tired',
    title: {
      pt: 'Mais sem movimento',
      en: 'Most no movement',
    },
    description: {
      pt: 'Não se moveu mais rodadas que qualquer outro jogador.',
      en: 'Did not move more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_SELF_CARDS]: {
    icon: 'card',
    title: {
      pt: 'Mais cartas próprias',
      en: 'Most self cards',
    },
    description: {
      pt: 'Usou si mesmo como corredor-alvo mais que qualquer outro jogador.',
      en: 'Used yourself as target runner more than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_OTHER_CARDS]: {
    icon: 'people',
    title: {
      pt: 'Mais cartas de outros',
      en: 'Most other cards',
    },
    description: {
      pt: 'Usou outros como corredor-alvo mais que qualquer outro jogador.',
      en: 'Used others as target runner more than any other player.',
    },
  },
  [ACHIEVEMENTS.MOST_MOVEMENT]: {
    icon: 'hare',
    title: {
      pt: 'Mais movimento',
      en: 'Most movement',
    },
    description: {
      pt: 'Se moveu mais rodadas que qualquer outro jogador.',
      en: 'Moved more rounds than any other player.',
    },
  },
  [ACHIEVEMENTS.LEAST_MOVEMENT]: {
    icon: 'snail',
    title: {
      pt: 'Menos movimento',
      en: 'Least movement',
    },
    description: {
      pt: 'Se moveu menos rodadas que qualquer outro jogador.',
      en: 'Moved less rounds than any other player.',
    },
  },
};

export default achievementsReference;
