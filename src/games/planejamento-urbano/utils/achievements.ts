// Types
import type { AchievementReference } from 'types/achievements';

const ACHIEVEMENTS = {
  MOST_CONE_A_LEFT: 'MOST_CONE_A_LEFT',
  MOST_CONE_B_LEFT: 'MOST_CONE_B_LEFT',
  MOST_CONE_C_LEFT: 'MOST_CONE_C_LEFT',
  MOST_CONE_D_LEFT: 'MOST_CONE_D_LEFT',
  MOST_ARCHITECT_MATCHES: 'MOST_ARCHITECT_MATCHES',
  MOST_OTHER_PLAYERS_MATCHES: 'MOST_OTHER_PLAYERS_MATCHES',
  MOST_SOLO_GUESSES: 'MOST_SOLO_GUESSES',
};

export const achievementsReference: AchievementReference = {
  [ACHIEVEMENTS.MOST_CONE_A_LEFT]: {
    icon: 'cone',
    title: {
      pt: 'Cone A',
      en: 'Cone A',
    },
    description: {
      pt: 'Deixou o Cone A sobrando mais vezes',
      en: 'Left Cone A unused the most',
    },
  },
  [ACHIEVEMENTS.MOST_CONE_B_LEFT]: {
    icon: 'cone',
    title: {
      pt: 'Cone B',
      en: 'Cone B',
    },
    description: {
      pt: 'Deixou o Cone B sobrando mais vezes',
      en: 'Left Cone B unused the most',
    },
  },
  [ACHIEVEMENTS.MOST_CONE_C_LEFT]: {
    icon: 'cone',
    title: {
      pt: 'Cone C',
      en: 'Cone C',
    },
    description: {
      pt: 'Deixou o Cone C sobrando mais vezes',
      en: 'Left Cone C unused the most',
    },
  },
  [ACHIEVEMENTS.MOST_CONE_D_LEFT]: {
    icon: 'cone',
    title: {
      pt: 'Cone D',
      en: 'Cone D',
    },
    description: {
      pt: 'Deixou o Cone D sobrando mais vezes',
      en: 'Left Cone D unused the most',
    },
  },
  [ACHIEVEMENTS.MOST_ARCHITECT_MATCHES]: {
    icon: 'glasses',
    title: {
      pt: 'Melhor Arquiteto',
      en: 'Best Architect',
    },
    description: {
      pt: 'Mais jogadores acertaram o planejamento do arquiteto',
      en: "Most players matched the architect's plan",
    },
  },
  [ACHIEVEMENTS.MOST_OTHER_PLAYERS_MATCHES]: {
    icon: 'people',
    title: {
      pt: 'Conformista',
      en: 'Conformist',
    },
    description: {
      pt: 'Mais jogadores acertaram o planejamento junto com você, mesmo que estivesse errado',
      en: 'Most players matched the plan along with you, even if it was wrong',
    },
  },
  [ACHIEVEMENTS.MOST_SOLO_GUESSES]: {
    icon: 'face-embarrassed',
    title: {
      pt: 'Lobo Solitário',
      en: 'Lone Wolf',
    },
    description: {
      pt: 'Mais vezes você acertou o planejamento sozinho',
      en: 'Most times you matched the plan alone',
    },
  },
};

export default achievementsReference;
