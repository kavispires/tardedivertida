// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_CREATOR_EXTRA_CARDS: 'MOST_CREATOR_EXTRA_CARDS',
  MOST_PARTICIPATION: 'MOST_PARTICIPATION',
  LEAST_PARTICIPATION: 'LEAST_PARTICIPATION',
  MOST_REJECTIONS: 'MOST_REJECTIONS',
  FEWEST_REJECTIONS: 'FEWEST_REJECTIONS',
  BEST_CREATOR: 'BEST_CREATOR', // fewest participation on creator turns
  WORST_CREATOR: 'WORST_CREATOR', // most participation on creator turns
  MOST_SKIPS: 'MOST_SKIPS',
  MOST_ACCEPTING: 'MOST_ACCEPTING',
  MOST_DECLINING: 'MOST_DECLINING',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_CREATOR_EXTRA_CARDS]: {
    icon: 'light-bulb',
    title: {
      pt: 'Super Criativo',
      en: 'Super Creative',
    },
    description: {
      pt: 'Foi o criador que mais usou cartas extras além das duas obrigatórias.',
      en: 'Was the creator who used the most extra cards beyond the two mandatory ones.',
    },
  },
  [ACHIEVEMENTS.MOST_PARTICIPATION]: {
    icon: 'earth',
    title: {
      pt: 'Mais participante',
      en: 'Most Participant',
    },
    description: {
      pt: 'Adicionou coisas a categorias criadas por outro jogadores mais vezes.',
      en: 'Added things to categories created by other players the most times.',
    },
  },
  [ACHIEVEMENTS.LEAST_PARTICIPATION]: {
    icon: 'glasses',
    title: {
      pt: 'Mais Solitário',
      en: 'Most Solitary',
    },
    description: {
      pt: 'Adicionou coisas a categorias criadas por outro jogadores menos vezes.',
      en: 'Added things to categories created by other players the least times.',
    },
  },
  [ACHIEVEMENTS.MOST_REJECTIONS]: {
    icon: 'difference',
    title: {
      pt: 'Mais Adicionador Divergente',
      en: 'Most Divergent Adder',
    },
    description: {
      pt: 'Teve suas coisas rejeitadas com mais frequência.',
      en: 'Had their things rejected most frequently.',
    },
  },
  [ACHIEVEMENTS.FEWEST_REJECTIONS]: {
    icon: 'recycle',
    title: {
      pt: 'Mais Adicionador Sábio',
      en: 'Most Wise Adder',
    },
    description: {
      pt: 'Teve suas coisas aceitas com mais frequência.',
      en: 'Had their things accepted most frequently.',
    },
  },
  [ACHIEVEMENTS.BEST_CREATOR]: {
    icon: 'brain',
    title: {
      pt: 'Melhor Criador',
      en: 'Best Creator',
    },
    description: {
      pt: 'Teve menos participação dos outros nas categorias que criou.',
      en: 'Had the least participation of others in the categories they created.',
    },
  },
  [ACHIEVEMENTS.WORST_CREATOR]: {
    icon: 'face-smiley',
    title: {
      pt: 'Senhor Óbvio',
      en: 'Mister Obvious',
    },
    description: {
      pt: 'Criou categorias fáceis que incentivaram a participação de todos.',
      en: 'Created easy categories that encouraged everyone to participate.',
    },
  },
  [ACHIEVEMENTS.MOST_SKIPS]: {
    icon: 'double-arrow-right',
    title: {
      pt: 'Mestre do Desistência',
      en: 'Master of Skipping',
    },
    description: {
      pt: 'Pulou sua vez mais vezes.',
      en: 'Skipped their turn the most times.',
    },
  },
  [ACHIEVEMENTS.MOST_ACCEPTING]: {
    icon: 'plus',
    title: {
      pt: 'Espírito Bondoso',
      en: 'Kind Spirit',
    },
    description: {
      pt: 'Aceitou mais coisas nas categorias dos outros jogadores.',
      en: "Accepted the most things in other players' categories.",
    },
  },
  [ACHIEVEMENTS.MOST_DECLINING]: {
    icon: 'x',
    title: {
      pt: 'Crítico Ácido',
      en: 'Acidic Critic',
    },
    description: {
      pt: 'Rejeitou mais coisas nas categorias dos outros jogadores.',
      en: "Rejected the most things in other players' categories.",
    },
  },
};

export default achievementsReference;
