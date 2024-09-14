// Types
import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  BEST_QUARTER_BETS: 'BEST_QUARTER_BETS',
  BEST_SEMI_BETS: 'BEST_SEMI_BETS',
  BEST_FINAL_BETS: 'BEST_FINAL_BETS',
  BEST_OVERALL_BETS: 'BEST_OVERALL_BETS',
  WORST_QUARTER_BETS: 'WORST_QUARTER_BETS',
  WORST_SEMI_BETS: 'WORST_SEMI_BETS',
  WORST_FINAL_BETS: 'WORST_FINAL_BETS',
  WORST_OVERALL_BETS: 'WORST_OVERALL_BETS',
  BEST_QUARTER_CONTENDERS: 'BEST_QUARTER_CONTENDERS',
  BEST_SEMI_CONTENDERS: 'BEST_SEMI_CONTENDERS',
  BEST_FINAL_CONTENDERS: 'BEST_FINAL_CONTENDERS',
  WORST_QUARTER_CONTENDERS: 'WORST_QUARTER_CONTENDERS',
  WORST_SEMI_CONTENDERS: 'WORST_SEMI_CONTENDERS',
  WORST_FINAL_CONTENDERS: 'WORST_FINAL_CONTENDERS',
  BEST_CONTENDERS: 'BEST_CONTENDERS',
  WORST_CONTENDER: 'WORST_CONTENDER',
  MOST_GROUP_VOTES: 'MOST_GROUP_VOTES',
  SOLITAIRE_VOTE: 'SOLITAIRE_VOTE',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.BEST_QUARTER_BETS]: {
    icon: 'four',
    title: {
      en: 'Best Quarter Bets',
      pt: 'Melhores Apostas de Quartas',
    },
    description: {
      en: 'Won the most quarter bets',
      pt: 'Ganhou mais apostas de quartas',
    },
  },
  [ACHIEVEMENTS.BEST_SEMI_BETS]: {
    icon: 'two',
    title: {
      en: 'Best Semi Bets',
      pt: 'Melhores Apostas de Semis',
    },
    description: {
      en: 'Won the most semi bets',
      pt: 'Ganhou mais apostas de semis',
    },
  },
  [ACHIEVEMENTS.BEST_FINAL_BETS]: {
    icon: 'one',
    title: {
      en: 'Best Final Bets',
      pt: 'Melhores Apostas de Final',
    },
    description: {
      en: 'Won the most final bets',
      pt: 'Ganhou mais apostas de final',
    },
  },
  [ACHIEVEMENTS.BEST_OVERALL_BETS]: {
    icon: 'money-bag',
    title: {
      en: 'Best Overall Bets',
      pt: 'Melhores Apostas',
    },
    description: {
      en: 'Won the most overall bets',
      pt: 'Ganhou mais apostas gerais',
    },
  },
  [ACHIEVEMENTS.WORST_QUARTER_BETS]: {
    icon: 'four',
    title: {
      en: 'Worst Quarter Bets',
      pt: 'Piores Apostas de Quartas',
    },
    description: {
      en: 'Lost the most quarter bets',
      pt: 'Perdeu mais apostas de quartas',
    },
  },
  [ACHIEVEMENTS.WORST_SEMI_BETS]: {
    icon: 'two',
    title: {
      en: 'Worst Semi Bets',
      pt: 'Piores Apostas de Semis',
    },
    description: {
      en: 'Lost the most semi bets',
      pt: 'Perdeu mais apostas de semis',
    },
  },
  [ACHIEVEMENTS.WORST_FINAL_BETS]: {
    icon: 'one',
    title: {
      en: 'Worst Final Bets',
      pt: 'Piores Apostas de Final',
    },
    description: {
      en: 'Lost the most final bets',
      pt: 'Perdeu mais apostas de final',
    },
  },
  [ACHIEVEMENTS.WORST_OVERALL_BETS]: {
    icon: 'chip',
    title: {
      en: 'Worst Overall Bets',
      pt: 'Piores Apostas Gerais',
    },
    description: {
      en: 'Lost the most overall bets',
      pt: 'Perdeu mais apostas gerais',
    },
  },
  [ACHIEVEMENTS.BEST_QUARTER_CONTENDERS]: {
    icon: 'four',
    title: {
      en: 'Best Quarter Contenders',
      pt: 'Melhores Competidores de Quartas',
    },
    description: {
      en: 'Their contenders won the most quarter battles',
      pt: 'Seus competidores ganharam mais batalhas de quartas',
    },
  },
  [ACHIEVEMENTS.BEST_SEMI_CONTENDERS]: {
    icon: 'two',
    title: {
      en: 'Best Semi Contenders',
      pt: 'Melhores Competidores de Semis',
    },
    description: {
      en: 'Their contenders won the most semi battles',
      pt: 'Seus competidores ganharam mais batalhas de semis',
    },
  },
  [ACHIEVEMENTS.BEST_FINAL_CONTENDERS]: {
    icon: 'one',
    title: {
      en: 'Best Final Contenders',
      pt: 'Melhores Competidores de Finais',
    },
    description: {
      en: 'Their contenders won the most final battles',
      pt: 'Seus competidores ganharam mais batalhas de final',
    },
  },
  [ACHIEVEMENTS.WORST_QUARTER_CONTENDERS]: {
    icon: 'four',
    title: {
      en: 'Worst Quarter Contenders',
      pt: 'Piores Competidores de Quartas',
    },
    description: {
      en: 'Their contenders lost the most quarter battles',
      pt: 'Seus competidores perderam mais batalhas de quartas',
    },
  },
  [ACHIEVEMENTS.WORST_SEMI_CONTENDERS]: {
    icon: 'two',
    title: {
      en: 'Worst Semi Contenders',
      pt: 'Piores Competidores de Semis',
    },
    description: {
      en: 'Their contenders lost the most semi battles',
      pt: 'Seus competidores perderam mais batalhas de semis',
    },
  },
  [ACHIEVEMENTS.WORST_FINAL_CONTENDERS]: {
    icon: 'one',
    title: {
      en: 'Worst Final Contenders',
      pt: 'Piores Competidores de Finais',
    },
    description: {
      en: 'Their contenders lost the most final battles',
      pt: 'Seus competidores perderam mais batalhas de final',
    },
  },
  [ACHIEVEMENTS.BEST_CONTENDERS]: {
    icon: 'people',
    title: {
      en: 'Best Contenders',
      pt: 'Melhores Competidores',
    },
    description: {
      en: 'Their contenders won the most battles',
      pt: 'Seus competidores ganharam mais batalhas',
    },
  },
  [ACHIEVEMENTS.WORST_CONTENDER]: {
    icon: 'paint',
    title: {
      en: 'Worst Contenders',
      pt: 'Pior Competidores',
    },
    description: {
      en: 'Their contender lost the most battles',
      pt: 'Seu competidor perdeu mais batalhas',
    },
  },
  [ACHIEVEMENTS.MOST_GROUP_VOTES]: {
    icon: 'equal',
    title: {
      en: 'Best Common Sense',
      pt: 'Melhor Senso Comum',
    },
    description: {
      en: 'Voted with the majority the most times',
      pt: 'Votou com a maioria mais vezes',
    },
  },
  [ACHIEVEMENTS.SOLITAIRE_VOTE]: {
    icon: 'face-tired',
    title: {
      en: 'Solitaire Vote',
      pt: 'Voto Solitário',
    },
    description: {
      en: 'Voted alone the most times',
      pt: 'Votou sozinho mais vezes',
    },
  },
};

export default achievementsReference;
