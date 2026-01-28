// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  SOLO_TERRORIST: 'SOLO_TERRORIST',
  BEST_TERRORIST: 'BEST_TERRORIST',
  ACCIDENTAL_BOMBER: 'ACCIDENTAL_BOMBER',
  MOST_TRUSTED: 'MOST_TRUSTED',
  LEAST_TRUSTED: 'LEAST_TRUSTED',
  MOST_WIRES: 'MOST_WIRES',
  FEWEST_WIRES: 'FEWEST_WIRES',
  MOST_BLANKS: 'MOST_BLANKS',
  FEWEST_BLANKS: 'FEWEST_BLANKS',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.SOLO_TERRORIST]: {
    icon: 'one',
    title: {
      pt: 'Terrorista Solo',
      en: 'Solo Terrorist',
    },
    description: {
      pt: 'Foi o único terrorista do jogo',
      en: 'Was the only terrorist in the game',
    },
  },
  [ACHIEVEMENTS.BEST_TERRORIST]: {
    icon: 'fire',
    title: {
      pt: 'Melhor Terrorista',
      en: 'Best Terrorist',
    },
    description: {
      pt: 'Era um terrorista e escolheu a bomba',
      en: 'Was a terrorist and chose the bomb',
    },
  },
  [ACHIEVEMENTS.ACCIDENTAL_BOMBER]: {
    icon: 'skull',
    title: {
      pt: 'Agente Incompetente',
      en: 'Incompetent Agent',
    },
    description: {
      pt: 'Era um agente e escolheu a bomba por acidente',
      en: 'Was an agent and chose the bomb by accident',
    },
  },
  [ACHIEVEMENTS.MOST_TRUSTED]: {
    icon: 'target',
    title: {
      pt: 'Mais Confiável',
      en: 'Most Trusted',
    },
    description: {
      pt: 'Foi o jogador mais escolhido para ser examinado',
      en: 'Was the player most chosen to be examined',
    },
  },
  [ACHIEVEMENTS.LEAST_TRUSTED]: {
    icon: 'broken-chain',
    title: {
      pt: 'Duvidoso',
      en: 'Questionable',
    },
    description: {
      pt: 'Foi o jogador menos escolhido para ser examinado',
      en: 'Was the player least chosen to be examined',
    },
  },
  [ACHIEVEMENTS.MOST_WIRES]: {
    icon: 'double-arrow-up',
    title: {
      pt: 'Melhor Agente',
      en: 'Best Agent',
    },
    description: {
      pt: 'Encontrou o maior número de fios vermelhos',
      en: 'Found the highest number of red wires',
    },
  },
  [ACHIEVEMENTS.FEWEST_WIRES]: {
    icon: 'double-arrow-down',
    title: {
      pt: 'Agente Iniciante',
      en: 'Beginner Agent',
    },
    description: {
      pt: 'Encontrou o menor número de fios vermelhos',
      en: 'Found the lowest number of red wires',
    },
  },
  [ACHIEVEMENTS.MOST_BLANKS]: {
    icon: 'minus',
    title: {
      pt: 'Jogador Desatento',
      en: 'Inattentive Player',
    },
    description: {
      pt: 'Revelou o maior número de cartas em branco',
      en: 'Revealed the highest number of blank cards',
    },
  },
  [ACHIEVEMENTS.FEWEST_BLANKS]: {
    icon: 'eye',
    title: {
      pt: 'Jogador Atento',
      en: 'Attentive Player',
    },
    description: {
      pt: 'Revelou o menor número de cartas em branco',
      en: 'Revealed the lowest number of blank cards',
    },
  },
};

export default achievementsReference;
