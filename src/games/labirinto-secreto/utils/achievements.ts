import { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_CARDS: 'MOST_CARDS',
  FEWEST_CARDS: 'FEWEST_CARDS',
  MOST_NEGATIVE_CARDS: 'MOST_NEGATIVE_CARDS',
  FEWEST_NEGATIVE_CARDS: 'FEWEST_NEGATIVE_CARDS',
  MOST_TREES: 'MOST_TREES',
  FEWEST_TREES: 'FEWEST_TREES',
  BEST_MAP: 'BEST_MAP',
  WORST_MAP: 'WORST_MAP',
  BEST_SCOUT: 'BEST_SCOUT',
  WORST_SCOUT: 'WORST_SCOUT',
  MOST_UP: 'MOST_UP',
  MOST_RIGHT: 'MOST_RIGHT',
  MOST_DOWN: 'MOST_DOWN',
  MOST_LEFT: 'MOST_LEFT',
  MOST_UP_LEFT: 'MOST_UP_LEFT',
  MOST_UP_RIGHT: 'MOST_UP_RIGHT',
  MOST_DOWN_LEFT: 'MOST_DOWN_LEFT',
  MOST_DOWN_RIGHT: 'MOST_DOWN_RIGHT',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_CARDS]: {
    icon: 'list',
    title: {
      pt: 'Mais Cartas',
      en: 'Most Cards',
    },
    description: {
      pt: 'Usou o maior número de cartas',
      en: 'Used the most cards',
    },
  },
  [ACHIEVEMENTS.FEWEST_CARDS]: {
    icon: 'ellipsis',
    title: {
      pt: 'Menos Cartas',
      en: 'Fewest Cards',
    },
    description: {
      pt: 'Usou o menor número de cartas',
      en: 'Used the fewest cards',
    },
  },
  [ACHIEVEMENTS.MOST_NEGATIVE_CARDS]: {
    icon: 'minus',
    title: {
      pt: 'Mais Adjetivos Negativos',
      en: 'Most Negative Adjectives',
    },
    description: {
      pt: 'Usou o maior número de cartas negativas',
      en: 'Used the most negative cards',
    },
  },
  [ACHIEVEMENTS.FEWEST_NEGATIVE_CARDS]: {
    icon: 'plus',
    title: {
      pt: 'Menos Cartas Negativas',
      en: 'Fewest Negative Cards',
    },
    description: {
      pt: 'Usou o menor número de cartas negativas',
      en: 'Used the fewest negative cards',
    },
  },
  [ACHIEVEMENTS.MOST_TREES]: {
    icon: 'tree',
    title: {
      pt: 'Mais Árvores',
      en: 'Most Trees',
    },
    description: {
      pt: 'Passou pelo maior número de árvores',
      en: 'Passed by the most trees',
    },
  },
  [ACHIEVEMENTS.FEWEST_TREES]: {
    icon: 'x',
    title: {
      pt: 'Menos Árvores',
      en: 'Fewest Trees',
    },
    description: {
      pt: 'Passou pelo menor número de árvores',
      en: 'Passed by the fewest trees',
    },
  },
  [ACHIEVEMENTS.BEST_MAP]: {
    icon: 'sun',
    title: {
      pt: 'Melhor Guia',
      en: 'Best Guide',
    },
    description: {
      pt: 'Construiu um mapa que os outros jogadores melhor encontraram as direções corretas',
      en: 'Built a map that other players found the correct directions the best',
    },
  },
  [ACHIEVEMENTS.WORST_MAP]: {
    icon: 'arrows',
    title: {
      pt: 'Mapeador Divergente',
      en: 'Diverging Mapper',
    },
    description: {
      pt: 'Construiu um mapa que os outros jogadores tiveram mais dificuldade em encontrar as direções corretas',
      en: 'Built a map that other players had the most difficulty finding the correct directions',
    },
  },
  [ACHIEVEMENTS.BEST_SCOUT]: {
    icon: 'foot-prints',
    title: {
      pt: 'Melhor Explorador',
      en: 'Best Scout',
    },
    description: {
      pt: 'Acertou as árvores corretas mais vezes',
      en: 'Hit the correct trees the most times',
    },
  },
  [ACHIEVEMENTS.WORST_SCOUT]: {
    icon: 'face-tired',
    title: {
      pt: 'Explorador Confuso',
      en: 'Confused Scout',
    },
    description: {
      pt: 'Acertou as árvores corretas menos vezes',
      en: 'Hit the correct trees the fewest times',
    },
  },
  [ACHIEVEMENTS.MOST_UP]: {
    icon: 'arrow-up',
    title: {
      pt: 'Norte',
      en: 'North',
    },
    description: {
      pt: 'Andou mais para cima',
      en: 'Walked more up',
    },
  },
  [ACHIEVEMENTS.MOST_RIGHT]: {
    icon: 'arrow-right',
    title: {
      pt: 'Leste',
      en: 'East',
    },
    description: {
      pt: 'Andou mais para direita',
      en: 'Walked more right',
    },
  },
  [ACHIEVEMENTS.MOST_DOWN]: {
    icon: 'arrow-down',
    title: {
      pt: 'Sul',
      en: 'South',
    },
    description: {
      pt: 'Andou mais para baixo',
      en: 'Walked more down',
    },
  },
  [ACHIEVEMENTS.MOST_LEFT]: {
    icon: 'arrow-left',
    title: {
      pt: 'Oeste',
      en: 'West',
    },
    description: {
      pt: 'Andou mais para esquerda',
      en: 'Walked more left',
    },
  },
  [ACHIEVEMENTS.MOST_UP_LEFT]: {
    icon: 'double-arrow-up',
    title: {
      pt: 'Noroeste',
      en: 'Northwest',
    },
    description: {
      pt: 'Andou mais para cima e esquerda',
      en: 'Walked more up and left',
    },
  },
  [ACHIEVEMENTS.MOST_UP_RIGHT]: {
    icon: 'double-arrow-up',
    title: {
      pt: 'Nordeste',
      en: 'Northeast',
    },
    description: {
      pt: 'Andou mais para cima e direita',
      en: 'Walked more up and right',
    },
  },
  [ACHIEVEMENTS.MOST_DOWN_LEFT]: {
    icon: 'double-arrow-down',
    title: {
      pt: 'Sudoeste',
      en: 'Southwest',
    },
    description: {
      pt: 'Andou mais para baixo e esquerda',
      en: 'Walked more down and left',
    },
  },
  [ACHIEVEMENTS.MOST_DOWN_RIGHT]: {
    icon: 'double-arrow-down',
    title: {
      pt: 'Sudeste',
      en: 'Southeast',
    },
    description: {
      pt: 'Andou mais para baixo e direita',
      en: 'Walked more down and right',
    },
  },
};
