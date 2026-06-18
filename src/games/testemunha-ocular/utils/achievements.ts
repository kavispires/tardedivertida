// Types
import type { AchievementReference } from 'types/game';

export const achievementsReference: AchievementReference = {
  FOUND_THE_PERPETRATOR: {
    id: 'FOUND_THE_PERPETRATOR',
    doc: 'foundThePerpetrator',
    icon: 'brain',
    title: {
      en: 'Criminal Hunter',
      pt: 'Caçador de Criminosos',
    },
    description: {
      en: 'You found out who the perpetrator was when no one else could',
      pt: 'Você descobriu quem era o criminoso quando ninguém mais conseguiu',
    },
  },
  BEST_QUESTIONS: {
    id: 'BEST_QUESTIONS',
    doc: 'releases',
    icon: 'dialog',
    title: {
      en: 'Best Questions',
      pt: 'Melhores Perguntas',
    },
    description: {
      en: 'Your questions eliminated more suspects',
      pt: 'Suas perguntas eliminaram mais suspeitos',
    },
  },
  MOST_USELESS_QUESTIONS: {
    id: 'MOST_USELESS_QUESTIONS',
    doc: 'releases',
    icon: 'broken-chain',
    title: {
      en: 'Least Useful Questions',
      pt: 'Perguntas Menos Úteis',
    },
    description: {
      en: 'Your questions eliminated fewer suspects',
      pt: 'Suas perguntas eliminaram menos suspeitos',
    },
  },
  PLAYED_AS_WITNESS: {
    id: 'PLAYED_AS_WITNESS',
    doc: 'witness',
    icon: 'glasses',
    title: {
      en: 'Witness',
      pt: 'Testemunha Ocular',
    },
    description: {
      en: 'Played as a witness',
      pt: 'Jogou como testemunha',
    },
  },
};

export default achievementsReference;
