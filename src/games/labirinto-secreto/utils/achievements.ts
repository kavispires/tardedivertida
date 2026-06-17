// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FEWEST_CARDS: {
    id: 'FEWEST_CARDS',
    doc: 'Total number of clue cards used',
    icon: 'ellipsis',
    title: {
      en: 'Fewest Cards',
      pt: 'Menos Cartas',
    },
    description: {
      en: 'Used the fewest cards',
      pt: 'Usou o menor número de cartas',
    },
  },
  MOST_CARDS: {
    id: 'MOST_CARDS',
    doc: 'Total number of clue cards used',
    icon: 'list',
    title: {
      en: 'Most Cards',
      pt: 'Mais Cartas',
    },
    description: {
      en: 'Used the most cards',
      pt: 'Usou o maior número de cartas',
    },
  },
  FEWEST_TREES: {
    id: 'FEWEST_TREES',
    doc: 'Total number of trees walked through',
    icon: 'x',
    title: {
      en: 'Fewest Trees',
      pt: 'Menos Árvores',
    },
    description: {
      en: 'Passed by the fewest trees',
      pt: 'Passou pelo menor número de árvores',
    },
  },
  MOST_TREES: {
    id: 'MOST_TREES',
    doc: 'Total number of trees walked through',
    icon: 'tree',
    title: {
      en: 'Most Trees',
      pt: 'Mais Árvores',
    },
    description: {
      en: 'Passed by the most trees',
      pt: 'Passou pelo maior número de árvores',
    },
  },
  MOST_DOWN: {
    id: 'MOST_DOWN',
    doc: 'Number of DOWN movements',
    icon: 'arrow-down',
    title: {
      en: 'South',
      pt: 'Sul',
    },
    description: {
      en: 'Walked more down',
      pt: 'Andou mais para baixo',
    },
  },
  MOST_DOWN_LEFT: {
    id: 'MOST_DOWN_LEFT',
    doc: 'Number of DOWN_LEFT movements',
    icon: 'double-arrow-down',
    title: {
      en: 'Southwest',
      pt: 'Sudoeste',
    },
    description: {
      en: 'Walked more down and left',
      pt: 'Andou mais para baixo e esquerda',
    },
  },
  MOST_DOWN_RIGHT: {
    id: 'MOST_DOWN_RIGHT',
    doc: 'Number of DOWN_RIGHT movements',
    icon: 'double-arrow-down',
    title: {
      en: 'Southeast',
      pt: 'Sudeste',
    },
    description: {
      en: 'Walked more down and right',
      pt: 'Andou mais para baixo e direita',
    },
  },
  BEST_SCOUT: {
    id: 'BEST_SCOUT',
    doc: 'Times player successfully guided others',
    icon: 'foot-prints',
    title: {
      en: 'Best Scout',
      pt: 'Melhor Explorador',
    },
    description: {
      en: 'Hit the correct trees the most times',
      pt: 'Acertou as árvores corretas mais vezes',
    },
  },
  WORST_SCOUT: {
    id: 'WORST_SCOUT',
    doc: 'Times player successfully guided others',
    icon: 'face-tired',
    title: {
      en: 'Confused Scout',
      pt: 'Explorador Confuso',
    },
    description: {
      en: 'Hit the correct trees the fewest times',
      pt: 'Acertou as árvores corretas menos vezes',
    },
  },
  BEST_MAP: {
    id: 'BEST_MAP',
    doc: 'Times player was successfully guided by others',
    icon: 'sun',
    title: {
      en: 'Best Guide',
      pt: 'Melhor Guia',
    },
    description: {
      en: 'Built a map that other players found the correct directions the best',
      pt: 'Construiu um mapa que os outros jogadores melhor encontraram as direções corretas',
    },
  },
  WORST_MAP: {
    id: 'WORST_MAP',
    doc: 'Times player was successfully guided by others',
    icon: 'arrows',
    title: {
      en: 'Diverging Mapper',
      pt: 'Mapeador Divergente',
    },
    description: {
      en: 'Built a map that other players had the most difficulty finding the correct directions',
      pt: 'Construiu um mapa que os outros jogadores tiveram mais dificuldade em encontrar as direções corretas',
    },
  },
  MOST_LEFT: {
    id: 'MOST_LEFT',
    doc: 'Number of LEFT movements',
    icon: 'arrow-left',
    title: {
      en: 'West',
      pt: 'Oeste',
    },
    description: {
      en: 'Walked more left',
      pt: 'Andou mais para esquerda',
    },
  },
  FEWEST_NEGATIVE_CARDS: {
    id: 'FEWEST_NEGATIVE_CARDS',
    doc: 'Total number of negated clue cards used',
    icon: 'plus',
    title: {
      en: 'Fewest Negative Cards',
      pt: 'Menos Cartas Negativas',
    },
    description: {
      en: 'Used the fewest negative cards',
      pt: 'Usou o menor número de cartas negativas',
    },
  },
  MOST_NEGATIVE_CARDS: {
    id: 'MOST_NEGATIVE_CARDS',
    doc: 'Total number of negated clue cards used',
    icon: 'minus',
    title: {
      en: 'Most Negative Adjectives',
      pt: 'Mais Adjetivos Negativos',
    },
    description: {
      en: 'Used the most negative cards',
      pt: 'Usou o maior número de cartas negativas',
    },
  },
  MOST_RIGHT: {
    id: 'MOST_RIGHT',
    doc: 'Number of RIGHT movements',
    icon: 'arrow-right',
    title: {
      en: 'East',
      pt: 'Leste',
    },
    description: {
      en: 'Walked more right',
      pt: 'Andou mais para direita',
    },
  },
  MOST_UP: {
    id: 'MOST_UP',
    doc: 'Number of UP movements',
    icon: 'arrow-up',
    title: {
      en: 'North',
      pt: 'Norte',
    },
    description: {
      en: 'Walked more up',
      pt: 'Andou mais para cima',
    },
  },
  MOST_UP_LEFT: {
    id: 'MOST_UP_LEFT',
    doc: 'Number of UP_LEFT movements',
    icon: 'double-arrow-up',
    title: {
      en: 'Northwest',
      pt: 'Noroeste',
    },
    description: {
      en: 'Walked more up and left',
      pt: 'Andou mais para cima e esquerda',
    },
  },
  MOST_UP_RIGHT: {
    id: 'MOST_UP_RIGHT',
    doc: 'Number of UP_RIGHT movements',
    icon: 'double-arrow-up',
    title: {
      en: 'Northeast',
      pt: 'Nordeste',
    },
    description: {
      en: 'Walked more up and right',
      pt: 'Andou mais para cima e direita',
    },
  },
};

export default achievementsReference;
