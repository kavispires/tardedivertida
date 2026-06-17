// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  ACCIDENTAL_BOMBER: {
    id: 'ACCIDENTAL_BOMBER',
    doc: 'Times exploding the bomb as an agent',
    icon: 'skull',
    title: {
      en: 'Incompetent Agent',
      pt: 'Agente Incompetente',
    },
    description: {
      en: 'Was an agent and chose the bomb by accident',
      pt: 'Era um agente e escolheu a bomba por acidente',
    },
  },
  FEWEST_BLANKS: {
    id: 'FEWEST_BLANKS',
    doc: 'Blank cards drawn',
    icon: 'eye',
    title: {
      en: 'Attentive Player',
      pt: 'Jogador Atento',
    },
    description: {
      en: 'Revealed the lowest number of blank cards',
      pt: 'Revelou o menor número de cartas em branco',
    },
  },
  MOST_BLANKS: {
    id: 'MOST_BLANKS',
    doc: 'Blank cards drawn',
    icon: 'minus',
    title: {
      en: 'Inattentive Player',
      pt: 'Jogador Desatento',
    },
    description: {
      en: 'Revealed the highest number of blank cards',
      pt: 'Revelou o maior número de cartas em branco',
    },
  },
  LEAST_TRUSTED: {
    id: 'LEAST_TRUSTED',
    doc: 'Times being picked for examination',
    icon: 'broken-chain',
    title: {
      en: 'Questionable',
      pt: 'Duvidoso',
    },
    description: {
      en: 'Was the player least chosen to be examined',
      pt: 'Foi o jogador menos escolhido para ser examinado',
    },
  },
  MOST_TRUSTED: {
    id: 'MOST_TRUSTED',
    doc: 'Times being picked for examination',
    icon: 'target',
    title: {
      en: 'Most Trusted',
      pt: 'Mais Confiável',
    },
    description: {
      en: 'Was the player most chosen to be examined',
      pt: 'Foi o jogador mais escolhido para ser examinado',
    },
  },
  SOLO_TERRORIST: {
    id: 'SOLO_TERRORIST',
    doc: 'Times being a terrorist',
    icon: 'one',
    title: {
      en: 'Solo Terrorist',
      pt: 'Terrorista Solo',
    },
    description: {
      en: 'Was the only terrorist in the game',
      pt: 'Foi o único terrorista do jogo',
    },
  },
  BEST_TERRORIST: {
    id: 'BEST_TERRORIST',
    doc: 'Times exploding the bomb as a terrorist',
    icon: 'fire',
    title: {
      en: 'Best Terrorist',
      pt: 'Melhor Terrorista',
    },
    description: {
      en: 'Was a terrorist and chose the bomb',
      pt: 'Era um terrorista e escolheu a bomba',
    },
  },
  FEWEST_WIRES: {
    id: 'FEWEST_WIRES',
    doc: 'Red wires drawn',
    icon: 'double-arrow-down',
    title: {
      en: 'Beginner Agent',
      pt: 'Agente Iniciante',
    },
    description: {
      en: 'Found the lowest number of red wires',
      pt: 'Encontrou o menor número de fios vermelhos',
    },
  },
  MOST_WIRES: {
    id: 'MOST_WIRES',
    doc: 'Red wires drawn',
    icon: 'double-arrow-up',
    title: {
      en: 'Best Agent',
      pt: 'Melhor Agente',
    },
    description: {
      en: 'Found the highest number of red wires',
      pt: 'Encontrou o maior número de fios vermelhos',
    },
  },
};

export default achievementsReference;
