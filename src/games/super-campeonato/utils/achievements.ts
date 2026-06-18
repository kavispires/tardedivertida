// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  BEST_OVERALL_BETS: {
    id: 'BEST_OVERALL_BETS',
    doc: 'total bets won',
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
  WORST_OVERALL_BETS: {
    id: 'WORST_OVERALL_BETS',
    doc: 'total bets won',
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
  BEST_CONTENDERS: {
    id: 'BEST_CONTENDERS',
    doc: 'total contenders won',
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
  WORST_CONTENDERS: {
    id: 'WORST_CONTENDERS',
    doc: 'total contenders won',
    icon: 'paint',
    title: {
      en: 'Worst Contenders',
      pt: 'Piores Competidores',
    },
    description: {
      en: 'Their contenders lost the most battles',
      pt: 'Seus competidores perderam mais batalhas',
    },
  },
  BEST_FINAL_BETS: {
    id: 'BEST_FINAL_BETS',
    doc: 'times won during final',
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
  WORST_FINAL_BETS: {
    id: 'WORST_FINAL_BETS',
    doc: 'times won during final',
    icon: 'one-silver',
    title: {
      en: 'Worst Final Bets',
      pt: 'Piores Apostas de Final',
    },
    description: {
      en: 'Lost the most final bets',
      pt: 'Perdeu mais apostas de final',
    },
  },
  BEST_FINAL_CONTENDERS: {
    id: 'BEST_FINAL_CONTENDERS',
    doc: 'own contender won during final',
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
  WORST_FINAL_CONTENDERS: {
    id: 'WORST_FINAL_CONTENDERS',
    doc: 'own contender won during final',
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
  MOST_GROUP_VOTES: {
    id: 'MOST_GROUP_VOTES',
    doc: 'voted on a contender with other players',
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
  BEST_QUARTER_BETS: {
    id: 'BEST_QUARTER_BETS',
    doc: 'times won during quarter finals',
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
  WORST_QUARTER_BETS: {
    id: 'WORST_QUARTER_BETS',
    doc: 'times won during quarter finals',
    icon: 'four-silver',
    title: {
      en: 'Worst Quarter Bets',
      pt: 'Piores Apostas de Quartas',
    },
    description: {
      en: 'Lost the most quarter bets',
      pt: 'Perdeu mais apostas de quartas',
    },
  },
  BEST_QUARTER_CONTENDERS: {
    id: 'BEST_QUARTER_CONTENDERS',
    doc: 'own contender won during quarter finals',
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
  WORST_QUARTER_CONTENDERS: {
    id: 'WORST_QUARTER_CONTENDERS',
    doc: 'own contender won during quarter finals',
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
  BEST_SEMI_BETS: {
    id: 'BEST_SEMI_BETS',
    doc: 'times won during semi finals',
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
  WORST_SEMI_BETS: {
    id: 'WORST_SEMI_BETS',
    doc: 'times won during semi finals',
    icon: 'two-silver',
    title: {
      en: 'Worst Semi Bets',
      pt: 'Piores Apostas de Semis',
    },
    description: {
      en: 'Lost the most semi bets',
      pt: 'Perdeu mais apostas de semis',
    },
  },
  BEST_SEMI_CONTENDERS: {
    id: 'BEST_SEMI_CONTENDERS',
    doc: 'own contender won during semi finals',
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
  WORST_SEMI_CONTENDERS: {
    id: 'WORST_SEMI_CONTENDERS',
    doc: 'own contender won during semi finals',
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
  SOLITAIRE_VOTE: {
    id: 'SOLITAIRE_VOTE',
    doc: 'voted on a contender alone',
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
